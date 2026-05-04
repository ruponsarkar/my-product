"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytic_controller_1 = require("../controllers/analytic.controller");
const router = (0, express_1.Router)();
router.get("/summary", analytic_controller_1.totalSalesSummary);
router.get("/sales-by-date", analytic_controller_1.salesByDate); //sales-by-date?type=daily    sales-by-date?type=monthly
router.get("/payment-breakdown", analytic_controller_1.paymentBreakdown);
router.get("/top-products", analytic_controller_1.topSellingProducts); //top-products?limit=10
router.get("/net-profit", analytic_controller_1.netProfit);
router.get("/sales-by-hour", analytic_controller_1.hourlySales);
router.get("/orders-by-user", analytic_controller_1.ordersByUser);
router.post("/custom", analytic_controller_1.customReport);
// router.post('/', createAnalytic);
exports.default = router;
//# sourceMappingURL=analytic.routes.js.map