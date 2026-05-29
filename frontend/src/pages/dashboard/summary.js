import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dashboardOverview } from "../../api/services/product/anakyticsApi";
import { heroBodySx, heroCardPaddingSx, heroTitleSx } from "../../utils/pageHero";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));
const formatNumber = (value) => numberFormatter.format(Number(value || 0));
const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;
const EMPTY_ARRAY = [];

const cardSx = {
  borderRadius: 5,
  border: "1px solid rgba(15, 23, 42, 0.08)",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
  backgroundColor: "#ffffff",
};

const chartColors = ["#0f766e", "#1d4ed8", "#f97316", "#7c3aed", "#dc2626"];

function MetricCard({ title, value, subtitle, icon, accent, tone = "default" }) {
  const accents = {
    default: {
      background: "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(244,247,251,0.96) 100%)",
      iconBg: `${accent}18`,
      border: `${accent}26`,
    },
    highlight: {
      background: `linear-gradient(135deg, ${accent} 0%, #0f172a 120%)`,
      iconBg: "rgba(255,255,255,0.16)",
      border: "rgba(255,255,255,0.12)",
    },
  };

  const style = accents[tone];
  const isHighlight = tone === "highlight";

  return (
    <Paper
      elevation={0}
      sx={{
        ...cardSx,
        p: 2.5,
        minHeight: 170,
        background: style.background,
        borderColor: style.border,
        color: isHighlight ? "#fff" : "#0f172a",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Typography variant="body2" sx={{ color: isHighlight ? "rgba(255,255,255,0.72)" : "#64748b" }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1.5, fontWeight: 800, letterSpacing: "-0.04em" }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.5, color: isHighlight ? "rgba(255,255,255,0.8)" : "#475569" }}>
            {subtitle}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            display: "grid",
            placeItems: "center",
            backgroundColor: style.iconBg,
            color: isHighlight ? "#fff" : accent,
            border: `1px solid ${style.border}`,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}

function SectionCard({ title, subtitle, action, children, minHeight }) {
  return (
    <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.25, md: 3 }, minHeight }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" sx={{ mt: 0.5, color: "#64748b" }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Stack>
      {children}
    </Paper>
  );
}

