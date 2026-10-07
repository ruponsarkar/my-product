import { Request, Response } from "express";
import SubscriptionPlan from "../models/subscription-plan.model";
import Tenant from "../models/tenant.model";
import { buildTenantAccessPayload, ensureDefaultSubscriptionPlans } from "../services/subscription.service";
import { canManageBilling } from "../middlewares/billing-admin.middleware";

type AuthRequest = Request & { user?: any };
const intervals: Record<string, number> = { weekly: 1, monthly: 1, quarterly: 3, yearly: 12 };
export const parsePlanInput = (body: any, creating: boolean) => {
  if (!body || typeof body !== "object") throw new Error("Plan details required");
  const { code, name, interval, amount, currency, description, isActive } = body;
  if (creating && (typeof code !== "string" || !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(code) || code === "trial")) throw new Error("Enter a unique lowercase plan code (up to 64 characters)");
  if (typeof name !== "string" || !name.trim() || name.length > 120) throw new Error("Plan name must contain 1–120 characters");
  if (typeof interval !== "string" || !Object.hasOwn(intervals, interval)) throw new Error("Invalid billing interval");
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0 || amount > 10000000 || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.00001) throw new Error("Amount must be positive with at most two decimal places");
  if (currency !== "INR") throw new Error("Use INR for Razorpay subscription plans");
  if (description !== undefined && (typeof description !== "string" || description.length > 1000)) throw new Error("Description must be at most 1000 characters");
  if (typeof isActive !== "boolean") throw new Error("Plan availability is required");
  return { ...(creating ? { code } : {}), name: name.trim(), interval, amount, currency, description: description || "", isActive, durationInMonths: intervals[interval], durationInDays: interval === "weekly" ? 7 : undefined };
};
const fail = (res: Response, error: any) => {
  if (error?.code === 11000) return res.status(409).json({ message: "This plan code already exists, including deleted plans. Choose a new code." });
  return res.status(500).json({ message: "Unable to update billing data" });
};
export const billingCapabilities = async (req: AuthRequest, res: Response) => {
  try { return res.json({ canManageBilling: await canManageBilling(req.user) }); }
  catch { return res.status(500).json({ message: "Unable to verify billing access" }); }
};
export const adminListPlans = async (_req: Request, res: Response) => {
  try {
    await ensureDefaultSubscriptionPlans();
    return res.json(await SubscriptionPlan.find({ deletedAt: null }).sort({ amount: 1 }).lean());
  } catch (error) { return fail(res, error); }
};
export const adminSavePlan = async (req: Request, res: Response) => {
  const creating = req.method === "POST";
  let input;
  try { input = parsePlanInput(req.body, creating); }
  catch (error: any) { return res.status(400).json({ message: error.message }); }
  try {
    if (creating) return res.status(201).json(await SubscriptionPlan.create(input));
    const plan = await SubscriptionPlan.findOne({ code: String(req.params.code), deletedAt: null });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (plan.razorpayPlanId && ["name", "amount", "currency", "interval", "description"].some(key => (plan as any)[key] !== (input as any)[key])) {
      plan.retiredGatewayPlans = [...(plan.retiredGatewayPlans || []), { razorpayPlanId: plan.razorpayPlanId, name: plan.name, amount: plan.amount, currency: plan.currency, interval: plan.interval }];
      plan.previousRazorpayPlanIds = [...(plan.previousRazorpayPlanIds || []), plan.razorpayPlanId];
      plan.razorpayPlanId = "";
    }
    Object.assign(plan, input);
    await plan.save();
    return res.json(plan);
  } catch (error) { return fail(res, error); }
};
export const adminDeletePlan = async (req: Request, res: Response) => {
  try {
    const plan = await SubscriptionPlan.findOneAndUpdate({ code: String(req.params.code), deletedAt: null }, { $set: { deletedAt: new Date(), isActive: false } }, { new: true });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    return res.json({ message: "Plan deleted. Existing subscriptions and billing history are preserved." });
  } catch (error) { return fail(res, error); }
};
export const adminListTenants = async (req: Request, res: Response) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 120) : "";
    const page = Math.max(1, Math.min(100000, Number(req.query.page) || 1));
    if (!Number.isInteger(page)) return res.status(400).json({ message: "Invalid page" });
    const search = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = q ? { $or: ["name", "email", "tenantId", "slug"].map(key => ({ [key]: { $regex: search, $options: "i" } })) } : {};
    const tenants = await Tenant.find(filter).select("tenantId name slug email status subscription accessExtendedUntil createdAt").sort({ tenantId: 1 }).skip((page - 1) * 20).limit(21);
    return res.json({ tenants: tenants.slice(0, 20).map(tenant => ({ ...buildTenantAccessPayload(tenant).tenant, email: tenant.email, access: buildTenantAccessPayload(tenant).access })), page, hasMore: tenants.length > 20 });
  } catch (error) { return fail(res, error); }
};
export const adminExtendTenant = async (req: AuthRequest, res: Response) => {
  const { days, reason } = req.body || {};
  if (!Number.isInteger(days) || days < 1 || days > 3650 || typeof reason !== "string" || !reason.trim() || reason.length > 500) return res.status(400).json({ message: "Enter 1–3650 whole days and a reason of up to 500 characters" });
  try {
    // A single atomic pipeline stacks concurrent grants and records their resulting expiry.
    const tenant = await Tenant.findOneAndUpdate({ tenantId: String(req.params.tenantId), status: "active" }, [
      { $set: { accessExtendedUntil: { $add: [{ $max: ["$$NOW", { $ifNull: ["$accessExtendedUntil", "$$NOW"] }, { $cond: [{ $eq: ["$subscription.status", "active"] }, { $ifNull: ["$subscription.currentPeriodEnd", "$$NOW"] }, "$$NOW"] }, { $cond: [{ $eq: ["$subscription.status", "trialing"] }, { $ifNull: ["$subscription.trialEndsAt", "$$NOW"] }, "$$NOW"] }] }, days * 86400000] } } },
      { $set: { accessExtensions: { $concatArrays: [{ $ifNull: ["$accessExtensions", []] }, [{ days, reason: { $literal: reason.trim() }, actor: { $literal: `${req.user.tenantId}:${req.user.id}` }, createdAt: "$$NOW", until: "$accessExtendedUntil" }]] } } },
    ], { new: true });
    if (!tenant) return res.status(404).json({ message: "Active tenant not found" });
    return res.json(buildTenantAccessPayload(tenant));
  } catch (error) { return fail(res, error); }
};
