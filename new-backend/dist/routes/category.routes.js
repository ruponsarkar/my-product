"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const subscription_middleware_1 = require("../middlewares/subscription.middleware");
const router = (0, express_1.Router)();
// router.get('/', getAllCategorys);
// router.post('/', createCategory);
router.get("/", auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)('products.view'), category_controller_1.allCategory);
router.get("/brand/:category", auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)('products.view'), category_controller_1.allBrands);
exports.default = router;
//# sourceMappingURL=category.routes.js.map