function EmptyState({ text }) {
  return (
    <Box
      sx={{
        minHeight: 180,
        borderRadius: 4,
        border: "1px dashed rgba(100, 116, 139, 0.35)",
        display: "grid",
        placeItems: "center",
        color: "#64748b",
        backgroundColor: "#f8fafc",
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
}

function ListRow({ primary, secondary, right, progress, progressColor = "#0f766e" }) {
  return (
    <Box sx={{ py: 1.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body1" sx={{ fontWeight: 700, color: "#0f172a" }} noWrap>
            {primary}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }} noWrap>
            {secondary}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
          {right}
        </Typography>
      </Stack>
      {typeof progress === "number" ? (
        <LinearProgress
          variant="determinate"
          value={Math.max(0, Math.min(100, progress))}
          sx={{
            mt: 1.25,
            height: 8,
            borderRadius: 999,
            backgroundColor: "rgba(148, 163, 184, 0.18)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              backgroundColor: progressColor,
            },
          }}
        />
      ) : null}
    </Box>
  );
}

export default function Summary() {
  const [range, setRange] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await dashboardOverview(range);
        if (!ignore) {
          setDashboard(response.data);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError?.response?.data?.message || "Failed to load dashboard data.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [range]);

  const summary = dashboard?.summary || {};
  const salesTrend = dashboard?.salesTrend || EMPTY_ARRAY;
  const paymentBreakdownData = dashboard?.paymentBreakdown || EMPTY_ARRAY;
  const topProducts = dashboard?.topProducts || EMPTY_ARRAY;
  const hourlySalesData = dashboard?.hourlySales || EMPTY_ARRAY;
  const teamPerformance = dashboard?.ordersByUser || EMPTY_ARRAY;
  const lowStockProducts = dashboard?.lowStockProducts || EMPTY_ARRAY;

  const topPaymentMethod = paymentBreakdownData[0];

  const paymentChartData = useMemo(
    () =>
      paymentBreakdownData.map((item) => ({
        name: item.name?.toUpperCase?.() || "UNKNOWN",
        value: Number(item.amount || 0),
      })),
    [paymentBreakdownData]
  );

  const topProductPeak = useMemo(
    () => topProducts.reduce((max, item) => Math.max(max, Number(item.quantity || 0)), 0),
    [topProducts]
  );

  const topSellerPeak = useMemo(
    () => teamPerformance.reduce((max, item) => Math.max(max, Number(item.revenue || 0)), 0),
    [teamPerformance]
  );

  const salesPeak = useMemo(
    () => salesTrend.reduce((max, item) => Math.max(max, Number(item.revenue || 0)), 0),
    [salesTrend]
  );

  const lastUpdated = useMemo(() => {
    if (!dashboard?.range?.to) return "";
    const date = new Date(dashboard.range.to);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [dashboard]);

  if (loading) {
    return (
      <Box sx={{ minHeight: 420, display: "grid", placeItems: "center" }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={36} sx={{ color: "#0f766e" }} />
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Building your dashboard overview...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 1, md: 2 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          ...cardSx,
          overflow: "hidden",
          background:
            "radial-gradient(circle at top left, rgba(13, 148, 136, 0.18), transparent 35%), linear-gradient(135deg, #0f172a 0%, #102a43 48%, #0f766e 100%)",
          color: "#fff",
          p: heroCardPaddingSx,
          mb: 3,
        }}
      >
        <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" spacing={3}>
          <Box sx={{ maxWidth: 760 }}>
            <Chip
              label="Operations dashboard"
              size="small"
              sx={{
                mb: 2,
                color: "#ccfbf1",
                border: "1px solid rgba(204, 251, 241, 0.24)",
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />
            <Typography variant="h3" sx={{ ...heroTitleSx, maxWidth: 700 }}>
              Professional visibility into sales, cash flow, staff performance, and stock risk.
            </Typography>
            <Typography
              variant="body1"
              sx={{ ...heroBodySx, maxWidth: 680, color: "rgba(255,255,255,0.78)" }}
            >
              Track revenue trends, understand payment behavior, spot your best-selling products, and act on
              inventory alerts without jumping across multiple reports.
            </Typography>
          </Box>
          <Stack spacing={1.5} alignItems={{ xs: "flex-start", lg: "flex-end" }}>
            <ToggleButtonGroup
              value={range}
              exclusive
              onChange={(_, value) => value && setRange(value)}
              sx={{
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 999,
                p: 0.5,
                "& .MuiToggleButton-root": {
                  border: "none",
                  textTransform: "none",
                  color: "rgba(255,255,255,0.72)",
                  borderRadius: 999,
                  px: 2,
                  fontWeight: 700,
                },
                "& .Mui-selected": {
                  backgroundColor: "#ffffff !important",
                  color: "#0f172a !important",
                },
              }}
            >
              <ToggleButton value="daily">Last 7 days</ToggleButton>
              <ToggleButton value="monthly">Last 12 months</ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.74)" }}>
              Updated {lastUpdated || "just now"}
            </Typography>
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
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
          subtitle={`${formatNumber(summary.totalOrders)} orders completed`}
          icon={<PaidRoundedIcon />}
          accent="#0f766e"
          tone="highlight"
        />
        <MetricCard
          title="Cash Collected"
          value={formatCurrency(summary.totalCollected)}
          subtitle={`${formatCurrency(summary.outstandingCredit)} still outstanding`}
          icon={<AccountBalanceWalletRoundedIcon />}
          accent="#1d4ed8"
        />
        <MetricCard
          title="Average Order Value"
          value={formatCurrency(summary.averageOrderValue)}
          subtitle={`${formatCurrency(summary.todayRevenue)} earned today`}
          icon={<ShoppingBagRoundedIcon />}
          accent="#f97316"
        />
        <MetricCard
          title="Gross Profit"
          value={formatCurrency(summary.grossProfit)}
          subtitle={`${formatPercent(summary.profitMargin)} margin across all orders`}
          icon={<TrendingUpRoundedIcon />}
          accent="#7c3aed"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.8fr) minmax(360px, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <SectionCard
          title="Revenue trend"
          subtitle={range === "daily" ? "Daily performance for the last 7 days" : "Monthly performance for the last 12 months"}
          minHeight={420}
          action={
            <Chip
              icon={<QueryStatsRoundedIcon />}
              label={`${formatNumber(summary.todayOrders)} orders today`}
              sx={{ fontWeight: 700 }}
            />
          }
        >
          {!salesTrend.length ? (
            <EmptyState text="No sales trend data available yet." />
          ) : (
            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="salesCollectedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.24} />
                      <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(value) => `${Math.round(Number(value || 0) / 1000)}k`}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(value), name === "revenue" ? "Revenue" : "Collected"]}
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 12px 24px rgba(15, 23, 42, 0.12)",
                    }}
                  />
                  <Area type="monotone" dataKey="collected" stroke="#1d4ed8" fill="url(#salesCollectedGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="revenue" stroke="#0f766e" fill="url(#salesRevenueGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          )}
          <Divider sx={{ my: 2.5 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, backgroundColor: "#f8fafc" }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Discounts given
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.75, fontWeight: 800 }}>
                {formatCurrency(summary.totalDiscount)}
              </Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, backgroundColor: "#f8fafc" }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Tax billed
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.75, fontWeight: 800 }}>
                {formatCurrency(summary.totalTax)}
              </Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, backgroundColor: "#f8fafc" }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Best period revenue
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.75, fontWeight: 800 }}>
                {formatCurrency(salesPeak)}
              </Typography>
            </Paper>
          </Box>
        </SectionCard>

        <SectionCard
          title="Payment mix"
          subtitle="See which payment method drives the most value"
          minHeight={420}
          action={
            topPaymentMethod ? (
              <Chip label={`${topPaymentMethod.name?.toUpperCase?.()} leads`} sx={{ fontWeight: 700 }} />
            ) : null
          }
        >
          {!paymentChartData.length ? (
            <EmptyState text="Payment method data will appear here once orders are recorded." />
          ) : (
            <>
              <Box sx={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={92}
                      paddingAngle={3}
                    >
                      {paymentChartData.map((item, index) => (
                        <Cell key={item.name} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Stack divider={<Divider flexItem />}>
                {paymentBreakdownData.map((item, index) => (
                  <ListRow
                    key={item.key}
                    primary={item.name?.toUpperCase?.() || "UNKNOWN"}
                    secondary={`${formatNumber(item.orders)} orders`}
                    right={`${formatCurrency(item.amount)} • ${formatPercent(item.share)}`}
                    progress={item.share}
                    progressColor={chartColors[index % chartColors.length]}
                  />
                ))}
              </Stack>
            </>
          )}
        </SectionCard>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "minmax(340px, 1fr) minmax(0, 1.15fr) minmax(340px, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <SectionCard
          title="Top products"
          subtitle="Your strongest performers by quantity sold"
          minHeight={420}
          action={<Inventory2RoundedIcon sx={{ color: "#0f766e" }} />}
        >
          {!topProducts.length ? (
            <EmptyState text="Top-selling products will appear after your first completed orders." />
          ) : (
            <Stack divider={<Divider flexItem />}>
              {topProducts.map((product) => (
                <ListRow
                  key={String(product.id)}
                  primary={product.name}
                  secondary={product.sku ? `SKU ${product.sku}` : "SKU not available"}
                  right={`${formatCurrency(product.revenue)} revenue`}
                  progress={topProductPeak ? (Number(product.quantity || 0) / topProductPeak) * 100 : 0}
                  progressColor="#0f766e"
                />
              ))}
            </Stack>
          )}
        </SectionCard>

        <SectionCard
          title="Today by hour"
          subtitle="Identify peak selling hours for today"
          minHeight={420}
        >
          {!hourlySalesData.some((item) => Number(item.revenue || 0) > 0) ? (
            <EmptyState text="Today’s hourly sales will show up as soon as orders are placed." />
          ) : (
            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    interval={2}
                  />
                  <YAxis
                    tickFormatter={(value) => `${Math.round(Number(value || 0) / 1000)}k`}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#1d4ed8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </SectionCard>

        <SectionCard
          title="Team performance"
          subtitle="Which users are contributing the most revenue"
          minHeight={420}
          action={<GroupRoundedIcon sx={{ color: "#1d4ed8" }} />}
        >
          {!teamPerformance.length ? (
            <EmptyState text="User performance data appears once orders are linked to staff members." />
          ) : (
            <Stack divider={<Divider flexItem />}>
              {teamPerformance.map((member) => (
                <ListRow
                  key={String(member.id)}
                  primary={member.name}
                  secondary={`${formatNumber(member.orders)} orders handled`}
                  right={formatCurrency(member.revenue)}
                  progress={topSellerPeak ? (Number(member.revenue || 0) / topSellerPeak) * 100 : 0}
                  progressColor="#1d4ed8"
                />
              ))}
            </Stack>
          )}
        </SectionCard>
      </Box>

      <SectionCard
        title="Low stock alerts"
        subtitle="Products at or below reorder level so your team can act early"
        action={
          <Chip
            icon={<WarningAmberRoundedIcon />}
            label={`${formatNumber(lowStockProducts.length)} alerts`}
            color={lowStockProducts.length ? "warning" : "default"}
            variant={lowStockProducts.length ? "filled" : "outlined"}
          />
        }
      >
        {!lowStockProducts.length ? (
          <EmptyState text="No low-stock risks right now. Inventory levels look healthy." />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {lowStockProducts.map((product) => (
              <Paper
                key={String(product.id)}
                elevation={0}
                sx={{
                  p: 2.25,
                  borderRadius: 4,
                  border: "1px solid rgba(245, 158, 11, 0.25)",
                  background: "linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)",
                }}
              >
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body1" sx={{ fontWeight: 800, color: "#9a3412" }} noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: "#b45309" }}>
                      {product.sku ? `SKU ${product.sku}` : "SKU not available"}
                    </Typography>
                  </Box>
                  <WarningAmberRoundedIcon sx={{ color: "#f59e0b" }} />
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }} useFlexGap flexWrap="wrap">
                  <Chip label={`Stock ${formatNumber(product.stockQty)}`} size="small" />
                  <Chip label={`Reorder at ${formatNumber(product.reorderLevel)}`} size="small" />
                  <Chip label={`Gap ${formatNumber(product.reorderGap)}`} size="small" color="warning" />
                </Stack>
              </Paper>
            ))}
          </Box>
        )}
      </SectionCard>
    </Box>
  );
}
