import { Document, Types } from "mongoose";
export interface ISubscriptionInvoice extends Document {
    tenant: Types.ObjectId;
    tenantId: string;
    transaction: Types.ObjectId;
    invoiceNumber: string;
    planCode: "monthly" | "quarterly" | "yearly";
    planName: string;
    billingCycle: "monthly" | "quarterly" | "yearly";
    amount: number;
    currency: string;
    status: "issued" | "paid" | "void";
    issuedAt: Date;
    periodStart?: Date | null;
    periodEnd?: Date | null;
    paymentId?: string;
    orderId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
declare const _default: import("mongoose").Model<ISubscriptionInvoice, {}, {}, {}, Document<unknown, {}, ISubscriptionInvoice, {}, {}> & ISubscriptionInvoice & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=subscription-invoice.model.d.ts.map