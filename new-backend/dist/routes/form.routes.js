"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const form_controller_1 = require("../controllers/form.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const subscription_middleware_1 = require("../middlewares/subscription.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)('products.manage'), form_controller_1.getAllForms);
router.post('/', auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)('products.manage'), form_controller_1.createForm);
exports.default = router;
//# sourceMappingURL=form.routes.js.map