"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrders = exports.createOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
// helper to generate ORDER ID like ORD0001
const generateOrderId = async () => {
    const count = await order_model_1.default.countDocuments();
    return `ORD${String(count + 1).padStart(4, "0")}`;
};
const createOrder = async (req, res) => {
    try {
        const { items, subtotal, discount, tax, total, paidAmount, credit, payment_type, customer_phone, } = req.body;
        // basic validation
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order items are required" });
        }
        if (!payment_type) {
            return res.status(400).json({ message: "Payment type is required" });
        }
        const order_id = await generateOrderId();
        console.log("user ", req.user);
        const order = new order_model_1.default({
            user: req.user.id,
            order_id,
            customer_phone: customer_phone || null,
            payment_type,
            items: items.map((item) => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price, // snapshot price
            })),
            subtotal,
            discount: discount || 0,
            tax: tax || 0,
            total,
            paidAmount: paidAmount || 0,
            credit: credit || 0,
            status: payment_type,
        });
        await order.save();
        // decrement stock
        await removeStock(items);
        res.status(201).json({
            message: "Order placed successfully",
            order,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create order" });
    }
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res) => {
    try {
        const orders = await order_model_1.default.find({ user: req.user.id })
            .populate("items.product")
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};
exports.getMyOrders = getMyOrders;
const removeStock = async (items) => {
    if (!items.length)
        return;
    const bulkOps = items.map((item) => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { stockQty: -item.quantity } }, // 🔥 atomic decrement
        },
    }));
    const bulkOps2 = items.map((item) => console.log("item", item));
    console.log("bulkOps", bulkOps);
    await product_model_1.default.bulkWrite(bulkOps);
};
//# sourceMappingURL=order.controller.js.map