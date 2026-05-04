import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import {
  AUTH_TOKEN_KEY,
  clearAuthData,
  getAuthToken,
  getStoredUser,
} from "../../utils/auth";

const adminPaths = ["/settings", "/reports", "/users"];

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
        await api.get("/users/me");
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
  if (status === "authenticated" && currentUser?.role !== "admin") {
    const normalizedPath = location.pathname.toLowerCase();
    if (adminPaths.some((path) => normalizedPath === path || normalizedPath.startsWith(`${path}/`))) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
