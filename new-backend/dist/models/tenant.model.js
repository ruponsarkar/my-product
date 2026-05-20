"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantModel = void 0;
const mongoose_1 = require("mongoose");
const TenantSubscriptionSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: ['trialing', 'active', 'expired', 'cancelled', 'past_due'],
        default: 'trialing',
    },
    planCode: {
        type: String,
        enum: ['trial', 'monthly', 'quarterly', 'yearly'],
        default: 'trial',
    },
    planLabel: { type: String, default: 'Free Trial' },
    billingCycle: {
        type: String,
        enum: ['trial', 'monthly', 'quarterly', 'yearly'],
        default: 'trial',
    },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    trialStartedAt: { type: Date, default: null },
    trialEndsAt: { type: Date, default: null },
    currentPeriodStart: { type: Date, default: null },
    currentPeriodEnd: { type: Date, default: null },
    nextBillingAt: { type: Date, default: null },
    lastPaymentAt: { type: Date, default: null },
    isTrialUsed: { type: Boolean, default: false },
    autoPayEnabled: { type: Boolean, default: false },
    gatewayStatus: { type: String, default: "" },
    razorpayPlanId: { type: String, default: "" },
    razorpaySubscriptionId: { type: String, default: "", index: true, sparse: true },
    razorpayCustomerId: { type: String, default: "" },
    lastSubscriptionEventAt: { type: Date, default: null },
}, { _id: false });
const TenantSchema = new mongoose_1.Schema({
    tenantId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    dbName: { type: String, required: true, unique: true, index: true },
    settings: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    subscription: { type: TenantSubscriptionSchema, default: () => ({}) },
}, { timestamps: true });
const getTenantModel = (conn) => {
    if (conn.models.Tenant)
        return conn.models.Tenant;
    return conn.model('Tenant', TenantSchema, 'accounts');
};
exports.getTenantModel = getTenantModel;
exports.default = (0, mongoose_1.model)('Tenant', TenantSchema, 'accounts');
//# sourceMappingURL=tenant.model.js.map