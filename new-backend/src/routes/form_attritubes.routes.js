"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const form_attritubes_controller_1 = require("../controllers/form_attritubes.controller");
const router = (0, express_1.Router)();
router.get('/', form_attritubes_controller_1.getAllForm_attritubess);
router.post('/', form_attritubes_controller_1.createForm_attritubes);
exports.default = router;
//# sourceMappingURL=form_attritubes.routes.js.map