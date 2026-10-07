import { Document, Schema, model } from "mongoose";

export interface ISubscriptionPlan extends Document {
  code: string;
  name: string;
  interval: "weekly" | "monthly" | "quarterly" | "yearly";
  amount: number;
  currency: string;
  durationInMonths: number;
  durationInDays?: number;
  description?: string;
  razorpayPlanId?: string;
  isActive: boolean;
  deletedAt?: Date | null;
  previousRazorpayPlanIds?: string[];
  retiredGatewayPlans?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true },
    interval: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    durationInMonths: { type: Number, required: true, min: 1 },
    durationInDays: { type: Number, min: 1 },
    description: { type: String, default: "" },
    razorpayPlanId: { type: String, default: "", index: true, sparse: true },
    deletedAt: { type: Date, default: null },
    retiredGatewayPlans: { type: [Schema.Types.Mixed], default: [] },
    previousRazorpayPlanIds: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<ISubscriptionPlan>(
  "SubscriptionPlan",
  SubscriptionPlanSchema,
  "subscription_plans"
);
