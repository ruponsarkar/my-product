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

const router = Router();

router.get("/summary", totalSalesSummary);
router.get("/sales-by-date", salesByDate); //sales-by-date?type=daily    sales-by-date?type=monthly
router.get("/payment-breakdown", paymentBreakdown);
router.get("/top-products", topSellingProducts);  //top-products?limit=10
router.get("/net-profit", netProfit);
router.get("/sales-by-hour", hourlySales);
router.get("/orders-by-user", ordersByUser);
router.post("/custom", customReport);

// router.post('/', createAnalytic);

export default router;
