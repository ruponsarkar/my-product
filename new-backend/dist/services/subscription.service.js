"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantByTenantId = exports.activateTenantPlan = exports.getSubscriptionPlanByCode = exports.getSubscriptionPlans = exports.ensureDefaultSubscriptionPlans = exports.buildTenantAccessPayload = exports.hasTenantFeature = exports.getTenantAccessState = exports.ensureTenantSubscriptionDefaults = exports.buildInitialTenantSubscription = exports.addMonths = exports.LIMITED_ACCESS_FEATURES = exports.FULL_ACCESS_FEATURES = void 0;
const tenant_model_1 = __importDefault(require("../models/tenant.model"));
const subscription_plan_model_1 = __importDefault(require("../models/subscription-plan.model"));
const DEFAULT_TRIAL_DAYS = Math.max(0, Number(process.env.SUBSCRIPTION_TRIAL_DAYS || 15));
const DEFAULT_SUBSCRIPTION_PLANS = [
    {
        code: "monthly",
        name: "Monthly",
        interval: "monthly",
        amount: 249,
        currency: "INR",
        durationInMonths: 1,
        description: "Ideal for getting started with full access month to month.",
    },
    {
        code: "quarterly",
        name: "Quarterly",
        interval: "quarterly",
        amount: 699,
        currency: "INR",
        durationInMonths: 3,
        description: "A better-value plan for teams that want a stable quarter.",
    },
    {
        code: "yearly",
        name: "Yearly",
        interval: "yearly",
        amount: 2499,
        currency: "INR",
        durationInMonths: 12,
        description: "Best value for businesses running the app all year.",
    },
];
exports.FULL_ACCESS_FEATURES = [
    "*",
];
exports.LIMITED_ACCESS_FEATURES = [
    "dashboard.view",
    "products.view",
    "billing.manage",
    "profile.view",
];
const addDays = (date, days) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};
const addMonths = (date, months) => {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
};
exports.addMonths = addMonths;
const buildInitialTenantSubscription = (startDate = new Date()) => {
    const trialStartsAt = new Date(startDate);
    const trialEndsAt = DEFAULT_TRIAL_DAYS > 0 ? addDays(trialStartsAt, DEFAULT_TRIAL_DAYS) : trialStartsAt;
    return {
        status: DEFAULT_TRIAL_DAYS > 0 ? "trialing" : "expired",
        planCode: "trial",
        planLabel: "Free Trial",
        billingCycle: "trial",
        amount: 0,
        currency: "INR",
        trialStartedAt: trialStartsAt,
        trialEndsAt,
        currentPeriodStart: trialStartsAt,
        currentPeriodEnd: trialEndsAt,
        nextBillingAt: trialEndsAt,
        lastPaymentAt: null,
        isTrialUsed: DEFAULT_TRIAL_DAYS > 0,
        autoPayEnabled: false,
        gatewayStatus: "",
        razorpayPlanId: "",
        razorpaySubscriptionId: "",
        razorpayCustomerId: "",
        lastSubscriptionEventAt: null,
    };
};
exports.buildInitialTenantSubscription = buildInitialTenantSubscription;
const ensureTenantSubscriptionDefaults = (tenant) => {
    const hasInitializedSubscription = Boolean(tenant.subscription?.status ||
        tenant.subscription?.planCode ||
        tenant.subscription?.trialStartedAt ||
        tenant.subscription?.trialEndsAt ||
        tenant.subscription?.currentPeriodStart ||
        tenant.subscription?.currentPeriodEnd);
    if (!tenant.subscription || !hasInitializedSubscription) {
        tenant.subscription = (0, exports.buildInitialTenantSubscription)(tenant.createdAt || new Date());
    }
    const subscription = tenant.subscription;
    subscription.status = subscription.status || "expired";
    subscription.planCode = subscription.planCode || "trial";
    subscription.planLabel = subscription.planLabel || "Free Trial";
    subscription.billingCycle = subscription.billingCycle || "trial";
    subscription.currency = subscription.currency || "INR";
    subscription.amount = Number(subscription.amount || 0);
    subscription.isTrialUsed = Boolean(subscription.isTrialUsed);
    subscription.autoPayEnabled = Boolean(subscription.autoPayEnabled);
    subscription.gatewayStatus = subscription.gatewayStatus || "";
    subscription.razorpayPlanId = subscription.razorpayPlanId || "";
    subscription.razorpaySubscriptionId = subscription.razorpaySubscriptionId || "";
    subscription.razorpayCustomerId = subscription.razorpayCustomerId || "";
    subscription.lastSubscriptionEventAt = subscription.lastSubscriptionEventAt || null;
    return subscription;
};
exports.ensureTenantSubscriptionDefaults = ensureTenantSubscriptionDefaults;
const getTenantAccessState = (tenant) => {
    const subscription = (0, exports.ensureTenantSubscriptionDefaults)(tenant);
    const now = new Date();
    const trialEndsAt = subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
    const currentPeriodEnd = subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd)
        : null;
    const isTrialActive = subscription.status === "trialing" &&
        Boolean(trialEndsAt && trialEndsAt.getTime() >= now.getTime());
    const isPaidActive = subscription.status === "active" &&
        (!currentPeriodEnd || currentPeriodEnd.getTime() >= now.getTime());
    const hasFullAccess = isTrialActive || isPaidActive;
    const featureAccess = hasFullAccess ? [...exports.FULL_ACCESS_FEATURES] : [...exports.LIMITED_ACCESS_FEATURES];
    return {
        hasFullAccess,
        hasLimitedAccess: !hasFullAccess,
        features: featureAccess,
        subscription: {
            status: hasFullAccess
                ? subscription.status
                : subscription.status === "active" || subscription.status === "trialing"
                    ? "expired"
                    : subscription.status,
            planCode: subscription.planCode || "trial",
            planLabel: subscription.planLabel || "Free Trial",
            billingCycle: subscription.billingCycle || "trial",
            amount: Number(subscription.amount || 0),
            currency: subscription.currency || "INR",
            trialStartedAt: subscription.trialStartedAt || null,
            trialEndsAt: subscription.trialEndsAt || null,
            currentPeriodStart: subscription.currentPeriodStart || null,
            currentPeriodEnd: subscription.currentPeriodEnd || null,
            nextBillingAt: subscription.nextBillingAt || null,
            lastPaymentAt: subscription.lastPaymentAt || null,
            isTrialUsed: Boolean(subscription.isTrialUsed),
            autoPayEnabled: Boolean(subscription.autoPayEnabled),
            gatewayStatus: subscription.gatewayStatus || "",
            razorpayPlanId: subscription.razorpayPlanId || "",
            razorpaySubscriptionId: subscription.razorpaySubscriptionId || "",
            razorpayCustomerId: subscription.razorpayCustomerId || "",
            lastSubscriptionEventAt: subscription.lastSubscriptionEventAt || null,
            trialDays: DEFAULT_TRIAL_DAYS,
        },
    };
};
exports.getTenantAccessState = getTenantAccessState;
const hasTenantFeature = (tenant, feature) => {
    const access = (0, exports.getTenantAccessState)(tenant);
    const features = access.features;
    return features.includes("*") || features.includes(feature);
};
exports.hasTenantFeature = hasTenantFeature;
const buildTenantAccessPayload = (tenant) => {
    const access = (0, exports.getTenantAccessState)(tenant);
    return {
        tenant: {
            id: tenant._id,
            tenantId: tenant.tenantId,
            name: tenant.name,
            slug: tenant.slug,
            status: tenant.status,
            subscription: access.subscription,
        },
        access: {
            hasFullAccess: access.hasFullAccess,
            hasLimitedAccess: access.hasLimitedAccess,
            features: access.features,
        },
    };
};
exports.buildTenantAccessPayload = buildTenantAccessPayload;
const ensureDefaultSubscriptionPlans = async () => {
    await Promise.all(DEFAULT_SUBSCRIPTION_PLANS.map((plan) => subscription_plan_model_1.default.updateOne({ code: plan.code }, { $set: plan }, { upsert: true })));
};
exports.ensureDefaultSubscriptionPlans = ensureDefaultSubscriptionPlans;
const getSubscriptionPlans = async () => {
    await (0, exports.ensureDefaultSubscriptionPlans)();
    return subscription_plan_model_1.default.find({ isActive: true }).sort({ amount: 1 }).lean();
};
exports.getSubscriptionPlans = getSubscriptionPlans;
const getSubscriptionPlanByCode = async (code) => {
    await (0, exports.ensureDefaultSubscriptionPlans)();
    return subscription_plan_model_1.default.findOne({ code, isActive: true });
};
exports.getSubscriptionPlanByCode = getSubscriptionPlanByCode;
const activateTenantPlan = async (tenant, plan, paidAt = new Date()) => {
    const currentPeriodStart = paidAt;
    const currentPeriodEnd = (0, exports.addMonths)(currentPeriodStart, plan.durationInMonths);
    tenant.subscription = {
        status: "active",
        planCode: plan.code,
        planLabel: plan.name,
        billingCycle: plan.interval,
        amount: plan.amount,
        currency: plan.currency || "INR",
        trialStartedAt: tenant.subscription?.trialStartedAt || null,
        trialEndsAt: tenant.subscription?.trialEndsAt || null,
        currentPeriodStart,
        currentPeriodEnd,
        nextBillingAt: currentPeriodEnd,
        lastPaymentAt: paidAt,
        isTrialUsed: Boolean(tenant.subscription?.isTrialUsed),
        autoPayEnabled: Boolean(tenant.subscription?.autoPayEnabled),
        gatewayStatus: tenant.subscription?.gatewayStatus || "",
        razorpayPlanId: tenant.subscription?.razorpayPlanId || "",
        razorpaySubscriptionId: tenant.subscription?.razorpaySubscriptionId || "",
        razorpayCustomerId: tenant.subscription?.razorpayCustomerId || "",
        lastSubscriptionEventAt: tenant.subscription?.lastSubscriptionEventAt || null,
    };
    await tenant.save();
    return tenant;
};
exports.activateTenantPlan = activateTenantPlan;
const getTenantByTenantId = async (tenantId) => {
    if (!tenantId)
        return null;
    return tenant_model_1.default.findOne({ tenantId });
};
exports.getTenantByTenantId = getTenantByTenantId;
//# sourceMappingURL=subscription.service.js.map