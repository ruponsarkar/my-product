"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const settings_controller_1 = require("../controllers/settings.controller");
const subscription_middleware_1 = require("../middlewares/subscription.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, (0, subscription_middleware_1.requireSubscriptionFeature)('settings.manage'), settings_controller_1.getTenantSettings);
router.put('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)('admin'), (0, subscription_middleware_1.requireSubscriptionFeature)('settings.manage'), settings_controller_1.updateTenantSettings);
exports.default = router;
//# sourceMappingURL=settings.routes.js.map