"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytic_controller_1 = require("../controllers/analytic.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/summary", auth_middleware_1.authMiddleware, analytic_controller_1.totalSalesSummary);
router.get("/sales-by-date", auth_middleware_1.authMiddleware, analytic_controller_1.salesByDate); //sales-by-date?type=daily    sales-by-date?type=monthly
router.get("/payment-breakdown", auth_middleware_1.authMiddleware, analytic_controller_1.paymentBreakdown);
router.get("/top-products", auth_middleware_1.authMiddleware, analytic_controller_1.topSellingProducts); //top-products?limit=10
router.get("/net-profit", auth_middleware_1.authMiddleware, analytic_controller_1.netProfit);
router.get("/sales-by-hour", auth_middleware_1.authMiddleware, analytic_controller_1.hourlySales);
router.get("/orders-by-user", auth_middleware_1.authMiddleware, analytic_controller_1.ordersByUser);
router.post("/custom", auth_middleware_1.authMiddleware, analytic_controller_1.customReport);
// router.post('/', createAnalytic);
exports.default = router;
//# sourceMappingURL=analytic.routes.js.map