"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SubscriptionInvoiceSchema = new mongoose_1.Schema({
    tenant: { type: mongoose_1.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    tenantId: { type: String, required: true, index: true },
    transaction: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "SubscriptionTransaction",
        required: true,
        index: true,
    },
    invoiceNumber: { type: String, required: true, unique: true, index: true },
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
        enum: ["issued", "paid", "void"],
        default: "paid",
    },
    issuedAt: { type: Date, default: Date.now },
    periodStart: { type: Date, default: null },
    periodEnd: { type: Date, default: null },
    paymentId: { type: String, default: "" },
    orderId: { type: String, default: "" },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("SubscriptionInvoice", SubscriptionInvoiceSchema, "subscription_invoices");
//# sourceMappingURL=subscription-invoice.model.js.map