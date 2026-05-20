import { ITenant } from "../models/tenant.model";
import { ISubscriptionPlan } from "../models/subscription-plan.model";
export declare const FULL_ACCESS_FEATURES: readonly ["*"];
export declare const LIMITED_ACCESS_FEATURES: readonly ["dashboard.view", "products.view", "billing.manage", "profile.view"];
export type SubscriptionFeature = "dashboard.view" | "products.view" | "products.manage" | "orders.manage" | "analytics.view" | "users.manage" | "settings.manage" | "billing.manage" | "profile.view";
type TenantSubscriptionState = NonNullable<ITenant["subscription"]>;
export declare const addMonths: (date: Date, months: number) => Date;
export declare const buildInitialTenantSubscription: (startDate?: Date) => TenantSubscriptionState;
export declare const ensureTenantSubscriptionDefaults: (tenant: ITenant) => {
    status?: "trialing" | "active" | "expired" | "cancelled" | "past_due";
    planCode?: "trial" | "monthly" | "quarterly" | "yearly";
    planLabel?: string;
    billingCycle?: "trial" | "monthly" | "quarterly" | "yearly";
    amount?: number;
    currency?: string;
    trialStartedAt?: Date | null;
    trialEndsAt?: Date | null;
    currentPeriodStart?: Date | null;
    currentPeriodEnd?: Date | null;
    nextBillingAt?: Date | null;
    lastPaymentAt?: Date | null;
    isTrialUsed?: boolean;
    autoPayEnabled?: boolean;
    gatewayStatus?: string;
    razorpayPlanId?: string;
    razorpaySubscriptionId?: string;
    razorpayCustomerId?: string;
    lastSubscriptionEventAt?: Date | null;
};
export declare const getTenantAccessState: (tenant: ITenant) => {
    hasFullAccess: boolean;
    hasLimitedAccess: boolean;
    features: "*"[] | ("dashboard.view" | "products.view" | "billing.manage" | "profile.view")[];
    subscription: {
        status: "active" | "trialing" | "expired" | "cancelled" | "past_due" | undefined;
        planCode: "trial" | "monthly" | "quarterly" | "yearly";
        planLabel: string;
        billingCycle: "trial" | "monthly" | "quarterly" | "yearly";
        amount: number;
        currency: string;
        trialStartedAt: Date | null;
        trialEndsAt: Date | null;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        nextBillingAt: Date | null;
        lastPaymentAt: Date | null;
        isTrialUsed: boolean;
        autoPayEnabled: boolean;
        gatewayStatus: string;
        razorpayPlanId: string;
        razorpaySubscriptionId: string;
        razorpayCustomerId: string;
        lastSubscriptionEventAt: Date | null;
        trialDays: number;
    };
};
export declare const hasTenantFeature: (tenant: ITenant, feature: SubscriptionFeature) => boolean;
export declare const buildTenantAccessPayload: (tenant: ITenant) => {
    tenant: {
        id: any;
        tenantId: string;
        name: string;
        slug: string;
        status: "active" | "inactive";
        subscription: {
            status: "active" | "trialing" | "expired" | "cancelled" | "past_due" | undefined;
            planCode: "trial" | "monthly" | "quarterly" | "yearly";
            planLabel: string;
            billingCycle: "trial" | "monthly" | "quarterly" | "yearly";
            amount: number;
            currency: string;
            trialStartedAt: Date | null;
            trialEndsAt: Date | null;
            currentPeriodStart: Date | null;
            currentPeriodEnd: Date | null;
            nextBillingAt: Date | null;
            lastPaymentAt: Date | null;
            isTrialUsed: boolean;
            autoPayEnabled: boolean;
            gatewayStatus: string;
            razorpayPlanId: string;
            razorpaySubscriptionId: string;
            razorpayCustomerId: string;
            lastSubscriptionEventAt: Date | null;
            trialDays: number;
        };
    };
    access: {
        hasFullAccess: boolean;
        hasLimitedAccess: boolean;
        features: "*"[] | ("dashboard.view" | "products.view" | "billing.manage" | "profile.view")[];
    };
};
export declare const ensureDefaultSubscriptionPlans: () => Promise<void>;
export declare const getSubscriptionPlans: () => Promise<(import("mongoose").FlattenMaps<ISubscriptionPlan> & Required<{
    _id: import("mongoose").FlattenMaps<unknown>;
}> & {
    __v: number;
})[]>;
export declare const getSubscriptionPlanByCode: (code: string) => Promise<(import("mongoose").Document<unknown, {}, ISubscriptionPlan, {}, {}> & ISubscriptionPlan & Required<{
    _id: unknown;
}> & {
    __v: number;
}) | null>;
export declare const activateTenantPlan: (tenant: ITenant, plan: ISubscriptionPlan, paidAt?: Date) => Promise<ITenant>;
export declare const getTenantByTenantId: (tenantId?: string) => Promise<(import("mongoose").Document<unknown, {}, ITenant, {}, {}> & ITenant & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
export {};
//# sourceMappingURL=subscription.service.d.ts.map