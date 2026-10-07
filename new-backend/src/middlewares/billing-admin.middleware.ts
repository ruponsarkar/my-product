import { Request, Response, NextFunction } from "express";
import Tenant from "../models/tenant.model";
import { getTenantConnection } from "../config/tenant";
import { getUserModel } from "../models/user.model";

// Tenant-controlled roles/permissions must never grant platform-wide access.
export const isBillingAdminIdentity = (user: any) => {
  if (!user?.id || !user?.tenantId || user?.type) return false;
  const allowed = (process.env.BILLING_ADMIN_USERS || "").split(",").map(value => value.trim()).filter(Boolean);
  return allowed.includes(`${user.tenantId}:${user.id}`);
};

export const canManageBilling = async (user: any): Promise<boolean> => {
  if (!isBillingAdminIdentity(user)) return false;
  const tenant = await Tenant.findOne({ tenantId: user.tenantId, status: "active" });
  if (!tenant) return false;
  const account = await getUserModel(getTenantConnection(tenant)).findOne({ _id: user.id, isActive: true });
  return Boolean(account);
};

export const requireBillingAdmin = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    if (!await canManageBilling(req.user)) return res.status(403).json({ message: "Billing administrator access required" });
    next();
  } catch {
    return res.status(500).json({ message: "Unable to verify billing administrator access" });
  }
};
