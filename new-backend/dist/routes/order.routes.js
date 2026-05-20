"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const subscription_middleware_1 = require("../middlewares/subscription.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)("orders.manage"), order_controller_1.createOrder);
router.get("/", auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)("orders.manage"), order_controller_1.getOrders);
router.get("/my", auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)("orders.manage"), order_controller_1.getMyOrders);
router.get("/:id", auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)("orders.manage"), order_controller_1.getOrderById);
exports.default = router;
//# sourceMappingURL=order.routes.js.map