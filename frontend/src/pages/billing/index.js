import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { useNavigate } from "react-router-dom";
import {
  createSubscriptionCheckoutOrder,
  getInvoiceDetails,
  getSubscriptionOverview,
  verifySubscriptionPayment,
} from "../../api/services/subscription/subscriptionApi";
import { getStoredUser, persistAuthData } from "../../utils/auth";
import {
  downloadInvoiceFile,
  formatBillingCurrency,
  formatBillingDate,
  loadRazorpayScript,
} from "../../utils/billing";

const cardSx = {
  borderRadius: 5,
  border: "1px solid rgba(15, 23, 42, 0.08)",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
  backgroundColor: "#ffffff",
};

const statusColorMap = {
  trialing: "info",
  active: "success",
  expired: "warning",
  cancelled: "default",
  past_due: "error",
};

export default function BillingPage() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const [loading, setLoading] = useState(true);
  const [submittingPlan, setSubmittingPlan] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [data, setData] = useState(null);

  const loadOverview = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSubscriptionOverview();
      setData(response.data);
      persistAuthData({
        user: currentUser,
        tenant: response.data?.tenant,
        access: response.data?.access,
      });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to load billing overview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const subscription = data?.tenant?.subscription || {};
  const plans = data?.plans || [];
  const recentTransactions = data?.recentTransactions || [];

  const subscriptionHeadline = useMemo(() => {
    if (subscription.status === "trialing") {
      return `Free trial active until ${formatBillingDate(subscription.trialEndsAt)}`;
    }
    if (subscription.status === "active") {
      if (subscription.autoPayEnabled) {
        return `${subscription.planLabel || "Paid plan"} autopay active until ${formatBillingDate(subscription.currentPeriodEnd)}`;
      }
      return `${subscription.planLabel || "Paid plan"} active until ${formatBillingDate(subscription.currentPeriodEnd)}`;
    }
    return "Your workspace is in limited-access mode until a plan is activated.";
  }, [subscription]);

  const handleInvoiceDownload = async (invoiceNumber) => {
    try {
      const response = await getInvoiceDetails(invoiceNumber);
      downloadInvoiceFile(response.data);
    } catch (downloadError) {
      setError(downloadError?.response?.data?.message || "Unable to download invoice.");
    }
  };

  const handlePlanCheckout = async (planCode) => {
    setError("");
    setSuccess("");
    setSubmittingPlan(planCode);

    try {
      const checkoutReady = await loadRazorpayScript();
      if (!checkoutReady || !window.Razorpay) {
        throw new Error("Razorpay checkout could not be loaded.");
      }

      const orderResponse = await createSubscriptionCheckoutOrder({
        planCode,
        userName: currentUser?.name || "",
        userEmail: currentUser?.email || "",
      });

      const checkoutData = orderResponse.data;
      const razorpay = new window.Razorpay({
        key: checkoutData.keyId,
        subscription_id: checkoutData.subscription.id,
        name: checkoutData.tenant?.name || "Inventory",
        description: `${checkoutData.transaction.planName} autopay subscription`,
        handler: async (response) => {
          const verifyResponse = await verifySubscriptionPayment({
            ...response,
            userName: currentUser?.name || "",
            userEmail: currentUser?.email || "",
          });
          setSuccess(verifyResponse.data?.message || "Autopay mandate saved successfully.");
          persistAuthData({
            user: currentUser,
            tenant: verifyResponse.data?.tenant,
            access: verifyResponse.data?.access,
          });
          await loadOverview();
        },
        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
        },
        theme: {
          color: "#0f766e",
        },
      });

      razorpay.on("payment.failed", (event) => {
        setError(
          event?.error?.description || "Autopay setup failed before the subscription could be activated."
        );
      });

      razorpay.open();
    } catch (checkoutError) {
      setError(
        checkoutError?.response?.data?.message ||
          checkoutError?.message ||
          "Unable to start the subscription checkout."
      );
    } finally {
      setSubmittingPlan("");
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: 420, display: "grid", placeItems: "center" }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress sx={{ color: "#0f766e" }} />
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Loading subscription details...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 1, md: 2 }, py: { xs: 2, md: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          ...cardSx,
          mb: 3,
          p: { xs: 2.5, md: 4 },
          overflow: "hidden",
          background:
            "radial-gradient(circle at top left, rgba(20, 184, 166, 0.16), transparent 34%), linear-gradient(135deg, #0f172a 0%, #102a43 52%, #0f766e 100%)",
          color: "#fff",
        }}
      >
        <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" spacing={3}>
          <Box sx={{ maxWidth: 760 }}>
            <Chip
              icon={<VerifiedRoundedIcon />}
              label="Subscriptions"
              size="small"
              sx={{
                mb: 2,
                color: "#ccfbf1",
                border: "1px solid rgba(204, 251, 241, 0.24)",
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-0.05em" }}>
              Manage your plan, renew access, and download billing records.
            </Typography>
            <Typography sx={{ mt: 1.5, maxWidth: 700, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              Limited accounts can still use the dashboard and product catalog, but plan activation unlocks
              editing, orders, analytics, settings, and user management.
            </Typography>
            <Typography sx={{ mt: 1.1, maxWidth: 700, color: "rgba(255,255,255,0.72)", lineHeight: 1.6 }}>
              Paid plans use Razorpay autopay, so future renewals are collected automatically until the mandate is cancelled.
            </Typography>
          </Box>
          <Stack spacing={1} alignItems={{ xs: "flex-start", lg: "flex-end" }}>
            <Chip
              label={String(subscription.status || "unknown").replace("_", " ")}
              color={statusColorMap[subscription.status] || "default"}
              sx={{ fontWeight: 700, textTransform: "capitalize" }}
            />
            {subscription.gatewayStatus ? (
              <Chip
                label={`Autopay ${String(subscription.gatewayStatus).replace("_", " ")}`}
                variant="outlined"
                sx={{
                  color: "#e2e8f0",
                  borderColor: "rgba(226, 232, 240, 0.32)",
                  textTransform: "capitalize",
                  fontWeight: 700,
                }}
              />
            ) : null}
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.82)" }}>
              {subscriptionHeadline}
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {error ? (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      ) : null}
      {success ? (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
          {success}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.2fr 1fr" },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <BoltRoundedIcon sx={{ color: "#0f766e" }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Current access
            </Typography>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, backgroundColor: "#f8fafc" }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Plan
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.75, fontWeight: 800 }}>
                {subscription.planLabel || "Free Trial"}
              </Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, backgroundColor: "#f8fafc" }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Billing cycle
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.75, fontWeight: 800, textTransform: "capitalize" }}>
                {subscription.billingCycle || "trial"}
              </Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, backgroundColor: "#f8fafc" }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Renewal value
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.75, fontWeight: 800 }}>
                {formatBillingCurrency(subscription.amount, subscription.currency)}
              </Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, backgroundColor: "#f8fafc" }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Autopay
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.75, fontWeight: 800, textTransform: "capitalize" }}>
                {subscription.autoPayEnabled ? subscription.gatewayStatus || "enabled" : "not enabled"}
              </Typography>
            </Paper>
          </Box>
          <Divider sx={{ my: 2.5 }} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<ReceiptLongRoundedIcon />}
              onClick={() => navigate("/billing/transactions")}
              sx={{ textTransform: "none", fontWeight: 700, boxShadow: "none" }}
            >
              View transactions
            </Button>
            <Button
              variant="outlined"
              startIcon={<AutorenewRoundedIcon />}
              onClick={loadOverview}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Refresh status
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <CreditCardRoundedIcon sx={{ color: "#1d4ed8" }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Included with a paid plan
            </Typography>
          </Stack>
          <Stack spacing={1.25}>
            {[
              "Create, edit, and delete products",
              "Process POS and order workflows",
              "Access analytics, reports, users, and settings",
              "Keep invoice history for subscription payments",
              "Renew automatically with Razorpay autopay",
            ].map((item) => (
              <Typography key={item} variant="body2" sx={{ color: "#475569" }}>
                • {item}
              </Typography>
            ))}
          </Stack>
        </Paper>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
        Choose a plan
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        {plans.map((plan) => (
          <Paper
            key={plan.code}
            elevation={0}
            sx={{
              ...cardSx,
              p: 3,
              background:
                plan.code === "yearly"
                  ? "linear-gradient(180deg, rgba(15,118,110,0.08) 0%, #ffffff 100%)"
                  : "#ffffff",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {plan.name}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.75, color: "#64748b" }}>
                  {plan.description}
                </Typography>
              </Box>
              {plan.code === "yearly" ? <Chip label="Best value" color="success" /> : null}
            </Stack>
            <Typography variant="h3" sx={{ mt: 3, fontWeight: 900, letterSpacing: "-0.05em" }}>
              {formatBillingCurrency(plan.amount, plan.currency)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.75, color: "#64748b" }}>
              Every {plan.durationInMonths === 1 ? "month" : `${plan.durationInMonths} months`}
            </Typography>
            <Button
              fullWidth
              variant={plan.code === "yearly" ? "contained" : "outlined"}
              onClick={() => handlePlanCheckout(plan.code)}
              disabled={submittingPlan === plan.code || currentUser?.role !== "admin"}
              sx={{
                mt: 3,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
              }}
            >
              {submittingPlan === plan.code ? "Opening mandate setup..." : "Enable autopay with Razorpay"}
            </Button>
            {currentUser?.role !== "admin" ? (
              <Typography variant="caption" sx={{ mt: 1.25, display: "block", color: "#64748b" }}>
                Only tenant admins can start subscription autopay.
              </Typography>
            ) : null}
          </Paper>
        ))}
      </Box>

      <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Recent billing activity
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: "#64748b" }}>
              Your latest subscription payments and invoice-ready records.
            </Typography>
          </Box>
          <Button onClick={() => navigate("/billing/transactions")} sx={{ textTransform: "none", fontWeight: 700 }}>
            View all
          </Button>
        </Stack>

        {!recentTransactions.length ? (
          <Box
            sx={{
              borderRadius: 4,
              border: "1px dashed rgba(100,116,139,0.35)",
              px: 3,
              py: 6,
              textAlign: "center",
              backgroundColor: "#f8fafc",
            }}
          >
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              No subscription transactions yet. Once a payment is completed, it will show up here.
            </Typography>
          </Box>
        ) : (
          <Stack divider={<Divider flexItem />}>
            {recentTransactions.map((transaction) => (
              <Stack
                key={String(transaction._id)}
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={1.5}
                sx={{ py: 1.75 }}
              >
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {transaction.planName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    {formatBillingDate(transaction.createdAt)} • {String(transaction.status).replace("_", " ")}
                  </Typography>
                </Box>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ xs: "flex-start", sm: "center" }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatBillingCurrency(transaction.amount, transaction.currency)}
                  </Typography>
                  {transaction.invoiceNumber ? (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleInvoiceDownload(transaction.invoiceNumber)}
                      sx={{ textTransform: "none", fontWeight: 700 }}
                    >
                      Download invoice
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
