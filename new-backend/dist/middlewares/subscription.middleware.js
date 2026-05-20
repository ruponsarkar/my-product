"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSubscriptionFeature = void 0;
const tenant_1 = require("../config/tenant");
const subscription_service_1 = require("../services/subscription.service");
const requireSubscriptionFeature = (feature) => {
    return async (req, res, next) => {
        try {
            if (!req.user?.tenantId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const tenant = await (0, tenant_1.resolveTenant)({ tenantId: req.user.tenantId });
            if (!tenant) {
                return res.status(404).json({ message: "Tenant not found" });
            }
            req.tenant = tenant;
            const accessPayload = (0, subscription_service_1.buildTenantAccessPayload)(tenant);
            req.access = accessPayload.access;
            if ((0, subscription_service_1.hasTenantFeature)(tenant, feature)) {
                return next();
            }
            return res.status(403).json({
                message: "Your current subscription only allows dashboard, products, profile, and billing access.",
                requiredFeature: feature,
                ...accessPayload,
            });
        }
        catch (error) {
            return res.status(500).json({ message: "Failed to validate subscription access" });
        }
    };
};
exports.requireSubscriptionFeature = requireSubscriptionFeature;
//# sourceMappingURL=subscription.middleware.js.map