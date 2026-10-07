import { Document, Schema, Types, model } from "mongoose";

export interface ISubscriptionInvoice extends Document {
  tenant: Types.ObjectId;
  tenantId: string;
  transaction: Types.ObjectId;
  invoiceNumber: string;
  planCode: string;
  planName: string;
  billingCycle: "weekly" | "monthly" | "quarterly" | "yearly";
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

const SubscriptionInvoiceSchema = new Schema<ISubscriptionInvoice>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    tenantId: { type: String, required: true, index: true },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionTransaction",
      required: true,
      index: true,
    },
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    planCode: {
      type: String,
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
      enum: ["issued", "paid", "void"],
      default: "paid",
    },
    issuedAt: { type: Date, default: Date.now },
    periodStart: { type: Date, default: null },
    periodEnd: { type: Date, default: null },
    paymentId: { type: String, default: "" },
    orderId: { type: String, default: "" },
  },
  { timestamps: true }
);

export default model<ISubscriptionInvoice>(
  "SubscriptionInvoice",
  SubscriptionInvoiceSchema,
  "subscription_invoices"
);
