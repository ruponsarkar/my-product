import { Document, Schema, model } from "mongoose";

export interface ISubscriptionPlan extends Document {
  code: "weekly" | "monthly" | "quarterly" | "yearly";
  name: string;
  interval: "weekly" | "monthly" | "quarterly" | "yearly";
  amount: number;
  currency: string;
  durationInMonths: number;
  durationInDays?: number;
  description?: string;
  razorpayPlanId?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    code: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
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
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<ISubscriptionPlan>(
  "SubscriptionPlan",
  SubscriptionPlanSchema,
  "subscription_plans"
);
