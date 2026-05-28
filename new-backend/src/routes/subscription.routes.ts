import { Router } from "express";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";
import {
  cancelSubscriptionAutopay,
  createSubscriptionCheckoutOrder,
  getInvoiceDetails,
  getSubscriptionOverview,
  handleSubscriptionWebhook,
  listSubscriptionPlans,
  listSubscriptionTransactions,
  verifySubscriptionPayment,
} from "../controllers/subscription.controller";
import { requireSubscriptionFeature } from "../middlewares/subscription.middleware";

const router = Router();

router.post("/webhook", handleSubscriptionWebhook);
router.get("/overview", authMiddleware, requireSubscriptionFeature("billing.manage"), getSubscriptionOverview);
router.get("/plans", authMiddleware, requireSubscriptionFeature("billing.manage"), listSubscriptionPlans);
router.get("/transactions", authMiddleware, requireSubscriptionFeature("billing.manage"), listSubscriptionTransactions);
router.get("/invoices/:invoiceNumber", authMiddleware, requireSubscriptionFeature("billing.manage"), getInvoiceDetails);
router.post(
  "/checkout-order",
  authMiddleware,
  authorizeRoles("admin"),
  requireSubscriptionFeature("billing.manage"),
  createSubscriptionCheckoutOrder
);
router.post(
  "/verify-payment",
  authMiddleware,
  authorizeRoles("admin"),
  requireSubscriptionFeature("billing.manage"),
  verifySubscriptionPayment
);
router.post(
  "/cancel-autopay",
  authMiddleware,
  authorizeRoles("admin"),
  requireSubscriptionFeature("billing.manage"),
  cancelSubscriptionAutopay
);

export default router;
