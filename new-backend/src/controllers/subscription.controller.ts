import crypto from "crypto";
import { Request, Response } from "express";
import Tenant from "../models/tenant.model";
import SubscriptionInvoice from "../models/subscription-invoice.model";
import SubscriptionPlan from "../models/subscription-plan.model";
import SubscriptionTransaction from "../models/subscription-transaction.model";
import {
  buildTenantAccessPayload,
  getSubscriptionPlanByCode,
  getSubscriptionPlans,
} from "../services/subscription.service";

type AuthRequest = Request & { user?: any; rawBody?: string };

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";
const DEFAULT_SUBSCRIPTION_TOTAL_COUNT = Math.max(
  1,
  Number(process.env.RAZORPAY_SUBSCRIPTION_TOTAL_COUNT || 1200)
);

const formatPlan = (plan: any) => ({
  code: plan.code,
  name: plan.name,
  interval: plan.interval,
  amount: Number(plan.amount || 0),
  currency: plan.currency || "INR",
  durationInMonths: Number(plan.durationInMonths || 0),
  durationInDays: Number(plan.durationInDays || 0),
  description: plan.description || "",
});

const generateInvoiceNumber = (tenantId: string) => {
  const timestamp = Date.now().toString().slice(-8);
  return `INV-${tenantId}-${timestamp}`;
};

const createBasicAuthHeader = () =>
  `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`;

