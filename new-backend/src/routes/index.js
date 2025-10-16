"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form_attritubes_routes_1 = __importDefault(require("./form_attritubes.routes"));
const form_routes_1 = __importDefault(require("./form.routes"));
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/users", user_routes_1.default);
router.use("/products", product_routes_1.default);
router.use("/orders", order_routes_1.default);
router.use('/forms', form_routes_1.default);
router.use('/form_attritubess', form_attritubes_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map