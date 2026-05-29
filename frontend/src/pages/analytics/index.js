import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  LinearProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import CreditScoreRoundedIcon from "@mui/icons-material/CreditScoreRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dashboardOverview } from "../../api/services/product/anakyticsApi";

const chartColors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"];

const defaultFrom = () => {
  const date = new Date();
  date.setDate(date.getDate() - 29);
  return date.toISOString().slice(0, 10);
};

const today = () => new Date().toISOString().slice(0, 10);

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(Number(value || 0));

const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;

const compactCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

const safeArray = (value) => (Array.isArray(value) ? value : []);

const DashboardGrid = ({ children, columns = { xs: 1, md: 2, lg: 4 }, sx = {} }) => (
  <Box
    sx={{
      display: "grid",
      gap: 2,
      alignItems: "stretch",
      gridTemplateColumns: {
        xs: `repeat(${columns.xs || 1}, minmax(0, 1fr))`,
        sm: `repeat(${columns.sm || columns.xs || 1}, minmax(0, 1fr))`,
        md: `repeat(${columns.md || columns.sm || columns.xs || 1}, minmax(0, 1fr))`,
        lg: `repeat(${columns.lg || columns.md || columns.sm || columns.xs || 1}, minmax(0, 1fr))`,
      },
      "& > *": {
        minWidth: 0,
      },
      ...sx,
    }}
  >
    {children}
  </Box>
);

const KpiCard = ({ title, value, helper, icon, color = "#2563eb", growth }) => (
  <Card elevation={0} sx={{ height: "100%", border: "1px solid #e2e8f0", borderRadius: 3 }}>
    <CardContent sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ color: "#0f172a", fontWeight: 900, mt: 0.75, overflowWrap: "anywhere" }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            color,
            backgroundColor: `${color}14`,
          }}
        >
          {icon}
        </Box>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
        {growth !== undefined ? (
          <Chip
            size="small"
            label={`${growth >= 0 ? "+" : ""}${formatPercent(growth)}`}
            color={growth >= 0 ? "success" : "error"}
            sx={{ fontWeight: 800 }}
          />
        ) : null}
        <Typography variant="caption" sx={{ color: "#64748b", minWidth: 0 }}>
          {helper}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

const ChartCard = ({ title, subtitle, action, children }) => (
  <Card elevation={0} sx={{ height: "100%", border: "1px solid #e2e8f0", borderRadius: 3 }}>
    <CardContent sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.5} sx={{ mb: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "#0f172a" }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            {subtitle}
          </Typography>
        </Box>
        {action}
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </CardContent>
  </Card>
);

const EmptyChart = ({ text = "No data for this range yet." }) => (
  <Box sx={{ height: 300, display: "grid", placeItems: "center", color: "#64748b", border: "1px dashed #cbd5e1", borderRadius: 2 }}>
    <Typography variant="body2">{text}</Typography>
  </Box>
);

