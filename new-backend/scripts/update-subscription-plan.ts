#!/usr/bin/env ts-node

import "dotenv/config";
import connectDB from "../src/config/db";
import SubscriptionPlan from "../src/models/subscription-plan.model";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

type ParsedArgs = {
  code: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  durationInMonths?: number;
  durationInDays?: number;
  dryRun: boolean;
};

const parseArgs = (): ParsedArgs => {
  const args = process.argv.slice(2);
  const readValue = (flag: string) => {
    const index = args.indexOf(flag);
    if (index === -1) return "";
    return args[index + 1] || "";
  };

  const code = readValue("--code");
  const amount = Number(readValue("--amount"));
  const currency = readValue("--currency");
  const name = readValue("--name");
  const description = readValue("--description");
  const durationInMonthsRaw = readValue("--duration-months");
  const durationInDaysRaw = readValue("--duration-days");
  const dryRun = args.includes("--dry-run");

  if (!code) {
    throw new Error("Missing required argument: --code <weekly|monthly|quarterly|yearly>");
  }

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Missing or invalid required argument: --amount <number>");
  }

  const parsedArgs: ParsedArgs = {
    code,
    amount,
    dryRun,
  };

  if (currency) {
    parsedArgs.currency = currency;
  }

  if (name) {
    parsedArgs.name = name;
  }

  if (description) {
    parsedArgs.description = description;
  }

  if (durationInMonthsRaw) {
    const durationInMonths = Number(durationInMonthsRaw);
    if (!Number.isFinite(durationInMonths) || durationInMonths < 1) {
      throw new Error("Invalid --duration-months value. It must be a positive number.");
    }
    parsedArgs.durationInMonths = durationInMonths;
  }

  if (durationInDaysRaw) {
    const durationInDays = Number(durationInDaysRaw);
    if (!Number.isFinite(durationInDays) || durationInDays < 1) {
      throw new Error("Invalid --duration-days value. It must be a positive number.");
    }
    parsedArgs.durationInDays = durationInDays;
  }

  return parsedArgs;
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

const run = async () => {
  try {
    const options = parseArgs();
    await connectDB();

    const plan = await SubscriptionPlan.findOne({ code: options.code });
    if (!plan) {
      throw new Error(`Subscription plan not found for code "${options.code}"`);
    }

    const updatedFields = {
      name: options.name || plan.name,
      amount: options.amount,
      currency: options.currency || plan.currency || "INR",
      description: options.description ?? plan.description ?? "",
      durationInMonths:
        typeof options.durationInMonths === "number" && Number.isFinite(options.durationInMonths)
          ? options.durationInMonths
          : plan.durationInMonths,
      durationInDays:
        typeof options.durationInDays === "number" && Number.isFinite(options.durationInDays)
          ? options.durationInDays
          : plan.durationInDays,
    };

    console.log("Planned subscription plan update:");
    console.log(
      JSON.stringify(
        {
          code: plan.code,
          oldAmount: plan.amount,
          newAmount: updatedFields.amount,
          oldCurrency: plan.currency,
          newCurrency: updatedFields.currency,
          oldRazorpayPlanId: plan.razorpayPlanId || "",
          name: updatedFields.name,
          durationInMonths: updatedFields.durationInMonths,
          durationInDays: updatedFields.durationInDays || null,
          dryRun: options.dryRun,
        },
        null,
        2
      )
    );

    if (options.dryRun) {
      console.log("Dry run complete. No changes were written.");
      process.exit(0);
    }

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials are not configured in environment variables.");
    }

    const frequency = mapPlanToRazorpayFrequency(plan.interval);
    const remotePlan = await callRazorpayApi("/plans", {
      method: "POST",
      body: JSON.stringify({
        period: frequency.period,
        interval: frequency.interval,
        item: {
          name: updatedFields.name,
          amount: Math.round(Number(updatedFields.amount || 0) * 100),
          currency: updatedFields.currency,
          description: updatedFields.description,
        },
        notes: {
          localPlanCode: plan.code,
          rotatedAt: new Date().toISOString(),
          previousRazorpayPlanId: plan.razorpayPlanId || "",
        },
      }),
    });

    plan.name = updatedFields.name;
    plan.amount = updatedFields.amount;
    plan.currency = updatedFields.currency;
    plan.description = updatedFields.description;
    plan.durationInMonths = updatedFields.durationInMonths;
    if (typeof updatedFields.durationInDays === "number") {
      plan.durationInDays = updatedFields.durationInDays;
    }
    plan.razorpayPlanId = remotePlan.id;

    await plan.save();

    console.log("Subscription plan updated successfully.");
    console.log(
      JSON.stringify(
        {
          code: plan.code,
          amount: plan.amount,
          currency: plan.currency,
          razorpayPlanId: plan.razorpayPlanId,
          note: "Existing active subscriptions keep their current Razorpay plan until they are changed separately.",
        },
        null,
        2
      )
    );

    process.exit(0);
  } catch (error) {
    console.error("Subscription plan update failed:", error);
    process.exit(1);
  }
};

run();
