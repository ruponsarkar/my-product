"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/me", auth_middleware_1.authMiddleware, user_controller_1.getProfile);
router.get("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)("admin"), user_controller_1.listUsers);
router.post("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)("admin"), user_controller_1.createUser);
router.put("/:id", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)("admin"), user_controller_1.updateUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map