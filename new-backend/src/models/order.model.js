"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            product: { type: mongoose_1.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, default: 1 },
        },
    ],
    total: { type: Number, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Order", orderSchema);
//# sourceMappingURL=order.model.js.map