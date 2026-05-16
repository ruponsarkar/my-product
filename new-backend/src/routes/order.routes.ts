import { Router } from "express";
import { createOrder, getMyOrders, getOrderById, getOrders } from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireSubscriptionFeature } from "../middlewares/subscription.middleware";

const router = Router();

router.post("/", authMiddleware, requireSubscriptionFeature("orders.manage"), createOrder);
router.get("/", authMiddleware, requireSubscriptionFeature("orders.manage"), getOrders);
router.get("/my", authMiddleware, requireSubscriptionFeature("orders.manage"), getMyOrders);
router.get("/:id", authMiddleware, requireSubscriptionFeature("orders.manage"), getOrderById);

export default router;
