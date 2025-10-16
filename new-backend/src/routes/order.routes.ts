import { Router } from "express";
import { createOrder, getMyOrders } from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createOrder);
router.get("/my", authMiddleware, getMyOrders);

export default router;
