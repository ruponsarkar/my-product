import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { meAPI } from "../../api/services/auth/login";
import { getStoredUser } from "../../utils/auth";

export default function Profile() {
  const storedUser = getStoredUser();
  const [profile, setProfile] = useState(storedUser || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await meAPI();
      if (response?.data) {
        setProfile(response.data);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load profile. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="w-full px-4 py-6">
      <Box className="mb-6">
        <Typography variant="overline" color="primary" gutterBottom>
          Profile
        </Typography>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My account
        </Typography>
        <Typography color="text.secondary">
          View your account details and current tenant role.
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        {loading ? (
          <Box className="flex items-center justify-center py-12">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box className="py-8 text-center">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                value={profile.name || ""}
                fullWidth
                disabled
                margin="normal"
              />
              <TextField
                label="Email"
                value={profile.email || ""}
                fullWidth
                disabled
                margin="normal"
              />
              <TextField
                label="Role"
                value={profile.role || ""}
                fullWidth
                disabled
                margin="normal"
              />
              <TextField
                label="Status"
                value={profile.isActive ? "Active" : "Inactive"}
                fullWidth
                disabled
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Created"
                value={profile.createdAt ? new Date(profile.createdAt).toLocaleString() : ""}
                fullWidth
                disabled
                margin="normal"
              />
              <TextField
                label="Updated"
                value={profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : ""}
                fullWidth
                disabled
                margin="normal"
              />
              <TextField
                label="Permissions"
                value={Array.isArray(profile.permissions) ? profile.permissions.join(", ") : ""}
                fullWidth
                disabled
                margin="normal"
                multiline
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={fetchProfile} disabled={loading}>
                Refresh profile
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
