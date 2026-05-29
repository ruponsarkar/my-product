import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useNavigate } from "react-router-dom";
import {
  getInvoiceDetails,
  getSubscriptionTransactions,
} from "../../api/services/subscription/subscriptionApi";
import {
  downloadInvoiceFile,
  formatBillingCurrency,
  formatBillingDate,
} from "../../utils/billing";
import { heroBodySx, heroCardPaddingSx, heroTitleSx } from "../../utils/pageHero";

const cardSx = {
  borderRadius: 5,
  border: "1px solid rgba(15, 23, 42, 0.08)",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
  backgroundColor: "#ffffff",
};

const statusColorMap = {
  created: "info",
  paid: "success",
  failed: "error",
  expired: "warning",
  refunded: "default",
};

export default function BillingTransactionsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [downloadingInvoice, setDownloadingInvoice] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSubscriptionTransactions();
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to load billing transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const summary = useMemo(() => {
    return transactions.reduce(
      (accumulator, transaction) => {
        const amount = Number(transaction.amount || 0);
        accumulator.total += amount;
        if (transaction.status === "paid") {
          accumulator.paid += 1;
          accumulator.revenue += amount;
        }
        if (transaction.status === "failed") {
          accumulator.failed += 1;
        }
        return accumulator;
      },
      { total: 0, paid: 0, failed: 0, revenue: 0 }
    );
  }, [transactions]);

  const handleInvoiceDownload = async (invoiceNumber) => {
    setError("");
    setDownloadingInvoice(invoiceNumber);

    try {
      const response = await getInvoiceDetails(invoiceNumber);
      downloadInvoiceFile(response.data);
    } catch (downloadError) {
      setError(downloadError?.response?.data?.message || "Unable to download invoice.");
    } finally {
      setDownloadingInvoice("");
    }
  };

  return (
    <Box sx={{ px: { xs: 1, md: 2 }, py: { xs: 2, md: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          ...cardSx,
          mb: 3,
          p: heroCardPaddingSx,
          background:
            "radial-gradient(circle at top left, rgba(20, 184, 166, 0.14), transparent 34%), linear-gradient(135deg, #0f172a 0%, #102a43 52%, #134e4a 100%)",
          color: "#fff",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
          <Box sx={{ maxWidth: 760 }}>
            <Chip
              icon={<ReceiptLongRoundedIcon />}
              label="Billing history"
              size="small"
              sx={{
                mb: 2,
                color: "#ccfbf1",
                border: "1px solid rgba(204, 251, 241, 0.24)",
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />
            <Typography variant="h4" sx={heroTitleSx}>
              Subscription transactions
            </Typography>
            <Typography sx={{ ...heroBodySx, color: "rgba(255,255,255,0.8)" }}>
              Review completed and pending subscription charges, then download invoices for paid billing records.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ xs: "stretch", md: "flex-start" }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate("/billing")}
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.35)",
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Back to billing
            </Button>
            <Button
              variant="contained"
              startIcon={<RefreshRoundedIcon />}
              onClick={fetchTransactions}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                backgroundColor: "#f8fafc",
                color: "#0f172a",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#e2e8f0", boxShadow: "none" },
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {error ? (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Total transactions
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 900 }}>
            {transactions.length}
          </Typography>
        </Paper>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Paid transactions
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 900 }}>
            {summary.paid}
          </Typography>
        </Paper>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Paid revenue
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 900 }}>
            {formatBillingCurrency(summary.revenue)}
          </Typography>
        </Paper>
      </Box>

      <Paper elevation={0} sx={{ ...cardSx, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress sx={{ color: "#0f766e" }} />
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Loading billing activity...
              </Typography>
            </Stack>
          </Box>
        ) : !transactions.length ? (
          <Box
            sx={{
              borderRadius: 4,
              border: "1px dashed rgba(100,116,139,0.35)",
              m: 2.5,
              px: 3,
              py: 6,
              textAlign: "center",
              backgroundColor: "#f8fafc",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 700, color: "#0f172a" }}>
              No subscription transactions yet
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#64748b" }}>
              When a subscription payment is created or completed, it will appear here with its invoice status.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Plan</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Paid at</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Invoice</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Gateway</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={String(transaction._id)} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        {transaction.planName || "Subscription"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b", display: "block", textTransform: "capitalize" }}>
                        {transaction.billingCycle || "billing cycle"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
                        {transaction.createdBy?.email || transaction.createdBy?.name || "Created by workspace user"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={String(transaction.status || "unknown").replace("_", " ")}
                        size="small"
                        color={statusColorMap[transaction.status] || "default"}
                        sx={{ textTransform: "capitalize", fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {formatBillingCurrency(transaction.amount, transaction.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatBillingDate(transaction.createdAt)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatBillingDate(transaction.paidAt)}</Typography>
                    </TableCell>
                    <TableCell>
                      {transaction.invoiceNumber ? (
                        <Stack spacing={0.75} alignItems="flex-start">
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {transaction.invoiceNumber}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<DownloadRoundedIcon />}
                            onClick={() => handleInvoiceDownload(transaction.invoiceNumber)}
                            disabled={downloadingInvoice === transaction.invoiceNumber}
                            sx={{ textTransform: "none", fontWeight: 700 }}
                          >
                            {downloadingInvoice === transaction.invoiceNumber ? "Downloading..." : "Download"}
                          </Button>
                        </Stack>
                      ) : (
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Not available
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                        Order: {transaction.gatewayOrderId || "--"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                        Payment: {transaction.gatewayPaymentId || "--"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
