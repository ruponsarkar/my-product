import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { clearAuthData, getAuthToken } from "../../utils/auth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [status, setStatus] = React.useState("checking");
  const token = getAuthToken();

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

  return children;
}