const AnalyticsTable = ({ rows, columns, emptyText }) => (
  <TableContainer sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ backgroundColor: "#f8fafc" }}>
          {columns.map((column) => (
            <TableCell key={column.key} sx={{ fontWeight: 800, color: "#334155", whiteSpace: "nowrap" }}>
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {!rows.length ? (
          <TableRow>
            <TableCell colSpan={columns.length} sx={{ py: 4, textAlign: "center", color: "#64748b" }}>
              {emptyText}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, index) => (
            <TableRow key={row.id || row.name || index} hover>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(row[column.key], row, index) : row[column.key] ?? "--"}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default function Analytics() {
  const [rangeType, setRangeType] = useState("daily");
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const queryParams = useMemo(
    () => ({
      type: rangeType,
      from: rangeType === "custom" ? fromDate : undefined,
      to: rangeType === "custom" ? toDate : undefined,
    }),
    [fromDate, rangeType, toDate]
  );

  const loadAnalytics = React.useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await dashboardOverview(queryParams);
      setData(response.data || {});
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Unable to load analytics right now.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const summary = data?.summary || {};
  const inventory = data?.inventory || {};
  const salesTrend = safeArray(data?.salesTrend);
  const paymentBreakdown = safeArray(data?.paymentBreakdown);
  const topProducts = safeArray(data?.topProducts);
  const hourlySales = safeArray(data?.hourlySales);
  const ordersByUser = safeArray(data?.ordersByUser);
  const lowStockProducts = safeArray(data?.lowStockProducts);
  const categoryPerformance = safeArray(data?.categoryPerformance);
  const orderSourceBreakdown = safeArray(data?.orderSourceBreakdown);
  const statusBreakdown = safeArray(data?.statusBreakdown);
  const slowMovingProducts = safeArray(data?.slowMovingProducts);
  const hasTrendData = salesTrend.some((item) => item.revenue || item.orders || item.collected);

  const insightChips = [
    { label: `AOV ${formatCurrency(summary.averageOrderValue)}`, color: "primary" },
    { label: `Margin ${formatPercent(summary.profitMargin)}`, color: summary.profitMargin >= 25 ? "success" : "warning" },
    { label: `${formatNumber(summary.todayOrders)} orders today`, color: "default" },
    { label: `${formatNumber(lowStockProducts.length)} low stock`, color: lowStockProducts.length ? "warning" : "success" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100%",
        background:
          "radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 26%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1600, mx: "auto" }}>
        <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" spacing={2.5} sx={{ mb: 3 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <AssessmentRoundedIcon sx={{ color: "#2563eb" }} />
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>
                Analytics
              </Typography>
            </Stack>
            <Typography sx={{ color: "#64748b", maxWidth: 780 }}>
              Track revenue, profit, collections, product movement, team performance, and inventory risk from one paid-plan workspace.
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
              {insightChips.map((chip) => (
                <Chip key={chip.label} label={chip.label} color={chip.color} size="small" variant={chip.color === "default" ? "outlined" : "filled"} />
              ))}
            </Stack>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
            <TextField
              select
              label="Range"
              size="small"
              value={rangeType}
              onChange={(event) => setRangeType(event.target.value)}
              sx={{ minWidth: 150, backgroundColor: "#fff" }}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="custom">Date range</MenuItem>
            </TextField>
            {rangeType === "custom" ? (
              <>
                <TextField
                  label="From"
                  type="date"
                  size="small"
                  value={fromDate}
                  onChange={(event) => setFromDate(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ backgroundColor: "#fff" }}
                />
                <TextField
                  label="To"
                  type="date"
                  size="small"
                  value={toDate}
                  onChange={(event) => setToDate(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ backgroundColor: "#fff" }}
                />
              </>
            ) : null}
            <Button
              variant="contained"
              startIcon={refreshing ? <CircularProgress size={16} color="inherit" /> : <RefreshRoundedIcon />}
              onClick={() => loadAnalytics({ silent: true })}
              disabled={loading || refreshing}
              sx={{ textTransform: "none", fontWeight: 800, boxShadow: "none" }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        {error ? (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        ) : null}

        {loading ? (
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={2} alignItems="center">
                <CircularProgress />
                <Typography sx={{ color: "#64748b" }}>Loading analytics...</Typography>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2.5}>
            <DashboardGrid columns={{ xs: 1, sm: 2, lg: 4 }}>
              <Box>
                <KpiCard
                  title="Revenue"
                  value={formatCurrency(summary.totalRevenue)}
                  helper="Selected range sales"
                  growth={summary.growth?.revenue}
                  icon={<PaidRoundedIcon />}
                  color="#2563eb"
                />
              </Box>
              <Box>
                <KpiCard
                  title="Gross Profit"
                  value={formatCurrency(summary.grossProfit)}
                  helper={`${formatPercent(summary.profitMargin)} margin`}
                  icon={<TrendingUpRoundedIcon />}
                  color="#10b981"
                />
              </Box>
              <Box>
                <KpiCard
                  title="Collected"
                  value={formatCurrency(summary.totalCollected)}
                  helper={`${formatCurrency(summary.outstandingCredit)} credit pending`}
                  growth={summary.growth?.collected}
                  icon={<CreditScoreRoundedIcon />}
                  color="#f59e0b"
                />
              </Box>
              <Box>
                <KpiCard
                  title="Orders"
                  value={formatNumber(summary.totalOrders)}
                  helper={`${formatCurrency(summary.averageOrderValue)} average order`}
                  growth={summary.growth?.orders}
                  icon={<LocalMallRoundedIcon />}
                  color="#8b5cf6"
                />
              </Box>
            </DashboardGrid>

            <DashboardGrid columns={{ xs: 1, lg: 12 }}>
              <Box sx={{ gridColumn: { lg: "span 8" } }}>
                <ChartCard title="Sales trend" subtitle="Revenue, collection, credit, and orders by selected period">
                  {hasTrendData ? (
                    <Box sx={{ height: 360 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={salesTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} />
                          <YAxis yAxisId="money" tickFormatter={compactCurrency} tick={{ fill: "#64748b", fontSize: 12 }} />
                          <YAxis yAxisId="orders" orientation="right" tick={{ fill: "#64748b", fontSize: 12 }} />
                          <Tooltip formatter={(value, name) => (name === "orders" ? formatNumber(value) : formatCurrency(value))} />
                          <Legend />
                          <Area yAxisId="money" type="monotone" dataKey="revenue" name="Revenue" fill="#2563eb22" stroke="#2563eb" strokeWidth={2} />
                          <Bar yAxisId="money" dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                          <Line yAxisId="money" type="monotone" dataKey="credit" name="Credit" stroke="#f59e0b" strokeWidth={2} />
                          <Line yAxisId="orders" type="monotone" dataKey="orders" name="Orders" stroke="#8b5cf6" strokeWidth={2} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <EmptyChart />
                  )}
                </ChartCard>
              </Box>

              <Box sx={{ gridColumn: { lg: "span 4" } }}>
                <ChartCard title="Payment mix" subtitle="How customers are paying">
                  {paymentBreakdown.length ? (
                    <Box sx={{ height: 360 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={paymentBreakdown} dataKey="amount" nameKey="name" innerRadius={65} outerRadius={115} paddingAngle={3} label>
                            {paymentBreakdown.map((_, index) => (
                              <Cell key={index} fill={chartColors[index % chartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <EmptyChart />
                  )}
                </ChartCard>
              </Box>
            </DashboardGrid>

            <DashboardGrid columns={{ xs: 1, lg: 2 }}>
              <Box>
                <ChartCard title="Top products" subtitle="Best revenue and quantity drivers">
                  {topProducts.length ? (
                    <Box sx={{ height: 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topProducts} layout="vertical" margin={{ left: 24 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis type="number" tickFormatter={compactCurrency} />
                          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value, name) => (name === "quantity" ? formatNumber(value) : formatCurrency(value))} />
                          <Legend />
                          <Bar dataKey="revenue" name="Revenue" fill="#2563eb" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="quantity" name="Qty sold" fill="#10b981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <EmptyChart />
                  )}
                </ChartCard>
              </Box>

              <Box>
                <ChartCard title="Category performance" subtitle="Where revenue is coming from">
                  {categoryPerformance.length ? (
                    <Box sx={{ height: 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={categoryPerformance}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                          <YAxis tickFormatter={compactCurrency} />
                          <Tooltip formatter={(value, name) => (name === "quantity" ? formatNumber(value) : formatCurrency(value))} />
                          <Legend />
                          <Area type="monotone" dataKey="revenue" name="Revenue" fill="#8b5cf622" stroke="#8b5cf6" strokeWidth={2} />
                          <Line type="monotone" dataKey="quantity" name="Qty sold" stroke="#f59e0b" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <EmptyChart />
                  )}
                </ChartCard>
              </Box>
            </DashboardGrid>

            <DashboardGrid columns={{ xs: 1, md: 2, lg: 3 }}>
              <Box>
                <ChartCard title="Today by hour" subtitle="Spot peak sales time">
                  {hourlySales.some((item) => item.revenue || item.orders) ? (
                    <Box sx={{ height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hourlySales}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="label" interval={3} tick={{ fontSize: 11 }} />
                          <YAxis tickFormatter={compactCurrency} />
                          <Tooltip formatter={(value, name) => (name === "orders" ? formatNumber(value) : formatCurrency(value))} />
                          <Bar dataKey="revenue" name="Revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <EmptyChart text="No hourly sales today." />
                  )}
                </ChartCard>
              </Box>

              <Box>
                <ChartCard title="Order source" subtitle="POS, web, or app contribution">
                  {orderSourceBreakdown.length ? (
                    <Box sx={{ height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={orderSourceBreakdown} dataKey="orders" nameKey="name" outerRadius={95} label>
                            {orderSourceBreakdown.map((_, index) => (
                              <Cell key={index} fill={chartColors[index % chartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatNumber(value)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <EmptyChart />
                  )}
                </ChartCard>
              </Box>

              <Box sx={{ gridColumn: { md: "span 2", lg: "span 1" } }}>
                <ChartCard title="Order status" subtitle="Paid, credit, completed, and cancelled mix">
                  {statusBreakdown.length ? (
                    <Box sx={{ height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis />
                          <Tooltip formatter={(value) => formatNumber(value)} />
                          <Bar dataKey="orders" name="Orders" fill="#84cc16" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <EmptyChart />
                  )}
                </ChartCard>
              </Box>
            </DashboardGrid>

            <DashboardGrid columns={{ xs: 1, lg: 12 }}>
              <Box sx={{ gridColumn: { lg: "span 4" } }}>
                <ChartCard title="Inventory value" subtitle="Current stock health">
                  <Stack spacing={2}>
                    <KpiCard
                      title="Cost value"
                      value={formatCurrency(inventory.inventoryValue)}
                      helper={`${formatNumber(inventory.unitsInStock)} units across ${formatNumber(inventory.products)} products`}
                      icon={<Inventory2RoundedIcon />}
                      color="#0f766e"
                    />
                    <KpiCard
                      title="Retail value"
                      value={formatCurrency(inventory.retailValue)}
                      helper={`${formatCurrency((inventory.retailValue || 0) - (inventory.inventoryValue || 0))} potential margin`}
                      icon={<AccountBalanceWalletRoundedIcon />}
                      color="#7c3aed"
                    />
                  </Stack>
                </ChartCard>
              </Box>

              <Box sx={{ gridColumn: { lg: "span 8" } }}>
                <ChartCard
                  title="Inventory action list"
                  subtitle="Low stock and slow-moving products that need attention"
                  action={
                    lowStockProducts.length ? (
                      <Chip icon={<WarningAmberRoundedIcon />} label={`${lowStockProducts.length} reorder alerts`} color="warning" size="small" />
                    ) : null
                  }
                >
                  <DashboardGrid columns={{ xs: 1, md: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>
                        Low stock
                      </Typography>
                      <AnalyticsTable
                        rows={lowStockProducts}
                        emptyText="No low-stock products right now."
                        columns={[
                          { key: "name", label: "Product" },
                          { key: "stockQty", label: "Stock", render: (value) => formatNumber(value) },
                          { key: "reorderGap", label: "Gap", render: (value) => formatNumber(value) },
                        ]}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>
                        Slow moving
                      </Typography>
                      <AnalyticsTable
                        rows={slowMovingProducts}
                        emptyText="No slow-moving stock found for this range."
                        columns={[
                          { key: "name", label: "Product" },
                          { key: "stockQty", label: "Stock", render: (value) => formatNumber(value) },
                          { key: "soldQuantity", label: "Sold", render: (value) => formatNumber(value) },
                        ]}
                      />
                    </Box>
                  </DashboardGrid>
                </ChartCard>
              </Box>
            </DashboardGrid>

            <DashboardGrid columns={{ xs: 1, lg: 2 }}>
              <Box>
                <ChartCard title="Team contribution" subtitle="Revenue and order contribution by staff">
                  <AnalyticsTable
                    rows={ordersByUser}
                    emptyText="No team order data for this range."
                    columns={[
                      { key: "name", label: "User" },
                      { key: "orders", label: "Orders", render: (value) => formatNumber(value) },
                      { key: "revenue", label: "Revenue", render: (value) => formatCurrency(value) },
                    ]}
                  />
                </ChartCard>
              </Box>
              <Box>
                <ChartCard title="Product leaderboard" subtitle="Top products with scan-friendly rank">
                  <Stack spacing={1.25}>
                    {!topProducts.length ? <EmptyChart text="No product sales for this range." /> : null}
                    {topProducts.map((product, index) => {
                      const maxRevenue = Math.max(...topProducts.map((item) => Number(item.revenue || 0)), 1);
                      return (
                        <Box key={product.id || product.name} sx={{ p: 1.5, border: "1px solid #e2e8f0", borderRadius: 2, backgroundColor: "#fff" }}>
                          <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 1 }}>
                            <Box>
                              <Typography sx={{ fontWeight: 800, color: "#0f172a" }}>
                                #{index + 1} {product.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#64748b" }}>
                                {formatNumber(product.quantity)} units sold
                              </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 900, color: "#2563eb" }}>
                              {formatCurrency(product.revenue)}
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(100, (Number(product.revenue || 0) / maxRevenue) * 100)}
                            sx={{ height: 8, borderRadius: 999, backgroundColor: "#e2e8f0" }}
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                </ChartCard>
              </Box>
            </DashboardGrid>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
