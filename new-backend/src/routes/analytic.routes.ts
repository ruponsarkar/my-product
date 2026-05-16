import { Router } from "express";
import {
  dashboardOverview,
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
import { requireSubscriptionFeature } from "../middlewares/subscription.middleware";

const router = Router();

router.get("/dashboard", authMiddleware, requireSubscriptionFeature("dashboard.view"), dashboardOverview);
router.get("/summary", authMiddleware, requireSubscriptionFeature("analytics.view"), totalSalesSummary);
router.get("/sales-by-date", authMiddleware, requireSubscriptionFeature("analytics.view"), salesByDate); //sales-by-date?type=daily    sales-by-date?type=monthly
router.get("/payment-breakdown", authMiddleware, requireSubscriptionFeature("analytics.view"), paymentBreakdown);
router.get("/top-products", authMiddleware, requireSubscriptionFeature("analytics.view"), topSellingProducts);  //top-products?limit=10
router.get("/net-profit", authMiddleware, requireSubscriptionFeature("analytics.view"), netProfit);
router.get("/sales-by-hour", authMiddleware, requireSubscriptionFeature("analytics.view"), hourlySales);
router.get("/orders-by-user", authMiddleware, requireSubscriptionFeature("analytics.view"), ordersByUser);
router.post("/custom", authMiddleware, requireSubscriptionFeature("analytics.view"), customReport);

// router.post('/', createAnalytic);

export default router;
