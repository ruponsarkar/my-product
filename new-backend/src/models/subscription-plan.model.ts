import { Document, Schema, model } from "mongoose";

export interface ISubscriptionPlan extends Document {
  code: "monthly" | "quarterly" | "yearly";
  name: string;
  interval: "monthly" | "quarterly" | "yearly";
  amount: number;
  currency: string;
  durationInMonths: number;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    code: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true },
    interval: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    durationInMonths: { type: Number, required: true, min: 1 },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<ISubscriptionPlan>(
  "SubscriptionPlan",
  SubscriptionPlanSchema,
  "subscription_plans"
);