const callRazorpayApi = async (path: string, init: RequestInit = {}) => {
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: createBasicAuthHeader(),
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Razorpay request failed for ${path}`);
  }

  return response.json();
};

const isMissingRazorpayEntityError = (error: unknown) => {
  const message = String((error as any)?.message || "");
  return (
    message.includes('"code":"BAD_REQUEST_ERROR"') &&
    message.includes("invalid") &&
    message.includes("could not be found")
  );
};

const toDateFromUnix = (value?: number | null) => {
  if (!value) return null;
  const date = new Date(Number(value) * 1000);
  return Number.isNaN(date.getTime()) ? null : date;
};

const mapPlanToRazorpayFrequency = (interval: string) => {
  switch (interval) {
    case "yearly":
      return { period: "yearly", interval: 1 };
    case "quarterly":
      return { period: "quarterly", interval: 1 };
    case "weekly":
      return { period: "weekly", interval: 1 };
    case "monthly":
    default:
      return { period: "monthly", interval: 1 };
  }
};

const getInternalStatusFromGateway = (
  gatewayStatus: string,
  existingStatus: string,
  currentPeriodEnd: Date | null
) => {
  const normalizedStatus = String(gatewayStatus || "").toLowerCase();
  const now = new Date();
  const isCurrentPeriodValid = Boolean(currentPeriodEnd && currentPeriodEnd.getTime() >= now.getTime());

  if (normalizedStatus === "active") {
    return "active";
  }

  if (normalizedStatus === "cancelled" || normalizedStatus === "completed") {
    return isCurrentPeriodValid ? "active" : "cancelled";
  }

  if (normalizedStatus === "pending" || normalizedStatus === "halted" || normalizedStatus === "paused") {
    return isCurrentPeriodValid ? "active" : "past_due";
  }

  if (normalizedStatus === "expired") {
    return "expired";
  }

  if (normalizedStatus === "authenticated" || normalizedStatus === "created") {
    return existingStatus === "trialing" ? "trialing" : isCurrentPeriodValid ? "active" : "expired";
  }

  return isCurrentPeriodValid ? "active" : existingStatus || "expired";
};

const isAutopayEnabledStatus = (gatewayStatus: string) => {
  const normalizedStatus = String(gatewayStatus || "").toLowerCase();
  return !["cancelled", "completed", "expired"].includes(normalizedStatus);
};

const updateTenantFromGatewaySubscription = ({
  tenant,
  plan,
  subscriptionEntity,
  eventType,
}: {
  tenant: any;
  plan: any;
  subscriptionEntity: any;
  eventType: string;
}) => {
  const currentPeriodStart = toDateFromUnix(subscriptionEntity?.current_start) || tenant.subscription?.currentPeriodStart || null;
  const currentPeriodEnd = toDateFromUnix(subscriptionEntity?.current_end) || tenant.subscription?.currentPeriodEnd || null;
  const nextBillingAt = toDateFromUnix(subscriptionEntity?.charge_at) || currentPeriodEnd || tenant.subscription?.nextBillingAt || null;
  const gatewayStatus = String(subscriptionEntity?.status || "").toLowerCase();
  const existingStatus = String(tenant.subscription?.status || "expired");

  tenant.subscription = {
    ...(tenant.subscription || {}),
    status: getInternalStatusFromGateway(gatewayStatus, existingStatus, currentPeriodEnd),
    planCode: plan?.code || tenant.subscription?.planCode || "trial",
    planLabel: plan?.name || tenant.subscription?.planLabel || "Free Trial",
    billingCycle: plan?.interval || tenant.subscription?.billingCycle || "trial",
    amount: Number(plan?.amount ?? tenant.subscription?.amount ?? 0),
    currency: plan?.currency || tenant.subscription?.currency || "INR",
    currentPeriodStart,
    currentPeriodEnd,
    nextBillingAt,
    lastPaymentAt: tenant.subscription?.lastPaymentAt || null,
    isTrialUsed: Boolean(tenant.subscription?.isTrialUsed),
    trialStartedAt: tenant.subscription?.trialStartedAt || null,
    trialEndsAt: tenant.subscription?.trialEndsAt || null,
    autoPayEnabled: isAutopayEnabledStatus(gatewayStatus),
    gatewayStatus,
    razorpayPlanId: subscriptionEntity?.plan_id || tenant.subscription?.razorpayPlanId || "",
    razorpaySubscriptionId: subscriptionEntity?.id || tenant.subscription?.razorpaySubscriptionId || "",
    razorpayCustomerId: subscriptionEntity?.customer_id || tenant.subscription?.razorpayCustomerId || "",
    lastSubscriptionEventAt: new Date(),
  };

  if (eventType === "subscription.charged") {
    tenant.subscription.lastPaymentAt = new Date();
  }
};

const ensureRazorpayPlan = async (plan: any) => {
  if (plan.razorpayPlanId) {
    try {
      await callRazorpayApi(`/plans/${plan.razorpayPlanId}`, { method: "GET" });
      return plan.razorpayPlanId;
    } catch (error) {
      if (!isMissingRazorpayEntityError(error)) {
        throw error;
      }

      plan.razorpayPlanId = "";
      await plan.save();
    }
  }

  const frequency = mapPlanToRazorpayFrequency(plan.interval);
  const remotePlan = await callRazorpayApi("/plans", {
    method: "POST",
    body: JSON.stringify({
      period: frequency.period,
      interval: frequency.interval,
      item: {
        name: plan.name,
        amount: Math.round(Number(plan.amount || 0) * 100),
        currency: plan.currency || "INR",
        description: plan.description || `${plan.name} autopay plan`,
      },
      notes: {
        localPlanCode: plan.code,
      },
    }),
  });

  plan.razorpayPlanId = remotePlan.id;
  await plan.save();
  return remotePlan.id;
};

const resolvePlanForSubscription = async ({
  planCode,
  razorpayPlanId,
}: {
  planCode?: string;
  razorpayPlanId?: string;
}) => {
  if (planCode) {
    const planByCode = await getSubscriptionPlanByCode(String(planCode));
    if (planByCode) {
      return planByCode;
    }
  }

  if (razorpayPlanId) {
    return SubscriptionPlan.findOne({ razorpayPlanId });
  }

  return null;
};

const fetchRazorpaySubscription = async (subscriptionId: string) =>
  callRazorpayApi(`/subscriptions/${subscriptionId}`, { method: "GET" });

const getTenantForGatewaySubscription = async (subscriptionEntity: any) => {
  const tenantIdFromNotes = subscriptionEntity?.notes?.tenantId;
  if (tenantIdFromNotes) {
    const tenant = await Tenant.findOne({ tenantId: tenantIdFromNotes });
    if (tenant) return tenant;
  }

  if (subscriptionEntity?.id) {
    const tenant = await Tenant.findOne({
      "subscription.razorpaySubscriptionId": String(subscriptionEntity.id),
    });
    if (tenant) return tenant;
  }

  return null;
};

const buildInvoicePayload = async (invoiceNumber: string, tenantId: string) => {
  const invoice = await SubscriptionInvoice.findOne({ invoiceNumber, tenantId }).lean();
  if (!invoice) return null;

  const transaction = await SubscriptionTransaction.findById(invoice.transaction).lean();
  const tenant = await Tenant.findOne({ tenantId }).lean();

  if (!transaction || !tenant) return null;

  return {
    invoice: {
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      amount: invoice.amount,
      currency: invoice.currency,
      issuedAt: invoice.issuedAt,
      periodStart: invoice.periodStart,
      periodEnd: invoice.periodEnd,
      planName: invoice.planName,
      billingCycle: invoice.billingCycle,
      paymentId: invoice.paymentId,
      orderId: invoice.orderId,
    },
    tenant: {
      tenantId: tenant.tenantId,
      name: tenant.name,
      slug: tenant.slug,
      email: tenant.email,
    },
    transaction: {
      id: transaction._id,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      paidAt: transaction.paidAt,
      planName: transaction.planName,
      billingCycle: transaction.billingCycle,
      gatewayPaymentId: transaction.gatewayPaymentId,
      gatewayOrderId: transaction.gatewayOrderId,
    },
    downloadUrl: `${APP_BASE_URL.replace(/\/+$/, "")}/api/v1/subscriptions/invoices/${invoice.invoiceNumber}`,
  };
};

const finalizeSubscriptionCharge = async ({
  tenant,
  plan,
  subscriptionEntity,
  paymentEntity,
  signature,
  eventType,
  createdBy,
}: {
  tenant: any;
  plan: any;
  subscriptionEntity: any;
  paymentEntity?: any;
  signature?: string;
  eventType: string;
  createdBy?: any;
}) => {
  updateTenantFromGatewaySubscription({ tenant, plan, subscriptionEntity, eventType });

  const paymentId = paymentEntity?.id || "";
  const orderId = paymentEntity?.order_id || "";
  const paidAt = toDateFromUnix(paymentEntity?.created_at) || new Date();
  const billingCycleStart = toDateFromUnix(subscriptionEntity?.current_start);
  const billingCycleEnd = toDateFromUnix(subscriptionEntity?.current_end);

  let transaction =
    (paymentId
      ? await SubscriptionTransaction.findOne({ gatewayPaymentId: paymentId, tenantId: tenant.tenantId })
      : null) ||
    (await SubscriptionTransaction.findOne({
      gatewaySubscriptionId: subscriptionEntity?.id,
      tenantId: tenant.tenantId,
    }).sort({ createdAt: -1 }));

  if (!transaction) {
    transaction = new SubscriptionTransaction({
      tenant: tenant._id,
      tenantId: tenant.tenantId,
      planCode: plan.code,
      planName: plan.name,
      billingCycle: plan.interval,
      amount: plan.amount,
      currency: plan.currency || "INR",
      gateway: "razorpay",
    });
  }

  transaction.planCode = plan.code;
  transaction.planName = plan.name;
  transaction.billingCycle = plan.interval;
  transaction.amount = plan.amount;
  transaction.currency = plan.currency || "INR";
  transaction.status = "paid";
  transaction.gatewayOrderId = orderId || transaction.gatewayOrderId || "";
  transaction.gatewayPaymentId = paymentId || transaction.gatewayPaymentId || "";
  transaction.gatewaySignature = signature || transaction.gatewaySignature || "";
  transaction.gatewaySubscriptionId = subscriptionEntity?.id || transaction.gatewaySubscriptionId || "";
  transaction.paidAt = paidAt;
  transaction.billingCycleStart = billingCycleStart;
  transaction.billingCycleEnd = billingCycleEnd;
  transaction.eventType = eventType;
  transaction.metadata = {
    ...(transaction.metadata || {}),
    razorpaySubscriptionStatus: subscriptionEntity?.status || "",
    authAttempts: subscriptionEntity?.auth_attempts ?? null,
    paidCount: subscriptionEntity?.paid_count ?? null,
  };
  transaction.createdBy = transaction.createdBy?.email
    ? transaction.createdBy
    : {
        userId: createdBy?.userId || "",
        name: createdBy?.name || "",
        email: createdBy?.email || "",
      };

  if (!transaction.invoiceNumber) {
    transaction.invoiceNumber = generateInvoiceNumber(tenant.tenantId);
  }

  tenant.subscription.lastPaymentAt = paidAt;
  await transaction.save();
  await tenant.save();

  const existingInvoice = await SubscriptionInvoice.findOne({
    invoiceNumber: transaction.invoiceNumber,
    tenantId: tenant.tenantId,
  });

  if (!existingInvoice) {
    await SubscriptionInvoice.create({
      tenant: tenant._id,
      tenantId: tenant.tenantId,
      transaction: transaction._id,
      invoiceNumber: transaction.invoiceNumber,
      planCode: plan.code,
      planName: plan.name,
      billingCycle: plan.interval,
      amount: plan.amount,
      currency: plan.currency || "INR",
      status: "paid",
      issuedAt: paidAt,
      periodStart: tenant.subscription?.currentPeriodStart || paidAt,
      periodEnd: tenant.subscription?.currentPeriodEnd || paidAt,
      paymentId,
      orderId,
    });
  }

  return { tenant, transaction };
};

export const getSubscriptionOverview = async (req: AuthRequest, res: Response) => {
  try {
    const tenant = await Tenant.findOne({ tenantId: req.user?.tenantId });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const [plans, transactions] = await Promise.all([
      getSubscriptionPlans(),
      SubscriptionTransaction.find({ tenantId: tenant.tenantId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return res.json({
      ...buildTenantAccessPayload(tenant),
      plans: plans.map(formatPlan),
      recentTransactions: transactions,
    });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to fetch subscription overview" });
  }
};

export const listSubscriptionPlans = async (_req: AuthRequest, res: Response) => {
  try {
    const plans = await getSubscriptionPlans();
    return res.json(plans.map(formatPlan));
  } catch (_error) {
    return res.status(500).json({ message: "Failed to fetch subscription plans" });
  }
};

export const createSubscriptionCheckoutOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { planCode } = req.body;
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay is not configured on the server." });
    }

    const tenant = await Tenant.findOne({ tenantId: req.user?.tenantId });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const plan = await getSubscriptionPlanByCode(String(planCode || ""));
    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    const razorpayPlanId = await ensureRazorpayPlan(plan);
    const subscription = await callRazorpayApi("/subscriptions", {
      method: "POST",
      body: JSON.stringify({
        plan_id: razorpayPlanId,
        total_count: DEFAULT_SUBSCRIPTION_TOTAL_COUNT,
        quantity: 1,
        customer_notify: true,
        notes: {
          tenantId: tenant.tenantId,
          tenantName: tenant.name,
          planCode: plan.code,
          userEmail: req.body?.userEmail || "",
        },
      }),
    });

    tenant.subscription = {
      ...(tenant.subscription || {}),
      planCode: plan.code,
      planLabel: plan.name,
      billingCycle: plan.interval,
      amount: plan.amount,
      currency: plan.currency || "INR",
      autoPayEnabled: false,
      gatewayStatus: String(subscription.status || "").toLowerCase(),
      razorpayPlanId,
      razorpaySubscriptionId: subscription.id,
      razorpayCustomerId: subscription.customer_id || "",
      lastSubscriptionEventAt: new Date(),
    };
    await tenant.save();

    const transaction = await SubscriptionTransaction.create({
      tenant: tenant._id,
      tenantId: tenant.tenantId,
      planCode: plan.code,
      planName: plan.name,
      billingCycle: plan.interval,
      amount: plan.amount,
      currency: plan.currency || "INR",
      status: "created",
      gateway: "razorpay",
      gatewaySubscriptionId: subscription.id,
      eventType: "subscription.created",
      metadata: {
        razorpayStatus: subscription.status,
        shortUrl: subscription.short_url || "",
      },
      createdBy: {
        userId: req.user?.id || "",
        name: req.body?.userName || "",
        email: req.body?.userEmail || "",
      },
    });

    return res.status(201).json({
      keyId: RAZORPAY_KEY_ID,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        shortUrl: subscription.short_url || "",
      },
      transaction: {
        id: transaction._id,
        planCode: transaction.planCode,
        planName: transaction.planName,
        amount: transaction.amount,
        currency: transaction.currency,
      },
      tenant: {
        name: tenant.name,
        email: tenant.email,
        contact: "",
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to create autopay subscription",
      details: error?.message || "",
      error: error || "",
    });
  }
};

export const verifySubscriptionPayment = async (req: AuthRequest, res: Response) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_signature || !razorpay_subscription_id) {
      return res.status(400).json({ message: "Incomplete subscription verification payload" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await SubscriptionTransaction.updateOne(
        { gatewaySubscriptionId: razorpay_subscription_id, tenantId: req.user?.tenantId },
        {
          $set: {
            status: "failed",
            gatewayPaymentId: razorpay_payment_id,
            gatewaySignature: razorpay_signature,
            eventType: "subscription.verify_failed",
          },
        }
      );
      return res.status(400).json({ message: "Subscription signature verification failed" });
    }

    const tenant = await Tenant.findOne({ tenantId: req.user?.tenantId });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const subscription = await fetchRazorpaySubscription(String(razorpay_subscription_id));
    const plan = await resolvePlanForSubscription({
      planCode: subscription?.notes?.planCode,
      razorpayPlanId: subscription?.plan_id,
    });

    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    let message = "Autopay mandate authorised. Waiting for activation confirmation.";

    if (String(subscription?.status || "").toLowerCase() === "active") {
      await finalizeSubscriptionCharge({
        tenant,
        plan,
        subscriptionEntity: subscription,
        paymentEntity: {
          id: razorpay_payment_id,
        },
        signature: razorpay_signature,
        eventType: "subscription.activated",
        createdBy: {
          userId: req.user?.id || "",
          name: req.body?.userName || "",
          email: req.body?.userEmail || "",
        },
      });
      message = "Autopay subscription activated successfully";
    } else {
      updateTenantFromGatewaySubscription({
        tenant,
        plan,
        subscriptionEntity: subscription,
        eventType: "subscription.authenticated",
      });
      await tenant.save();
    }

    return res.json({
      message,
      ...buildTenantAccessPayload(tenant),
    });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to verify subscription mandate" });
  }
};

export const handleSubscriptionWebhook = async (req: AuthRequest, res: Response) => {
  try {
    if (!RAZORPAY_WEBHOOK_SECRET) {
      return res.status(500).json({ message: "Razorpay webhook secret is not configured." });
    }

    const signature = String(req.headers["x-razorpay-signature"] || "");
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(req.rawBody || JSON.stringify(req.body || {}))
      .digest("hex");

    if (!signature || signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = String(req.body?.event || "");
    const subscriptionEntity = req.body?.payload?.subscription?.entity;
    const paymentEntity = req.body?.payload?.payment?.entity;

    if (!subscriptionEntity?.id) {
      return res.status(200).json({ received: true, ignored: true });
    }

    const tenant = await getTenantForGatewaySubscription(subscriptionEntity);
    if (!tenant) {
      return res.status(200).json({ received: true, ignored: true });
    }

    const plan = await resolvePlanForSubscription({
      planCode: subscriptionEntity?.notes?.planCode,
      razorpayPlanId: subscriptionEntity?.plan_id,
    });

    if (!plan) {
      return res.status(200).json({ received: true, ignored: true });
    }

    if (event === "subscription.charged" || event === "subscription.activated") {
      await finalizeSubscriptionCharge({
        tenant,
        plan,
        subscriptionEntity,
        paymentEntity,
        eventType: event,
      });
    } else {
      updateTenantFromGatewaySubscription({
        tenant,
        plan,
        subscriptionEntity,
        eventType: event,
      });
      await tenant.save();

      if (event === "subscription.halted" || event === "subscription.pending") {
        await SubscriptionTransaction.create({
          tenant: tenant._id,
          tenantId: tenant.tenantId,
          planCode: plan.code,
          planName: plan.name,
          billingCycle: plan.interval,
          amount: plan.amount,
          currency: plan.currency || "INR",
          status: "failed",
          gateway: "razorpay",
          gatewaySubscriptionId: subscriptionEntity.id,
          gatewayPaymentId: paymentEntity?.id || "",
          eventType: event,
          metadata: {
            razorpaySubscriptionStatus: subscriptionEntity.status,
          },
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to process subscription webhook" });
  }
};

export const listSubscriptionTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await SubscriptionTransaction.find({ tenantId: req.user?.tenantId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(transactions);
  } catch (_error) {
    return res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

export const getInvoiceDetails = async (req: AuthRequest, res: Response) => {
  try {
    const invoiceNumber = String(req.params.invoiceNumber || "");
    const payload = await buildInvoicePayload(invoiceNumber, String(req.user?.tenantId || ""));

    if (!payload) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.json(payload);
  } catch (_error) {
    return res.status(500).json({ message: "Failed to fetch invoice" });
  }
};
