import { Document } from "mongoose";
export interface ISubscriptionPlan extends Document {
    code: "monthly" | "quarterly" | "yearly";
    name: string;
    interval: "monthly" | "quarterly" | "yearly";
    amount: number;
    currency: string;
    durationInMonths: number;
    description?: string;
    razorpayPlanId?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
declare const _default: import("mongoose").Model<ISubscriptionPlan, {}, {}, {}, Document<unknown, {}, ISubscriptionPlan, {}, {}> & ISubscriptionPlan & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=subscription-plan.model.d.ts.map