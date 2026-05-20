import { Document, Types } from "mongoose";
export interface ISubscriptionTransaction extends Document {
    tenant: Types.ObjectId;
    tenantId: string;
    planCode: "monthly" | "quarterly" | "yearly";
    planName: string;
    billingCycle: "monthly" | "quarterly" | "yearly";
    amount: number;
    currency: string;
    status: "created" | "paid" | "failed" | "expired" | "refunded";
    gateway: "razorpay";
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    gatewaySignature?: string;
    gatewaySubscriptionId?: string;
    invoiceNumber?: string;
    paidAt?: Date | null;
    billingCycleStart?: Date | null;
    billingCycleEnd?: Date | null;
    eventType?: string;
    metadata?: Record<string, any>;
    createdBy?: {
        userId?: string;
        name?: string;
        email?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}
declare const _default: import("mongoose").Model<ISubscriptionTransaction, {}, {}, {}, Document<unknown, {}, ISubscriptionTransaction, {}, {}> & ISubscriptionTransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=subscription-transaction.model.d.ts.map