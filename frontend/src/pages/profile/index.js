import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { meAPI } from "../../api/services/auth/login";
import { getStoredUser } from "../../utils/auth";

function InfoCard({ eyebrow, title, subtitle, children }) {
  return (
    <Box className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {(eyebrow || title || subtitle) ? (
        <Box className="mb-4">
          {eyebrow ? (
            <Typography className="!mb-1 !text-[11px] !font-semibold !uppercase !tracking-[0.24em] !text-sky-700">
              {eyebrow}
            </Typography>
          ) : null}
          {title ? (
            <Typography variant="h6" className="!mb-1 !font-semibold !text-slate-950">
              {title}
            </Typography>
          ) : null}
          {subtitle ? (
            <Typography color="text.secondary" className="!text-sm">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      ) : null}
      {children}
    </Box>
  );
}

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

  const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString() : "Not available";

  const permissionsText = Array.isArray(profile.permissions) && profile.permissions.length > 0
    ? profile.permissions.join(", ")
    : "No explicit permissions";

  const roleLabel = String(profile.role || "User");
  const statusLabel = profile.isActive ? "Active" : "Inactive";

  return (
    <Box className="w-full px-4 py-4 sm:px-5 sm:py-5">
      <Box className="mb-4 rounded-3xl border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_38%),linear-gradient(135deg,#ffffff,rgba(248,250,252,0.96))] p-5 shadow-sm sm:p-6">
        <Typography variant="overline" color="primary" className="!mb-1 !leading-none">
          Profile
        </Typography>
        <Typography variant="h4" fontWeight={700} className="!mb-2 text-slate-950">
          My account
        </Typography>
        <Typography color="text.secondary" className="max-w-3xl !text-sm sm:!text-base">
          Review your account identity, access level, and activity details in one place.
        </Typography>
      </Box>

      <Paper className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <Box className="flex items-center justify-center py-12">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box className="p-4 sm:p-5">
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          </Box>
        ) : (
          <Box className="p-4 sm:p-5">
            <Box className="mb-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
              <Box className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <Box className="flex min-w-0 items-center gap-4">
                  <Box className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
                    {String(profile.name || profile.email || "U").trim().charAt(0).toUpperCase()}
                  </Box>
                  <Box className="min-w-0">
                    <Typography variant="h5" className="!mb-1 !font-semibold !text-slate-950">
                      {profile.name || "Unnamed user"}
                    </Typography>
                    <Typography color="text.secondary" className="truncate !text-sm sm:!text-base">
                      {profile.email || "No email address"}
                    </Typography>
                    <Box className="mt-3 flex flex-wrap gap-2">
                      <Chip
                        label={roleLabel}
                        size="small"
                        sx={{
                          borderRadius: 999,
                          backgroundColor: "#e2e8f0",
                          color: "#0f172a",
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label={statusLabel}
                        size="small"
                        sx={{
                          borderRadius: 999,
                          backgroundColor: profile.isActive ? "#dcfce7" : "#fee2e2",
                          color: profile.isActive ? "#166534" : "#b91c1c",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Button variant="contained" size="small" onClick={fetchProfile} disabled={loading}>
                  Refresh profile
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2.5} className="mb-5">
              <Grid item xs={12} sm={6} lg={3}>
                <Box className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Typography className="!text-xs !font-semibold !uppercase !tracking-[0.2em] !text-slate-500">
                    Account role
                  </Typography>
                  <Typography variant="h6" className="!mt-2 !font-semibold !text-slate-950">
                    {roleLabel}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Box className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Typography className="!text-xs !font-semibold !uppercase !tracking-[0.2em] !text-slate-500">
                    Account status
                  </Typography>
                  <Typography variant="h6" className="!mt-2 !font-semibold !text-slate-950">
                    {statusLabel}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Box className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Typography className="!text-xs !font-semibold !uppercase !tracking-[0.2em] !text-slate-500">
                    Created
                  </Typography>
                  <Typography className="!mt-2 !font-medium !text-slate-900">
                    {formatDateTime(profile.createdAt)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Box className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Typography className="!text-xs !font-semibold !uppercase !tracking-[0.2em] !text-slate-500">
                    Last updated
                  </Typography>
                  <Typography className="!mt-2 !font-medium !text-slate-900">
                    {formatDateTime(profile.updatedAt)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid item xs={12} lg={6}>
                <InfoCard
                  eyebrow="Identity"
                  title="Basic information"
                  subtitle="Core account details associated with your current session."
                >
                  <Box className="space-y-3">
                    <TextField
                      label="Name"
                      value={profile.name || ""}
                      fullWidth
                      disabled
                      size="small"
                    />
                    <TextField
                      label="Email"
                      value={profile.email || ""}
                      fullWidth
                      disabled
                      size="small"
                    />
                    <TextField
                      label="Role"
                      value={roleLabel}
                      fullWidth
                      disabled
                      size="small"
                    />
                    <TextField
                      label="Status"
                      value={statusLabel}
                      fullWidth
                      disabled
                      size="small"
                    />
                  </Box>
                </InfoCard>
              </Grid>

              <Grid item xs={12} lg={6}>
                <InfoCard
                  eyebrow="Access"
                  title="Permissions and activity"
                  subtitle="A quick view of your access scope and recent account metadata."
                >
                  <Box className="space-y-3">
                    <TextField
                      label="Created"
                      value={formatDateTime(profile.createdAt)}
                      fullWidth
                      disabled
                      size="small"
                    />
                    <TextField
                      label="Updated"
                      value={formatDateTime(profile.updatedAt)}
                      fullWidth
                      disabled
                      size="small"
                    />
                    <TextField
                      label="Permissions"
                      value={permissionsText}
                      fullWidth
                      disabled
                      size="small"
                      multiline
                      minRows={4}
                    />
                  </Box>
                </InfoCard>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
