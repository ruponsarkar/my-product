import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Modal from "../../components/modal/modal";
import { listUsers, createUser, updateUser } from "../../api/services/users/userApi";

const defaultRoles = ["admin", "operator"];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [roleOptions, setRoleOptions] = useState(defaultRoles);
  const [customRole, setCustomRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator",
    permissions: "",
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await listUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "operator",
      permissions: "",
      isActive: true,
    });
    setError("");
    setOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "operator",
      permissions: Array.isArray(user.permissions) ? user.permissions.join(", ") : user.permissions || "",
      isActive: typeof user.isActive === "boolean" ? user.isActive : true,
    });
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRoleAdd = () => {
    const trimmedRole = customRole.trim();
    if (!trimmedRole) return;
    if (!roleOptions.includes(trimmedRole)) {
      setRoleOptions((prev) => [...prev, trimmedRole]);
    }
    setForm((prev) => ({ ...prev, role: trimmedRole }));
    setCustomRole("");
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);

    if (!form.name || !form.email || (!selectedUser && !form.password)) {
      setError("Name, email and password are required for new users.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role || "operator",
        permissions: form.permissions
          .split(",")
          .map((permission) => permission.trim())
          .filter(Boolean),
        isActive: form.isActive,
      };

      if (!selectedUser) {
        payload.password = form.password;
        await createUser(payload);
      } else {
        await updateUser(selectedUser._id, payload);
      }

      await fetchUsers();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save user. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="w-full max-w-full space-y-5 px-4 py-6">
      <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Box>
          <Typography variant="overline" color="primary" gutterBottom>
            Tenant user management
          </Typography>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Users
          </Typography>
          <Typography color="text.secondary">
            Create and manage tenant users with roles, permissions and active status.
          </Typography>
        </Box>
        <Button variant="contained" onClick={openCreateModal}>
          Add User
        </Button>
      </Box>

      <Paper className="overflow-x-auto px-3 py-4">
        {loading ? (
          <Box className="flex items-center justify-center py-16">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-rose-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-rose-700">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="contained" onClick={() => openEditModal(user)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Modal
        open={open}
        handleClose={handleClose}
        title={selectedUser ? "Edit tenant user" : "Add tenant user"}
      
        content={
          <Box className="space-y-4 py-2">
            <Box className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                fullWidth
              />
            </Box>

            {!selectedUser && (
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                fullWidth
              />
            )}

            <Box className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Role"
                select
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                fullWidth
              >
                {roleOptions.map((roleOption) => (
                  <MenuItem key={roleOption} value={roleOption}>
                    {roleOption}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Permissions"
                placeholder="comma separated values"
                value={form.permissions}
                onChange={(e) => setForm((prev) => ({ ...prev, permissions: e.target.value }))}
                fullWidth
              />
            </Box>

            <Box className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Add custom role"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                fullWidth
              />
              <Button variant="outlined" onClick={handleRoleAdd} className="mt-2 h-12">
                Add Role
              </Button>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  color="primary"
                />
              }
              label={form.isActive ? "Active" : "Inactive"}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Box className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : selectedUser ? "Update user" : "Create user"}
              </Button>
            </Box>
          </Box>
        }
      />
    </Box>
  );
}
