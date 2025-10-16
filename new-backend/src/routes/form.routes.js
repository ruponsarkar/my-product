"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const form_controller_1 = require("../controllers/form.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', form_controller_1.getAllForms);
router.post('/', auth_middleware_1.authMiddleware, form_controller_1.createForm);
exports.default = router;
//# sourceMappingURL=form.routes.js.map