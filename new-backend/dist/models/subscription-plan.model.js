"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SubscriptionPlanSchema = new mongoose_1.Schema({
    code: {
        type: String,
        enum: ["monthly", "quarterly", "yearly"],
        required: true,
        unique: true,
        index: true,
    },
    name: { type: String, required: true },
    interval: {
        type: String,
        enum: ["monthly", "quarterly", "yearly"],
        required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    durationInMonths: { type: Number, required: true, min: 1 },
    description: { type: String, default: "" },
    razorpayPlanId: { type: String, default: "", index: true, sparse: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("SubscriptionPlan", SubscriptionPlanSchema, "subscription_plans");
//# sourceMappingURL=subscription-plan.model.js.map