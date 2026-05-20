"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SubscriptionTransactionSchema = new mongoose_1.Schema({
    tenant: { type: mongoose_1.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    tenantId: { type: String, required: true, index: true },
    planCode: {
        type: String,
        enum: ["monthly", "quarterly", "yearly"],
        required: true,
    },
    planName: { type: String, required: true },
    billingCycle: {
        type: String,
        enum: ["monthly", "quarterly", "yearly"],
        required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    status: {
        type: String,
        enum: ["created", "paid", "failed", "expired", "refunded"],
        default: "created",
        index: true,
    },
    gateway: {
        type: String,
        enum: ["razorpay"],
        default: "razorpay",
    },
    gatewayOrderId: { type: String, index: true, sparse: true },
    gatewayPaymentId: { type: String, index: true, sparse: true },
    gatewaySignature: { type: String, default: "" },
    gatewaySubscriptionId: { type: String, index: true, sparse: true },
    invoiceNumber: { type: String, index: true, sparse: true },
    paidAt: { type: Date, default: null },
    billingCycleStart: { type: Date, default: null },
    billingCycleEnd: { type: Date, default: null },
    eventType: { type: String, default: "" },
    metadata: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    createdBy: {
        userId: { type: String, default: "" },
        name: { type: String, default: "" },
        email: { type: String, default: "" },
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("SubscriptionTransaction", SubscriptionTransactionSchema, "subscription_transactions");
//# sourceMappingURL=subscription-transaction.model.js.map