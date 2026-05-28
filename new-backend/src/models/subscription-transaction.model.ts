import { Document, Schema, Types, model } from "mongoose";

export interface ISubscriptionTransaction extends Document {
  tenant: Types.ObjectId;
  tenantId: string;
  planCode: "weekly" | "monthly" | "quarterly" | "yearly";
  planName: string;
  billingCycle: "weekly" | "monthly" | "quarterly" | "yearly";
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

const SubscriptionTransactionSchema = new Schema<ISubscriptionTransaction>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    tenantId: { type: String, required: true, index: true },
    planCode: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
      required: true,
    },
    planName: { type: String, required: true },
    billingCycle: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "expired", "refunded"],
      default: "created",
      index: true,
    },
    gateway: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay",
    },
    gatewayOrderId: { type: String, index: true, sparse: true },
    gatewayPaymentId: { type: String, index: true, sparse: true },
    gatewaySignature: { type: String, default: "" },
    gatewaySubscriptionId: { type: String, index: true, sparse: true },
    invoiceNumber: { type: String, index: true, sparse: true },
    paidAt: { type: Date, default: null },
    billingCycleStart: { type: Date, default: null },
    billingCycleEnd: { type: Date, default: null },
    eventType: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdBy: {
      userId: { type: String, default: "" },
      name: { type: String, default: "" },
      email: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default model<ISubscriptionTransaction>(
  "SubscriptionTransaction",
  SubscriptionTransactionSchema,
  "subscription_transactions"
);
