import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
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
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import {
  netProfit,
  ordersByUser,
  paymentBreakdown,
  salesByDate,
  salesByHour,
  summary,
  topSellingProducts,
} from "../../api/services/product/anakyticsApi";
import { getProducts } from "../../api/services/product/productApi";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(Number(value || 0));

const formatDateTime = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const pickValue = (source, keys, fallback = 0) => {
  if (!source || typeof source !== "object") return fallback;
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key];
    }
  }
  return fallback;
};

const csvEscape = (value) => {
  const stringValue = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const buildCsv = (rows) => {
  if (!rows.length) return "";
  const columns = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row || {}).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );

  const header = columns.map(csvEscape).join(",");
  const body = rows.map((row) => columns.map((column) => csvEscape(row?.[column])).join(",")).join("\n");
  return `${header}\n${body}`;
};

const downloadFile = (filename, content, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const ReportTable = ({ columns, rows, emptyText = "No data available for this report yet." }) => (
  <TableContainer sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ backgroundColor: "#f8fafc" }}>
          {columns.map((column) => (
            <TableCell
              key={column.key}
              sx={{ fontWeight: 700, color: "#334155", whiteSpace: "nowrap" }}
            >
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
          rows.map((row, rowIndex) => (
            <TableRow key={`${rowIndex}-${row?.id || row?._id || row?.name || "row"}`} hover>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(row?.[column.key], row) : row?.[column.key] ?? "--"}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

const ReportCard = ({ report, onDownloadCsv, onDownloadJson }) => (
  <Card
    elevation={0}
    sx={{
      border: "1px solid #e2e8f0",
      borderRadius: 4,
      background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    }}
  >
    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                backgroundColor: report.iconBg,
                color: report.iconColor,
              }}
            >
              {report.icon}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                {report.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                {report.description}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label={`${formatNumber(report.rows.length)} rows`} size="small" />
            <Chip
              label={report.status}
              size="small"
              color={report.rows.length ? "success" : "default"}
              variant={report.rows.length ? "filled" : "outlined"}
            />
            <Chip label={`Updated ${formatDateTime(report.generatedAt)}`} size="small" variant="outlined" />
          </Stack>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button
            variant="outlined"
            startIcon={<DownloadRoundedIcon />}
            onClick={() => onDownloadCsv(report)}
            disabled={!report.rows.length}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadRoundedIcon />}
            onClick={() => onDownloadJson(report)}
            disabled={!report.rows.length}
            sx={{ textTransform: "none", fontWeight: 700, boxShadow: "none" }}
          >
            JSON
          </Button>
        </Stack>
      </Stack>
      <ReportTable columns={report.columns} rows={report.previewRows} />
    </CardContent>
  </Card>
);

export default function Reports() {
  const [reportRange, setReportRange] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [reportData, setReportData] = useState({
    products: [],
    topSellingProducts: [],
    summary: {},
    netProfit: {},
    paymentBreakdown: [],
    salesByDate: [],
    salesByHour: [],
    ordersByUser: [],
  });

  useEffect(() => {
    let ignore = false;

    const loadReports = async () => {
      setLoading(true);
      setError("");

      const requests = await Promise.allSettled([
        getProducts({
          page: 1,
          limit: 1000,
          search: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
        topSellingProducts(),
        summary(),
        netProfit(),
        paymentBreakdown(),
        salesByDate(reportRange),
        salesByHour(),
        ordersByUser(),
      ]);

      if (ignore) return;

      const [
        productsResponse,
        topProductsResponse,
        summaryResponse,
        netProfitResponse,
        paymentBreakdownResponse,
        salesByDateResponse,
        salesByHourResponse,
        ordersByUserResponse,
      ] = requests;

      const nextState = {
        products:
          productsResponse.status === "fulfilled"
            ? toArray(productsResponse.value?.data)
            : [],
        topSellingProducts:
          topProductsResponse.status === "fulfilled"
            ? toArray(topProductsResponse.value?.data)
            : [],
        summary:
          summaryResponse.status === "fulfilled"
            ? summaryResponse.value?.data || {}
            : {},
        netProfit:
          netProfitResponse.status === "fulfilled"
            ? netProfitResponse.value?.data || {}
            : {},
        paymentBreakdown:
          paymentBreakdownResponse.status === "fulfilled"
            ? toArray(paymentBreakdownResponse.value?.data)
            : [],
        salesByDate:
          salesByDateResponse.status === "fulfilled"
            ? toArray(salesByDateResponse.value?.data)
            : [],
        salesByHour:
          salesByHourResponse.status === "fulfilled"
            ? toArray(salesByHourResponse.value?.data)
            : [],
        ordersByUser:
          ordersByUserResponse.status === "fulfilled"
            ? toArray(ordersByUserResponse.value?.data)
            : [],
      };

      const failedReports = requests.filter((result) => result.status === "rejected").length;
      if (failedReports) {
        setError(
          `${failedReports} report source${failedReports > 1 ? "s" : ""} could not be loaded. Available data is still shown below.`
        );
      }

      setReportData(nextState);
      setLastUpdated(new Date().toISOString());
      setLoading(false);
    };

    loadReports();

    return () => {
      ignore = true;
    };
  }, [reportRange]);

  const normalizedProducts = useMemo(
    () =>
      reportData.products.map((product) => ({
        sku: product?.sku || "--",
        barcode: product?.barcode || "--",
        name: product?.name || "Unnamed product",
        category: product?.category || "--",
        stockQty: Number(product?.stockQty || 0),
        reorderLevel: Number(product?.reorderLevel || 0),
        mrp: Number(product?.mrp || 0),
        sellingPrice: Number(product?.sellingPrice || 0),
        inventoryValue: Number(product?.stockQty || 0) * Number(product?.sellingPrice || 0),
        createdAt: product?.createdAt ? new Date(product.createdAt).toLocaleDateString("en-IN") : "--",
      })),
    [reportData.products]
  );

  const lowStockProducts = useMemo(
    () => normalizedProducts.filter((product) => product.stockQty <= Math.max(product.reorderLevel || 0, 10)),
    [normalizedProducts]
  );

  const normalizedTopProducts = useMemo(
    () =>
      reportData.topSellingProducts.map((item, index) => ({
        rank: index + 1,
        name: item?.product?.name || item?.name || "Unnamed product",
        sku: item?.product?.sku || item?.sku || "--",
        quantitySold: Number(pickValue(item, ["quantity", "quantitySold", "qty"], 0)),
        stockQty: Number(item?.product?.stockQty || 0),
        reorderLevel: Number(item?.product?.reorderLevel || 0),
        revenue: Number(pickValue(item, ["revenue", "totalRevenue", "amount"], 0)),
      })),
    [reportData.topSellingProducts]
  );

  const normalizedPaymentBreakdown = useMemo(
    () =>
      reportData.paymentBreakdown.map((item) => ({
        method: item?.method || item?._id || item?.paymentMethod || "Unknown",
        total: Number(pickValue(item, ["total", "amount", "value"], 0)),
        orders: Number(pickValue(item, ["count", "orders", "transactions"], 0)),
      })),
    [reportData.paymentBreakdown]
  );

  const normalizedOrdersByUser = useMemo(
    () =>
      reportData.ordersByUser.map((item, index) => ({
        rank: index + 1,
        customer: item?.user?.name || item?.name || item?.email || item?._id || "Unknown user",
        email: item?.user?.email || item?.email || "--",
        totalOrders: Number(pickValue(item, ["totalOrders", "orders", "count"], 0)),
        totalSpent: Number(pickValue(item, ["totalSpent", "spent", "amount"], 0)),
      })),
    [reportData.ordersByUser]
  );

  const normalizedSalesByDate = useMemo(
    () =>
      reportData.salesByDate.map((item) => ({
        period: item?._id || item?.date || item?.label || "--",
        totalCollected: Number(pickValue(item, ["totalCollected", "total", "amount"], 0)),
        orders: Number(pickValue(item, ["orders", "count"], 0)),
      })),
    [reportData.salesByDate]
  );

  const normalizedSalesByHour = useMemo(
    () =>
      reportData.salesByHour.map((item) => ({
        hour: item?._id || item?.hour || item?.label || "--",
        totalCollected: Number(pickValue(item, ["totalCollected", "total", "amount"], 0)),
        orders: Number(pickValue(item, ["orders", "count"], 0)),
      })),
    [reportData.salesByHour]
  );

  const totals = useMemo(() => {
    const summaryData = reportData.summary || {};
    const netProfitData = reportData.netProfit || {};
    const inventoryValue = normalizedProducts.reduce((sum, product) => sum + product.inventoryValue, 0);
    const stockUnits = normalizedProducts.reduce((sum, product) => sum + product.stockQty, 0);
    const totalRevenue =
      Number(pickValue(summaryData, ["totalRevenue", "revenue", "sales"], 0)) ||
      Number(netProfitData?.revenue || 0) ||
      normalizedSalesByDate.reduce((sum, item) => sum + item.totalCollected, 0);
    const totalCost = Number(pickValue(netProfitData, ["cost", "totalCost"], 0));
    const grossProfit = totalRevenue - totalCost;
    const totalOrders =
      Number(pickValue(summaryData, ["totalOrders", "orders", "orderCount"], 0)) ||
      normalizedOrdersByUser.reduce((sum, item) => sum + item.totalOrders, 0);

    return {
      inventoryValue,
      stockUnits,
      totalRevenue,
      totalCost,
      grossProfit,
      totalOrders,
      lowStockCount: lowStockProducts.length,
      productCount: normalizedProducts.length,
      paymentMethods: normalizedPaymentBreakdown.length,
      customerCount: normalizedOrdersByUser.length,
      averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
    };
  }, [
    lowStockProducts.length,
    normalizedOrdersByUser,
    normalizedPaymentBreakdown.length,
    normalizedProducts,
    normalizedSalesByDate,
    reportData.netProfit,
    reportData.summary,
  ]);

  const reportDefinitions = useMemo(
    () => [
      {
        key: "inventory-master",
        title: "Inventory Master Report",
        description: "Complete product inventory with pricing, stock, barcode, and reorder information.",
        icon: <Inventory2RoundedIcon fontSize="small" />,
        iconBg: "#dbeafe",
        iconColor: "#1d4ed8",
        status: lowStockProducts.length ? `${formatNumber(lowStockProducts.length)} low stock items` : "Healthy stock status",
        generatedAt: lastUpdated,
        rows: normalizedProducts,
        previewRows: normalizedProducts.slice(0, 6),
        columns: [
          { key: "sku", label: "SKU" },
          { key: "name", label: "Product" },
          { key: "category", label: "Category" },
          { key: "stockQty", label: "Stock" },
          { key: "sellingPrice", label: "Price", render: (value) => formatCurrency(value) },
          { key: "inventoryValue", label: "Inventory Value", render: (value) => formatCurrency(value) },
        ],
      },
      {
        key: "top-selling-products",
        title: "Top Selling Products Report",
        description: "Best-performing products ranked by quantity sold and revenue contribution.",
        icon: <TrendingUpRoundedIcon fontSize="small" />,
        iconBg: "#dcfce7",
        iconColor: "#15803d",
        status: normalizedTopProducts.length ? "Ready for export" : "No sales data yet",
        generatedAt: lastUpdated,
        rows: normalizedTopProducts,
        previewRows: normalizedTopProducts.slice(0, 5),
        columns: [
          { key: "rank", label: "#" },
          { key: "name", label: "Product" },
          { key: "quantitySold", label: "Units Sold" },
          { key: "revenue", label: "Revenue", render: (value) => formatCurrency(value) },
          { key: "stockQty", label: "Stock Left" },
        ],
      },
      {
        key: "profit-summary",
        title: "Profit Summary Report",
        description: "Revenue, cost, and gross profit snapshot for admin finance review.",
        icon: <ReceiptLongRoundedIcon fontSize="small" />,
        iconBg: "#fef3c7",
        iconColor: "#b45309",
        status: totals.grossProfit >= 0 ? "Positive margin tracked" : "Margin needs review",
        generatedAt: lastUpdated,
        rows: [
          {
            metric: "Total Revenue",
            value: totals.totalRevenue,
          },
          {
            metric: "Total Cost",
            value: totals.totalCost,
          },
          {
            metric: "Gross Profit",
            value: totals.grossProfit,
          },
          {
            metric: "Average Order Value",
            value: totals.averageOrderValue,
          },
        ],
        previewRows: [
          {
            metric: "Total Revenue",
            value: totals.totalRevenue,
          },
          {
            metric: "Total Cost",
            value: totals.totalCost,
          },
          {
            metric: "Gross Profit",
            value: totals.grossProfit,
          },
          {
            metric: "Average Order Value",
            value: totals.averageOrderValue,
          },
        ],
        columns: [
          { key: "metric", label: "Metric" },
          { key: "value", label: "Amount", render: (value) => formatCurrency(value) },
        ],
      },
      {
        key: "payment-breakdown",
        title: "Payment Breakdown Report",
        description: "Payment-mode performance across transactions and collections.",
        icon: <PaymentsRoundedIcon fontSize="small" />,
        iconBg: "#ede9fe",
        iconColor: "#6d28d9",
        status: normalizedPaymentBreakdown.length ? "Payment channels mapped" : "No payment data yet",
        generatedAt: lastUpdated,
        rows: normalizedPaymentBreakdown,
        previewRows: normalizedPaymentBreakdown.slice(0, 6),
        columns: [
          { key: "method", label: "Payment Method" },
          { key: "orders", label: "Transactions" },
          { key: "total", label: "Collected", render: (value) => formatCurrency(value) },
        ],
      },
      {
        key: "sales-timeline",
        title: "Sales Timeline Report",
        description: reportRange === "daily" ? "Recent daily sales totals." : "Recent monthly sales totals.",
        icon: <InsightsRoundedIcon fontSize="small" />,
        iconBg: "#cffafe",
        iconColor: "#0f766e",
        status: normalizedSalesByDate.length ? `${reportRange === "daily" ? "Daily" : "Monthly"} trend loaded` : "No timeline data yet",
        generatedAt: lastUpdated,
        rows: normalizedSalesByDate,
        previewRows: normalizedSalesByDate.slice(0, 7),
        columns: [
          { key: "period", label: reportRange === "daily" ? "Date" : "Month" },
          { key: "orders", label: "Orders" },
          { key: "totalCollected", label: "Sales", render: (value) => formatCurrency(value) },
        ],
      },
      {
        key: "sales-by-hour",
        title: "Sales by Hour Report",
        description: "Operational view of peak billing periods across the day.",
        icon: <InsightsRoundedIcon fontSize="small" />,
        iconBg: "#e0e7ff",
        iconColor: "#3730a3",
        status: normalizedSalesByHour.length ? "Peak hours available" : "No hourly sales data yet",
        generatedAt: lastUpdated,
        rows: normalizedSalesByHour,
        previewRows: normalizedSalesByHour.slice(0, 6),
        columns: [
          { key: "hour", label: "Hour" },
          { key: "orders", label: "Orders" },
          { key: "totalCollected", label: "Sales", render: (value) => formatCurrency(value) },
        ],
      },
      {
        key: "customer-orders",
        title: "Customer Orders Report",
        description: "Customer-wise order frequency and spend contribution.",
        icon: <PeopleAltRoundedIcon fontSize="small" />,
        iconBg: "#fee2e2",
        iconColor: "#b91c1c",
        status: normalizedOrdersByUser.length ? "Customer contribution ready" : "No customer report data yet",
        generatedAt: lastUpdated,
        rows: normalizedOrdersByUser,
        previewRows: normalizedOrdersByUser.slice(0, 6),
        columns: [
          { key: "rank", label: "#" },
          { key: "customer", label: "Customer" },
          { key: "email", label: "Email" },
          { key: "totalOrders", label: "Orders" },
          { key: "totalSpent", label: "Total Spent", render: (value) => formatCurrency(value) },
        ],
      },
      {
        key: "low-stock-alerts",
        title: "Low Stock Alert Report",
        description: "Fast action list for products near or below their reorder threshold.",
        icon: <WarningAmberRoundedIcon fontSize="small" />,
        iconBg: "#ffedd5",
        iconColor: "#c2410c",
        status: lowStockProducts.length ? "Action required" : "No active stock alerts",
        generatedAt: lastUpdated,
        rows: lowStockProducts,
        previewRows: lowStockProducts.slice(0, 6),
        columns: [
          { key: "sku", label: "SKU" },
          { key: "name", label: "Product" },
          { key: "stockQty", label: "Current Stock" },
          { key: "reorderLevel", label: "Reorder Level" },
          { key: "sellingPrice", label: "Price", render: (value) => formatCurrency(value) },
        ],
      },
    ],
    [
      lastUpdated,
      lowStockProducts,
      normalizedOrdersByUser,
      normalizedPaymentBreakdown,
      normalizedProducts,
      normalizedSalesByDate,
      normalizedSalesByHour,
      normalizedTopProducts,
      reportRange,
      totals,
    ]
  );

  const handleDownloadCsv = (report) => {
    const csvContent = buildCsv(report.rows);
    if (!csvContent) return;
    downloadFile(`${report.key}.csv`, csvContent, "text/csv;charset=utf-8;");
  };

  const handleDownloadJson = (report) => {
    downloadFile(`${report.key}.json`, JSON.stringify(report.rows, null, 2), "application/json;charset=utf-8;");
  };

  const handleExportAll = () => {
    const bundle = {
      exportedAt: new Date().toISOString(),
      range: reportRange,
      totals,
      reports: reportDefinitions.reduce((accumulator, report) => {
        accumulator[report.key] = report.rows;
        return accumulator;
      }, {}),
    };

    downloadFile("all-reports.json", JSON.stringify(bundle, null, 2), "application/json;charset=utf-8;");
  };

  const summaryCards = [
    {
      label: "Total Reports",
      value: formatNumber(reportDefinitions.length),
      helper: "Live export-ready reports",
      accent: "#0f766e",
      bg: "#ecfeff",
    },
    {
      label: "Products Tracked",
      value: formatNumber(totals.productCount),
      helper: `${formatNumber(totals.stockUnits)} units in stock`,
      accent: "#1d4ed8",
      bg: "#eff6ff",
    },
    {
      label: "Inventory Value",
      value: formatCurrency(totals.inventoryValue),
      helper: "Based on current selling price",
      accent: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totals.totalRevenue),
      helper: `${formatNumber(totals.totalOrders)} orders recorded`,
      accent: "#15803d",
      bg: "#f0fdf4",
    },
    {
      label: "Gross Profit",
      value: formatCurrency(totals.grossProfit),
      helper: `${formatCurrency(totals.averageOrderValue)} avg order value`,
      accent: totals.grossProfit >= 0 ? "#b45309" : "#b91c1c",
      bg: totals.grossProfit >= 0 ? "#fffbeb" : "#fef2f2",
    },
    {
      label: "Low Stock Alerts",
      value: formatNumber(totals.lowStockCount),
      helper: `${formatNumber(totals.paymentMethods)} payment methods, ${formatNumber(totals.customerCount)} customers`,
      accent: totals.lowStockCount ? "#c2410c" : "#475569",
      bg: totals.lowStockCount ? "#fff7ed" : "#f8fafc",
    },
  ];

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          border: "1px solid #dbeafe",
          background:
            "radial-gradient(circle at top left, rgba(14,165,233,0.16), transparent 28%), linear-gradient(135deg, #0f172a 0%, #1e3a8a 52%, #0f766e 100%)",
          color: "#ffffff",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            spacing={3}
            alignItems={{ xs: "flex-start", lg: "center" }}
          >
            <Box sx={{ maxWidth: 760 }}>
              <Chip
                label="Admin Reporting Center"
                size="small"
                sx={{
                  mb: 2,
                  backgroundColor: "rgba(255,255,255,0.12)",
                  color: "#e0f2fe",
                  fontWeight: 700,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, mb: 1.5 }}>
                Reports dashboard for review, audit, and download
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.84)", maxWidth: 680 }}>
                See every report already available in the system, preview the underlying data, and export it for finance, stock planning, operations, or management review.
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2.5 }}>
                <Chip label={`Updated ${formatDateTime(lastUpdated)}`} sx={{ backgroundColor: "#ffffff", color: "#0f172a" }} />
                <Chip label={`${formatNumber(reportDefinitions.length)} reports available`} sx={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#ffffff" }} />
                <Chip label={`${formatNumber(totals.lowStockCount)} stock alerts`} sx={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#ffffff" }} />
              </Stack>
            </Box>

            <Stack spacing={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
              <TextField
                select
                size="small"
                value={reportRange}
                onChange={(event) => setReportRange(event.target.value)}
                sx={{
                  minWidth: 200,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffff",
                    borderRadius: 3,
                  },
                }}
              >
                <MenuItem value="daily">Weekly sales view</MenuItem>
                <MenuItem value="monthly">Monthly sales view</MenuItem>
              </TextField>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Button
                  variant="contained"
                  startIcon={<DownloadRoundedIcon />}
                  onClick={handleExportAll}
                  sx={{
                    textTransform: "none",
                    fontWeight: 800,
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    boxShadow: "none",
                    "&:hover": { backgroundColor: "#e2e8f0", boxShadow: "none" },
                  }}
                >
                  Export All
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PrintRoundedIcon />}
                  onClick={() => window.print()}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    color: "#ffffff",
                    borderColor: "rgba(255,255,255,0.4)",
                    "&:hover": { borderColor: "#ffffff", backgroundColor: "rgba(255,255,255,0.08)" },
                  }}
                >
                  Print
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 999 }} />}
      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" },
          gap: 2,
          mb: 3,
        }}
      >
        {summaryCards.map((card) => (
          <Card
            key={card.label}
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 4,
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "999px",
                  backgroundColor: card.accent,
                  boxShadow: `0 0 0 8px ${card.bg}`,
                  mb: 2,
                }}
              />
              <Typography variant="body2" sx={{ color: "#64748b", mb: 0.75 }}>
                {card.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", mb: 0.75 }}>
                {card.value}
              </Typography>
              <Typography variant="body2" sx={{ color: "#475569" }}>
                {card.helper}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 4, mb: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                Report availability
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Quick snapshot of what the admin can download from this page.
              </Typography>
            </Box>
            {loading && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} />
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Refreshing data
                </Typography>
              </Stack>
            )}
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
              gap: 1.5,
            }}
          >
            {reportDefinitions.map((report) => (
              <Box
                key={report.key}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                }}
              >
                <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      {report.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      {formatNumber(report.rows.length)} rows
                    </Typography>
                  </Box>
                  <Chip
                    label={report.status}
                    size="small"
                    color={report.rows.length ? "success" : "default"}
                    variant={report.rows.length ? "filled" : "outlined"}
                  />
                </Stack>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        {reportDefinitions.map((report, index) => (
          <React.Fragment key={report.key}>
            <ReportCard report={report} onDownloadCsv={handleDownloadCsv} onDownloadJson={handleDownloadJson} />
            {index !== reportDefinitions.length - 1 && <Divider flexItem sx={{ borderColor: "#e2e8f0" }} />}
          </React.Fragment>
        ))}
      </Stack>
    </Box>
  );
}
