import crypto from "crypto";
import { Request, Response } from "express";
import Tenant from "../models/tenant.model";
import SubscriptionInvoice from "../models/subscription-invoice.model";
import SubscriptionTransaction from "../models/subscription-transaction.model";
import {
  activateTenantPlan,
  buildTenantAccessPayload,
  getSubscriptionPlanByCode,
  getSubscriptionPlans,
} from "../services/subscription.service";

type AuthRequest = Request & { user?: any };

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";

const formatPlan = (plan: any) => ({
  code: plan.code,
  name: plan.name,
  interval: plan.interval,
  amount: Number(plan.amount || 0),
  currency: plan.currency || "INR",
  durationInMonths: Number(plan.durationInMonths || 0),
  description: plan.description || "",
});

const generateInvoiceNumber = (tenantId: string) => {
  const timestamp = Date.now().toString().slice(-8);
  return `INV-${tenantId}-${timestamp}`;
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

    res.json({
      ...buildTenantAccessPayload(tenant),
      plans: plans.map(formatPlan),
      recentTransactions: transactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscription overview" });
  }
};

export const listSubscriptionPlans = async (_req: AuthRequest, res: Response) => {
  try {
    const plans = await getSubscriptionPlans();
    res.json(plans.map(formatPlan));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscription plans" });
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

    const receipt = `sub_${tenant.tenantId}_${Date.now()}`;
    const amountPaise = Math.round(Number(plan.amount || 0) * 100);

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: plan.currency || "INR",
        receipt,
        notes: {
          tenantId: tenant.tenantId,
          tenantName: tenant.name,
          planCode: plan.code,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return res.status(502).json({ message: "Failed to create Razorpay order", details: errorBody });
    }

    const razorpayOrder = (await response.json()) as {
      id: string;
      amount: number;
      currency: string;
      receipt: string;
      status: string;
    };

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
      gatewayOrderId: razorpayOrder.id,
      metadata: {
        razorpayReceipt: razorpayOrder.receipt,
        razorpayStatus: razorpayOrder.status,
      },
      createdBy: {
        userId: req.user?.id || "",
        name: req.body?.userName || "",
        email: req.body?.userEmail || "",
      },
    });

    res.status(201).json({
      keyId: RAZORPAY_KEY_ID,
      order: razorpayOrder,
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
  } catch (error) {
    res.status(500).json({ message: "Failed to create checkout order" });
  }
};

export const verifySubscriptionPayment = async (req: AuthRequest, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Incomplete payment verification payload" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await SubscriptionTransaction.updateOne(
        { gatewayOrderId: razorpay_order_id, tenantId: req.user?.tenantId },
        {
          $set: {
            status: "failed",
            gatewayPaymentId: razorpay_payment_id,
            gatewaySignature: razorpay_signature,
          },
        }
      );
      return res.status(400).json({ message: "Payment signature verification failed" });
    }

    const tenant = await Tenant.findOne({ tenantId: req.user?.tenantId });
    const transaction = await SubscriptionTransaction.findOne({
      gatewayOrderId: razorpay_order_id,
      tenantId: req.user?.tenantId,
    });

    if (!tenant || !transaction) {
      return res.status(404).json({ message: "Billing transaction not found" });
    }

    const plan = await getSubscriptionPlanByCode(transaction.planCode);
    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    const paidAt = new Date();
    const invoiceNumber = generateInvoiceNumber(tenant.tenantId);

    transaction.status = "paid";
    transaction.gatewayPaymentId = razorpay_payment_id;
    transaction.gatewaySignature = razorpay_signature;
    transaction.paidAt = paidAt;
    transaction.invoiceNumber = invoiceNumber;
    await transaction.save();

    await activateTenantPlan(tenant, plan, paidAt);

    await SubscriptionInvoice.create({
      tenant: tenant._id,
      tenantId: tenant.tenantId,
      transaction: transaction._id,
      invoiceNumber,
      planCode: plan.code,
      planName: plan.name,
      billingCycle: plan.interval,
      amount: plan.amount,
      currency: plan.currency || "INR",
      status: "paid",
      issuedAt: paidAt,
      periodStart: tenant.subscription?.currentPeriodStart || paidAt,
      periodEnd: tenant.subscription?.currentPeriodEnd || paidAt,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    res.json({
      message: "Subscription activated successfully",
      ...buildTenantAccessPayload(tenant),
      invoiceNumber,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify subscription payment" });
  }
};

export const listSubscriptionTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await SubscriptionTransaction.find({ tenantId: req.user?.tenantId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

export const getInvoiceDetails = async (req: AuthRequest, res: Response) => {
  try {
    const invoiceNumber = String(req.params.invoiceNumber || "");
    const payload = await buildInvoicePayload(invoiceNumber, String(req.user?.tenantId || ""));

    if (!payload) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invoice" });
  }
};
