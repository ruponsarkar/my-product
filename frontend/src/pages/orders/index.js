import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { getStoredUser } from "../../utils/auth";
import { getOrders } from "../../api/services/order/orderApi";
import { listUsers } from "../../api/services/users/userApi";

const paymentOptions = [
  { value: "all", label: "All" },
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "credit", label: "Credit" },
];

export default function Orders() {
  const currentUser = getStoredUser();
  const isAdmin = currentUser?.role === "admin";

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    paymentType: "all",
    user: "",
  });

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (filters.fromDate) params.startDate = filters.fromDate;
      if (filters.toDate) params.endDate = filters.toDate;
      if (filters.paymentType && filters.paymentType !== "all") params.paymentType = filters.paymentType;
      if (isAdmin && filters.user) params.user = filters.user;

      const response = await getOrders(params);
      setOrders(response.data || []);
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
    fetchOrders();
  }, []);

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
    fetchOrders();
  };

  const handleResetFilters = () => {
    setFilters({ fromDate: "", toDate: "", paymentType: "all", user: "" });
    setError("");
    setOrders([]);
    setTimeout(fetchOrders, 0);
  };

  return (
    <Box className="w-full max-w-full space-y-5 px-4 py-6">
      <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Box>
          <Typography variant="overline" color="primary" gutterBottom>
            Order management
          </Typography>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            All orders
          </Typography>
          <Typography color="text.secondary">
            View orders across the tenant. Admins can filter by user and payment type.
          </Typography>
        </Box>
      </Box>

      <Paper className="overflow-hidden px-4 py-4">
        <Box className="grid gap-4 md:grid-cols-4">
          <TextField
            label="From date"
            type="date"
            value={filters.fromDate}
            onChange={handleFilterChange("fromDate")}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="To date"
            type="date"
            value={filters.toDate}
            onChange={handleFilterChange("toDate")}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Payment type"
            select
            value={filters.paymentType}
            onChange={handleFilterChange("paymentType")}
            fullWidth
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

        <Box className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="contained" onClick={handleApplyFilters} disabled={loading}>
            Apply filters
          </Button>
          <Button variant="outlined" onClick={handleResetFilters} disabled={loading}>
            Reset filters
          </Button>
        </Box>
      </Paper>

      <Paper className="overflow-x-auto px-3 py-4">
        {loading ? (
          <Box className="flex items-center justify-center py-16">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box className="py-8 text-center">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Credit</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Placed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id} hover>
                      <TableCell>{order.order_id}</TableCell>
                      <TableCell>{order.user?.name || order.user?.email || "Unknown"}</TableCell>
                      <TableCell>{order.payment_type}</TableCell>
                      <TableCell>{order.total?.toLocaleString?.() ?? order.total ?? 0}</TableCell>
                      <TableCell>{order.credit?.toLocaleString?.() ?? order.credit ?? 0}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
