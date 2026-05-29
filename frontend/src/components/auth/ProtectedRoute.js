import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import api from "../../api/axios";
import {
  AUTH_TOKEN_KEY,
  clearAuthData,
  getAuthToken,
  hasFeatureAccess,
  persistAuthData,
  getStoredUser,
} from "../../utils/auth";

const adminPaths = ["/settings", "/reports", "/users"];
const routeFeatureChecks = [
  { matcher: (path) => path === "/", feature: "dashboard.view" },
  { matcher: (path) => path === "/viewproducts" || path.startsWith("/product/"), feature: "products.view" },
  { matcher: (path) => path === "/addproduct" || path.startsWith("/updateproduct/") || path.startsWith("/sell/"), feature: "products.manage" },
  { matcher: (path) => path === "/analytics", feature: "analytics.view" },
  { matcher: (path) => path === "/orders" || path.startsWith("/order/"), feature: "orders.manage" },
  { matcher: (path) => path === "/users", feature: "users.manage" },
  { matcher: (path) => path === "/settings" || path === "/reports", feature: "settings.manage" },
  { matcher: (path) => path === "/billing" || path.startsWith("/billing/"), feature: "billing.manage" },
  { matcher: (path) => path === "/profile", feature: "profile.view" },
];

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = React.useState("checking");
  const searchParams = React.useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const queryToken = searchParams.get("token");
  const token = queryToken || getAuthToken();
  const sanitizedSearch = React.useMemo(() => {
    const nextParams = new URLSearchParams(location.search);
    nextParams.delete("token");
    const nextSearch = nextParams.toString();
    return nextSearch ? `?${nextSearch}` : "";
  }, [location.search]);

  React.useEffect(() => {
    if (queryToken && queryToken !== getAuthToken()) {
      localStorage.setItem(AUTH_TOKEN_KEY, queryToken);
    }
  }, [queryToken]);

  React.useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      if (!token) {
        if (isMounted) {
          setStatus("unauthenticated");
        }
        return;
      }

      try {
        const response = await api.get("/users/me");
        if (response?.data) {
          persistAuthData({
            token,
            user: {
              _id: response.data._id,
              name: response.data.name,
              email: response.data.email,
              role: response.data.role,
              isActive: response.data.isActive,
              permissions: response.data.permissions,
            },
            tenant: response.data.tenant,
            access: response.data.access,
          });
        }
        if (isMounted) {
          setStatus("authenticated");
        }
      } catch (_error) {
        clearAuthData();
        if (isMounted) {
          setStatus("unauthenticated");
        }
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          Checking session...
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (status === "authenticated" && queryToken) {
    return (
      <Navigate
        to={`${location.pathname}${sanitizedSearch}`}
        replace
        state={location.state}
      />
    );
  }

  const currentUser = getStoredUser();
  const normalizedPath = location.pathname.toLowerCase();
  if (status === "authenticated" && currentUser?.role !== "admin") {
    if (adminPaths.some((path) => normalizedPath === path || normalizedPath.startsWith(`${path}/`))) {
      return <Navigate to="/" replace />;
    }
  }

  const matchedFeature = routeFeatureChecks.find((item) => item.matcher(normalizedPath))?.feature;

  if (status === "authenticated" && matchedFeature && !hasFeatureAccess(matchedFeature)) {
    return (
      <>
        <Dialog
          open
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              pb: 1,
              fontWeight: 800,
              color: "#991b1b",
              background:
                "linear-gradient(180deg, rgba(254,242,242,1) 0%, rgba(255,255,255,1) 100%)",
            }}
          >
            Subscription expired
          </DialogTitle>
          <DialogContent sx={{ pt: "16px !important" }}>
            <Box
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(248, 113, 113, 0.28)",
                backgroundColor: "#fef2f2",
                p: 2,
                mb: 2,
              }}
            >
              <Typography sx={{ fontWeight: 700, color: "#7f1d1d", mb: 0.5 }}>
                This section is unavailable right now.
              </Typography>
              <Typography variant="body2" sx={{ color: "#991b1b", lineHeight: 1.55 }}>
                Your plan or trial has expired, so editing, orders, analytics, settings, and other premium tools are locked until a plan is active again.
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
              You can still open billing to review the expiry details and reactivate access.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Go to dashboard
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/billing")}
              sx={{ textTransform: "none", fontWeight: 700, boxShadow: "none" }}
            >
              Open billing
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return children;
}
