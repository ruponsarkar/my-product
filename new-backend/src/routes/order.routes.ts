import { Router } from "express";
import { createOrder, getMyOrders, getOrders } from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);
router.get("/my", authMiddleware, getMyOrders);

export default router;
