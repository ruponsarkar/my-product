import { Schema, model, Document, Connection } from 'mongoose';

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
  accessExtendedUntil?: Date | null;
  accessExtensions?: { days: number; reason: string; actor: string; createdAt: Date; until: Date }[];
  subscription?: {
    status?: 'trialing' | 'active' | 'expired' | 'cancelled' | 'past_due';
    planCode?: string;
    planLabel?: string;
    billingCycle?: 'trial' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
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
    cancelAtPeriodEnd?: boolean;
    pendingPlanCode?: string;
    pendingPlanLabel?: string;
    pendingBillingCycle?: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | '';
    pendingAmount?: number;
    pendingCurrency?: string;
    pendingChangeEffectiveAt?: Date | null;
    lastSubscriptionEventAt?: Date | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const TenantSubscriptionSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['trialing', 'active', 'expired', 'cancelled', 'past_due'],
      default: 'trialing',
    },
    planCode: {
      type: String,
      default: 'trial',
    },
    planLabel: { type: String, default: 'Free Trial' },
    billingCycle: {
      type: String,
      enum: ['trial', 'weekly', 'monthly', 'quarterly', 'yearly'],
      default: 'trial',
    },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    trialStartedAt: { type: Date, default: null },
    trialEndsAt: { type: Date, default: null },
    currentPeriodStart: { type: Date, default: null },
    currentPeriodEnd: { type: Date, default: null },
    nextBillingAt: { type: Date, default: null },
    lastPaymentAt: { type: Date, default: null },
    isTrialUsed: { type: Boolean, default: false },
    autoPayEnabled: { type: Boolean, default: false },
    gatewayStatus: { type: String, default: "" },
    razorpayPlanId: { type: String, default: "" },
    razorpaySubscriptionId: { type: String, default: "", index: true, sparse: true },
    razorpayCustomerId: { type: String, default: "" },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    pendingPlanCode: { type: String, default: "" },
    pendingPlanLabel: { type: String, default: "" },
    pendingBillingCycle: { type: String, default: "" },
    pendingAmount: { type: Number, default: 0 },
    pendingCurrency: { type: String, default: "" },
    pendingChangeEffectiveAt: { type: Date, default: null },
    lastSubscriptionEventAt: { type: Date, default: null },
  },
  { _id: false }
);

const TenantSchema = new Schema<ITenant>(
  {
    tenantId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    dbName: { type: String, required: true, unique: true, index: true },
    settings: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    accessExtendedUntil: { type: Date, default: null },
    accessExtensions: [{ days: Number, reason: String, actor: String, createdAt: Date, until: Date }],
    subscription: { type: TenantSubscriptionSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const getTenantModel = (conn: Connection) => {
  if (conn.models.Tenant) return conn.models.Tenant as ReturnType<typeof model>;
  return conn.model<ITenant>('Tenant', TenantSchema, 'accounts');
};

export default model<ITenant>('Tenant', TenantSchema, 'accounts');
