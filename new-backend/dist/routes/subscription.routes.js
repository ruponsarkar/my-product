"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const subscription_controller_1 = require("../controllers/subscription.controller");
const subscription_middleware_1 = require("../middlewares/subscription.middleware");
const router = (0, express_1.Router)();
router.post("/webhook", subscription_controller_1.handleSubscriptionWebhook);
router.get("/overview", auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)("billing.manage"), subscription_controller_1.getSubscriptionOverview);
router.get("/plans", auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)("billing.manage"), subscription_controller_1.listSubscriptionPlans);
router.get("/transactions", auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)("billing.manage"), subscription_controller_1.listSubscriptionTransactions);
router.get("/invoices/:invoiceNumber", auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)("billing.manage"), subscription_controller_1.getInvoiceDetails);
router.post("/checkout-order", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)("admin"), (0, subscription_middleware_1.requireSubscriptionFeature)("billing.manage"), subscription_controller_1.createSubscriptionCheckoutOrder);
router.post("/verify-payment", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)("admin"), (0, subscription_middleware_1.requireSubscriptionFeature)("billing.manage"), subscription_controller_1.verifySubscriptionPayment);
exports.default = router;
//# sourceMappingURL=subscription.routes.js.map