import { Router } from "express";
import {
  totalSalesSummary,
  salesByDate,
  paymentBreakdown,
  topSellingProducts,
  netProfit,
  hourlySales,
  ordersByUser,
  customReport
} from "../controllers/analytic.controller";
import {authMiddleware} from "../middlewares/auth.middleware";

const router = Router();

router.get("/summary", authMiddleware, totalSalesSummary);
router.get("/sales-by-date", authMiddleware, salesByDate); //sales-by-date?type=daily    sales-by-date?type=monthly
router.get("/payment-breakdown", authMiddleware, paymentBreakdown);
router.get("/top-products", authMiddleware, topSellingProducts);  //top-products?limit=10
router.get("/net-profit", authMiddleware, netProfit);
router.get("/sales-by-hour", authMiddleware, hourlySales);
router.get("/orders-by-user", authMiddleware, ordersByUser);
router.post("/custom", authMiddleware, customReport);

// router.post('/', createAnalytic);

export default router;
