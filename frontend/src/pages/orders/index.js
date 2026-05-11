import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { getStoredUser } from "../../utils/auth";
import { getOrderById, getOrders } from "../../api/services/order/orderApi";
import { listUsers } from "../../api/services/users/userApi";
import Modal from "../../components/modal/modal";

const paymentOptions = [
  { value: "all", label: "All" },
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "credit", label: "Credit" },
];

const DATA_FETCH_LIMIT = 15;

export default function Orders() {
  const currentUser = getStoredUser();
  const isAdmin = currentUser?.role === "admin";

  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DATA_FETCH_LIMIT);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    paymentType: "all",
    user: "",
  });

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const getOrderSourceClassName = (source) => {
    const normalizedSource = String(source || "POS").toUpperCase();

    if (normalizedSource === "WEB") {
      return "bg-sky-100 text-sky-700";
    }

    if (normalizedSource === "APP") {
      return "bg-violet-100 text-violet-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const fetchOrders = async (requestedPage = page, requestedRowsPerPage = rowsPerPage) => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: requestedPage + 1,
        limit: requestedRowsPerPage,
      };
      if (filters.fromDate) params.startDate = filters.fromDate;
      if (filters.toDate) params.endDate = filters.toDate;
      if (filters.paymentType && filters.paymentType !== "all") params.paymentType = filters.paymentType;
      if (isAdmin && filters.user) params.user = filters.user;

      const response = await getOrders(params);
      setOrders(response.data.data || []);
      setTotalOrders(response.data.total || 0);
      setPage(response.data.page ? response.data.page - 1 : requestedPage);
      setRowsPerPage(response.data.limit || requestedRowsPerPage);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!isAdmin) return;
    try {
      const response = await listUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders(page, rowsPerPage);
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleApplyFilters = () => {
    setPage((prevPage) => {
      if (prevPage !== 0) {
        return 0;
      }
      fetchOrders(0, rowsPerPage);
      return prevPage;
    });
  };

  const handleResetFilters = () => {
    setFilters({ fromDate: "", toDate: "", paymentType: "all", user: "" });
    setError("");
    setOrders([]);
    setRowsPerPage(DATA_FETCH_LIMIT);
    setPage((prevPage) => {
      if (prevPage !== 0) {
        return 0;
      }
      fetchOrders(0, DATA_FETCH_LIMIT);
      return prevPage;
    });
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
    setDetailsError("");
  };

  const handleViewDetails = async (orderId) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    setDetailsError("");

    try {
      const response = await getOrderById(orderId);
      setSelectedOrder(response.data || null);
    } catch (err) {
      console.error(err);
      setSelectedOrder(null);
      setDetailsError(err.response?.data?.message || "Unable to load order details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const detailContent = detailsLoading ? (
    <Box className="flex items-center justify-center py-12">
      <CircularProgress />
    </Box>
  ) : detailsError ? (
    <Box className="py-6">
      <Typography color="error">{detailsError}</Typography>
    </Box>
  ) : !selectedOrder ? (
    <Box className="py-6">
      <Typography color="text.secondary">No order selected.</Typography>
    </Box>
  ) : (
    <Box className="space-y-5 py-1">
      <Box className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <Box>
          <Typography variant="overline" color="primary">
            Order details
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {selectedOrder.order_id}
          </Typography>
          <Typography color="text.secondary">
            {new Date(selectedOrder.createdAt).toLocaleString()}
          </Typography>
        </Box>
        <Box className="flex flex-wrap gap-2">
          <Chip label={String(selectedOrder.status || "Unknown").toUpperCase()} color="primary" variant="outlined" />
          <Chip label={String(selectedOrder.payment_type || "Unknown").toUpperCase()} variant="outlined" />
        </Box>
      </Box>

      <Divider />

      <Box className="grid gap-4 md:grid-cols-2">
        <Box className="rounded-lg border border-slate-200 p-4">
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Customer
          </Typography>
          <Typography>{selectedOrder.client?.name || selectedOrder.user?.name || "Unknown"}</Typography>
          <Typography color="text.secondary">{selectedOrder.client?.mobile || selectedOrder.customer_phone || "No phone"}</Typography>
          <Typography color="text.secondary">{selectedOrder.client?.email || selectedOrder.user?.email || "No email"}</Typography>
        </Box>

        <Box className="rounded-lg border border-slate-200 p-4">
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Delivery
          </Typography>
          <Typography>{selectedOrder.delivery_address?.addressLine1 || selectedOrder.client?.addressLine1 || "No address line 1"}</Typography>
          <Typography color="text.secondary">{selectedOrder.delivery_address?.addressLine2 || selectedOrder.client?.addressLine2 || "No address line 2"}</Typography>
          <Typography color="text.secondary">{selectedOrder.delivery_address?.city || selectedOrder.client?.city || "No city"}</Typography>
        </Box>
      </Box>

      <Box className="rounded-lg border border-slate-200 p-4">
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Items
        </Typography>
        <Box className="space-y-3">
          {(selectedOrder.items || []).map((item, index) => (
            <Box
              key={`${selectedOrder._id}-${index}`}
              className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <Box>
                <Typography fontWeight={600}>{item.product?.name || "Product"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Qty {item.quantity || 0}
                  {item.product?.sku ? ` • SKU ${item.product.sku}` : ""}
                </Typography>
              </Box>
              <Typography fontWeight={600}>{formatCurrency((item.price || 0) * (item.quantity || 0))}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box className="grid gap-3 md:grid-cols-4">
        <Box className="rounded-lg border border-slate-200 p-4">
          <Typography variant="caption" color="text.secondary">Subtotal</Typography>
          <Typography fontWeight={700}>{formatCurrency(selectedOrder.subtotal)}</Typography>
        </Box>
        <Box className="rounded-lg border border-slate-200 p-4">
          <Typography variant="caption" color="text.secondary">Discount</Typography>
          <Typography fontWeight={700}>{formatCurrency(selectedOrder.discount)}</Typography>
        </Box>
        <Box className="rounded-lg border border-slate-200 p-4">
          <Typography variant="caption" color="text.secondary">Paid</Typography>
          <Typography fontWeight={700}>{formatCurrency(selectedOrder.paidAmount)}</Typography>
        </Box>
        <Box className="rounded-lg border border-slate-200 p-4">
          <Typography variant="caption" color="text.secondary">Total</Typography>
          <Typography fontWeight={700}>{formatCurrency(selectedOrder.total)}</Typography>
        </Box>
      </Box>

      {selectedOrder.customer_note ? (
        <Box className="rounded-lg border border-slate-200 p-4">
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Customer note
          </Typography>
          <Typography color="text.secondary">{selectedOrder.customer_note}</Typography>
        </Box>
      ) : null}
    </Box>
  );

  return (
    <Box className="w-full max-w-full space-y-4 px-4 py-4 sm:px-5">
      <Box className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <Box>
          <Typography variant="overline" color="primary" className="!mb-1 !leading-none">
            Order management
          </Typography>
          <Typography variant="h5" fontWeight={700} className="!mb-1">
            All orders
          </Typography>
          <Typography color="text.secondary" className="max-w-2xl !text-sm">
            View tenant orders with quick filters for date, payment type, and user.
          </Typography>
        </Box>
      </Box>

      <Paper className="overflow-hidden rounded-xl border border-slate-200 px-3 py-3 shadow-none sm:px-4">
        <Box className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <TextField
            label="From date"
            type="date"
            value={filters.fromDate}
            onChange={handleFilterChange("fromDate")}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <TextField
            label="To date"
            type="date"
            value={filters.toDate}
            onChange={handleFilterChange("toDate")}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <TextField
            label="Payment type"
            select
            value={filters.paymentType}
            onChange={handleFilterChange("paymentType")}
            fullWidth
            size="small"
          >
            {paymentOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {isAdmin ? (
            <TextField
              label="User"
              select
              value={filters.user}
              onChange={handleFilterChange("user")}
              fullWidth
              size="small"
            >
              <MenuItem value="">All users</MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name || user.email}
                </MenuItem>
              ))}
            </TextField>
          ) : null}
        </Box>

        <Box className="mt-3 flex flex-wrap items-center gap-2">
          <Button variant="contained" size="small" onClick={handleApplyFilters} disabled={loading}>
            Apply filters
          </Button>
          <Button variant="outlined" size="small" onClick={handleResetFilters} disabled={loading}>
            Reset filters
          </Button>
        </Box>
      </Paper>

      <Paper className="overflow-hidden rounded-xl border border-slate-200 shadow-none">
        {loading ? (
          <Box className="flex items-center justify-center py-16">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box className="py-8 text-center">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <TableContainer className="overflow-x-auto">
              <Table size="small">
                <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Credit</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Placed</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>{order.order_id}</TableCell>
                        <TableCell>
                          {order.client?.name ||
                            order.user?.name ||
                            order.user?.email ||
                            order.customer_name ||
                            "Unknown"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getOrderSourceClassName(order.order_from)}`}
                          >
                            {String(order.order_from || "POS").toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>{order.payment_type}</TableCell>
                        <TableCell>{order.total?.toLocaleString?.() ?? order.total ?? 0}</TableCell>
                        <TableCell>{order.credit?.toLocaleString?.() ?? order.credit ?? 0}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleViewDetails(order._id)}
                          >
                            View details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalOrders}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                const newRowsPerPage = parseInt(event.target.value, DATA_FETCH_LIMIT);
                setRowsPerPage(newRowsPerPage);
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20, 50]}
              labelRowsPerPage="Rows per page"
              className="border-t border-slate-200"
            />
          </>
        )}
      </Paper>

      <Modal
        open={detailsOpen}
        handleClose={handleCloseDetails}
        title={selectedOrder ? `Order ${selectedOrder.order_id}` : "Order details"}
        content={detailContent}
        maxWidth="md"
      />
    </Box>
  );
}
