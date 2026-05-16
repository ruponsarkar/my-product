import { NextFunction, Request, Response } from "express";
import { resolveTenant } from "../config/tenant";
import {
  buildTenantAccessPayload,
  hasTenantFeature,
  SubscriptionFeature,
} from "../services/subscription.service";

type SubscriptionRequest = Request & {
  user?: any;
  tenant?: any;
  access?: any;
};

export const requireSubscriptionFeature = (feature: SubscriptionFeature) => {
  return async (req: SubscriptionRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.tenantId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const tenant = await resolveTenant({ tenantId: req.user.tenantId });
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }

      req.tenant = tenant;
      const accessPayload = buildTenantAccessPayload(tenant);
      req.access = accessPayload.access;

      if (hasTenantFeature(tenant, feature)) {
        return next();
      }

      return res.status(403).json({
        message: "Your current subscription only allows dashboard, products, profile, and billing access.",
        requiredFeature: feature,
        ...accessPayload,
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to validate subscription access" });
    }
  };
};
