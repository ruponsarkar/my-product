"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrders = exports.createOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const createOrder = async (req, res) => {
    try {
        const { items, total } = req.body;
        const order = new order_model_1.default({
            user: req.user.id,
            items,
            total,
        });
        await order.save();
        res.status(201).json(order);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res) => {
    try {
        const orders = await order_model_1.default.find({ user: req.user.id }).populate("items.product");
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ errorr: err });
    }
};
exports.getMyOrders = getMyOrders;
//# sourceMappingURL=order.controller.js.map