"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const settings_controller_1 = require("../controllers/settings.controller");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, settings_controller_1.getTenantSettings);
router.put('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)('admin'), settings_controller_1.updateTenantSettings);
exports.default = router;
//# sourceMappingURL=settings.routes.js.map