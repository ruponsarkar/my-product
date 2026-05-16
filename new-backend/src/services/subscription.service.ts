import Tenant, { ITenant } from "../models/tenant.model";
import SubscriptionPlan, { ISubscriptionPlan } from "../models/subscription-plan.model";

const DEFAULT_TRIAL_DAYS = Math.max(0, Number(process.env.SUBSCRIPTION_TRIAL_DAYS || 15));

const DEFAULT_SUBSCRIPTION_PLANS = [
  {
    code: "monthly" as const,
    name: "Monthly",
    interval: "monthly" as const,
    amount: 249,
    currency: "INR",
    durationInMonths: 1,
    description: "Ideal for getting started with full access month to month.",
  },
  {
    code: "quarterly" as const,
    name: "Quarterly",
    interval: "quarterly" as const,
    amount: 699,
    currency: "INR",
    durationInMonths: 3,
    description: "A better-value plan for teams that want a stable quarter.",
  },
  {
    code: "yearly" as const,
    name: "Yearly",
    interval: "yearly" as const,
    amount: 2499,
    currency: "INR",
    durationInMonths: 12,
    description: "Best value for businesses running the app all year.",
  },
];

export const FULL_ACCESS_FEATURES = [
  "*",
] as const;

export const LIMITED_ACCESS_FEATURES = [
  "dashboard.view",
  "products.view",
  "billing.manage",
  "profile.view",
] as const;

export type SubscriptionFeature =
  | "dashboard.view"
  | "products.view"
  | "products.manage"
  | "orders.manage"
  | "analytics.view"
  | "users.manage"
  | "settings.manage"
  | "billing.manage"
  | "profile.view";

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

export const buildInitialTenantSubscription = (startDate = new Date()) => {
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
  };
};

export const ensureTenantSubscriptionDefaults = (tenant: ITenant) => {
  const hasInitializedSubscription = Boolean(
    tenant.subscription?.status ||
      tenant.subscription?.planCode ||
      tenant.subscription?.trialStartedAt ||
      tenant.subscription?.trialEndsAt ||
      tenant.subscription?.currentPeriodStart ||
      tenant.subscription?.currentPeriodEnd
  );

  if (!tenant.subscription || !hasInitializedSubscription) {
    tenant.subscription = buildInitialTenantSubscription(tenant.createdAt || new Date());
  }

  tenant.subscription.status = tenant.subscription.status || "expired";
  tenant.subscription.planCode = tenant.subscription.planCode || "trial";
  tenant.subscription.planLabel = tenant.subscription.planLabel || "Free Trial";
  tenant.subscription.billingCycle = tenant.subscription.billingCycle || "trial";
  tenant.subscription.currency = tenant.subscription.currency || "INR";
  tenant.subscription.amount = Number(tenant.subscription.amount || 0);
  tenant.subscription.isTrialUsed = Boolean(tenant.subscription.isTrialUsed);

  return tenant.subscription;
};

export const getTenantAccessState = (tenant: ITenant) => {
  const subscription = ensureTenantSubscriptionDefaults(tenant);
  const now = new Date();

  const trialEndsAt = subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
  const currentPeriodEnd = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd)
    : null;

  const isTrialActive =
    subscription.status === "trialing" &&
    Boolean(trialEndsAt && trialEndsAt.getTime() >= now.getTime());
  const isPaidActive =
    subscription.status === "active" &&
    (!currentPeriodEnd || currentPeriodEnd.getTime() >= now.getTime());

  const hasFullAccess = isTrialActive || isPaidActive;
  const featureAccess = hasFullAccess ? [...FULL_ACCESS_FEATURES] : [...LIMITED_ACCESS_FEATURES];

  return {
    hasFullAccess,
    hasLimitedAccess: !hasFullAccess,
    features: featureAccess,
    subscription: {
      status:
        hasFullAccess
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
      trialDays: DEFAULT_TRIAL_DAYS,
    },
  };
};

export const hasTenantFeature = (tenant: ITenant, feature: SubscriptionFeature) => {
  const access = getTenantAccessState(tenant);
  return access.features.includes("*") || access.features.includes(feature);
};

export const buildTenantAccessPayload = (tenant: ITenant) => {
  const access = getTenantAccessState(tenant);

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

export const ensureDefaultSubscriptionPlans = async () => {
  await Promise.all(
    DEFAULT_SUBSCRIPTION_PLANS.map((plan) =>
      SubscriptionPlan.updateOne(
        { code: plan.code },
        { $set: plan },
        { upsert: true }
      )
    )
  );
};

export const getSubscriptionPlans = async () => {
  await ensureDefaultSubscriptionPlans();
  return SubscriptionPlan.find({ isActive: true }).sort({ amount: 1 }).lean();
};

export const getSubscriptionPlanByCode = async (code: string) => {
  await ensureDefaultSubscriptionPlans();
  return SubscriptionPlan.findOne({ code, isActive: true });
};

export const activateTenantPlan = async (tenant: ITenant, plan: ISubscriptionPlan, paidAt = new Date()) => {
  const currentPeriodStart = paidAt;
  const currentPeriodEnd = addMonths(currentPeriodStart, plan.durationInMonths);

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
  };

  await tenant.save();
  return tenant;
};

export const getTenantByTenantId = async (tenantId?: string) => {
  if (!tenantId) return null;
  return Tenant.findOne({ tenantId });
};
