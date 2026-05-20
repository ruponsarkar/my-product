"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const subscription_middleware_1 = require("../middlewares/subscription.middleware");
const router = (0, express_1.Router)();
router.get("/me", auth_middleware_1.authMiddleware, user_controller_1.getProfile);
router.get("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)("admin"), (0, subscription_middleware_1.requireSubscriptionFeature)("users.manage"), user_controller_1.listUsers);
router.post("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)("admin"), (0, subscription_middleware_1.requireSubscriptionFeature)("users.manage"), user_controller_1.createUser);
router.put("/:id", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)("admin"), (0, subscription_middleware_1.requireSubscriptionFeature)("users.manage"), user_controller_1.updateUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map