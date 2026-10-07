import { render, screen } from "@testing-library/react";
import BillingPage from "./index";
import { getSubscriptionOverview } from "../../api/services/subscription/subscriptionApi";

jest.mock("react-router-dom", () => ({ useNavigate: () => jest.fn() }), { virtual: true });
jest.mock("../../api/services/subscription/subscriptionApi", () => ({
  getSubscriptionOverview: jest.fn(), cancelSubscriptionAutopay: jest.fn(),
  createSubscriptionCheckoutOrder: jest.fn(), getInvoiceDetails: jest.fn(), verifySubscriptionPayment: jest.fn(),
}));

test("an access extension preserves expired billing status without a locked workspace warning", async () => {
  getSubscriptionOverview.mockResolvedValue({ data: {
    tenant: { subscription: { status: "expired", accessExtendedUntil: "2099-01-01T00:00:00Z", currentPeriodEnd: "2020-01-01T00:00:00Z" } },
    access: { hasFullAccess: true }, plans: [], recentTransactions: [],
  } });
  render(<BillingPage />);
  expect(await screen.findByText("Access extended")).toBeInTheDocument();
  expect(screen.getByText("expired")).toBeInTheDocument();
  expect(screen.getByText(/Billing status and payment dates remain unchanged/)).toBeInTheDocument();
  expect(screen.queryByText(/unlock editing, orders/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Your workspace is in limited-access mode/)).not.toBeInTheDocument();
});
