import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import BillingAdminPage from "./index";
import * as api from "../../api/services/subscription/billingAdminApi";

jest.mock("../../api/services/subscription/billingAdminApi", () => ({
  getBillingAdminCapabilities: jest.fn(), getAdminPlans: jest.fn(),
  getAdminTenants: jest.fn(), createAdminPlan: jest.fn(), updateAdminPlan: jest.fn(),
  deleteAdminPlan: jest.fn(), extendTenantAccess: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  api.getBillingAdminCapabilities.mockResolvedValue({ data: { canManageBilling: true } });
  api.getAdminPlans.mockResolvedValue({ data: [] });
  api.getAdminTenants.mockResolvedValue({ data: { tenants: [], hasMore: false } });
});

test("denied users cannot load administration data", async () => {
  api.getBillingAdminCapabilities.mockResolvedValue({ data: { canManageBilling: false } });
  render(<BillingAdminPage />);
  expect(await screen.findByText("Restricted billing administration")).toBeInTheDocument();
  expect(api.getAdminPlans).not.toHaveBeenCalled();
  expect(api.getAdminTenants).not.toHaveBeenCalled();
});

test("deleting a plan requires confirmation and explains existing subscriptions", async () => {
  api.getAdminPlans.mockResolvedValue({ data: [{ code: "monthly", name: "Monthly", amount: 100, currency: "INR", interval: "monthly", isActive: true }] });
  api.deleteAdminPlan.mockResolvedValue({ data: {} });
  render(<BillingAdminPage />);
  fireEvent.click(await screen.findByRole("button", { name: "Delete Monthly" }));
  const dialog = screen.getByRole("dialog");
  expect(within(dialog).getByText(/Existing subscriptions and billing history are preserved/)).toBeInTheDocument();
  expect(api.deleteAdminPlan).not.toHaveBeenCalled();
  fireEvent.click(within(dialog).getByRole("button", { name: "Delete plan" }));
  await waitFor(() => expect(api.deleteAdminPlan).toHaveBeenCalledWith("monthly"));
});

test("an expired tenant can receive an extension with an audit reason", async () => {
  api.getAdminTenants.mockResolvedValue({ data: { tenants: [{ tenantId: "tenant-1", name: "Example Store", status: "active", subscription: { status: "expired" }, access: { hasFullAccess: false } }], hasMore: false } });
  api.extendTenantAccess.mockResolvedValue({ data: {} });
  render(<BillingAdminPage />);
  fireEvent.click(await screen.findByRole("button", { name: "Extend access" }));
  fireEvent.change(screen.getByLabelText("Additional days", { exact: false }), { target: { value: "14" } });
  fireEvent.change(screen.getByLabelText("Reason for extension", { exact: false }), { target: { value: "Customer support adjustment" } });
  fireEvent.click(screen.getByRole("button", { name: "Confirm extension" }));
  await waitFor(() => expect(api.extendTenantAccess).toHaveBeenCalledWith("tenant-1", { days: 14, reason: "Customer support adjustment" }));
  expect(await screen.findByText("Tenant access extended.")).toBeInTheDocument();
});
