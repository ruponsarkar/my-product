"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    // Who placed the order
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // Unique readable order id (ORD123)
    order_id: {
        type: String,
        required: true,
        unique: true,
    },
    // Optional customer contact
    customer_phone: {
        type: String,
        default: null,
    },
    // Payment method
    payment_type: {
        type: String,
        enum: ["cash", "online", "credit"],
        required: true,
    },
    // Ordered items
    items: [
        {
            product: {
                type: mongoose_1.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    // Billing
    subtotal: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    tax: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        required: true,
    },
    // 💰 Payment tracking
    paidAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    credit: {
        type: Number,
        default: 0,
        min: 0,
    },
    // Order lifecycle
    status: {
        type: String,
        enum: ["ordered", "paid", "cancelled", "completed", "credit", "cash"],
        default: "ordered",
    },
}, {
    timestamps: true,
});
// 🔒 Ensure credit logic is consistent
// orderSchema.pre("save", function (next) {
//   // credit = total - paidAmount
//   this.credit = Math.max(this.total - this.paidAmount, 0);
//   // auto status update
//   if (this.credit > 0) {
//     this.status = "credit";
//   } else if (this.paidAmount >= this.total) {
//     this.status = "paid";
//   }
//   next();
// });
exports.default = (0, mongoose_1.model)("Order", orderSchema);
//# sourceMappingURL=order.model.js.map