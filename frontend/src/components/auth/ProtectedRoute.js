import React from "react";
import { Navigate, useLocation } from "react-router-dom";
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
    return <Navigate to="/billing" replace />;
  }

  return children;
}
