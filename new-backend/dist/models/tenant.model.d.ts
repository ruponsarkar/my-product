import { Document, Connection } from 'mongoose';
export interface ITenant extends Document {
    _id: any;
    tenantId: string;
    name: string;
    slug: string;
    email: string;
    password: string;
    dbName: string;
    settings: Record<string, any>;
    status: 'active' | 'inactive';
    subscription?: {
        status?: 'trialing' | 'active' | 'expired' | 'cancelled' | 'past_due';
        planCode?: 'trial' | 'monthly' | 'quarterly' | 'yearly';
        planLabel?: string;
        billingCycle?: 'trial' | 'monthly' | 'quarterly' | 'yearly';
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
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const getTenantModel: (conn: Connection) => unknown;
declare const _default: import("mongoose").Model<ITenant, {}, {}, {}, Document<unknown, {}, ITenant, {}, {}> & ITenant & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=tenant.model.d.ts.map