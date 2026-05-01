import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginAPI } from "../../api/services/auth/login";
import { getAuthToken, persistAuthData } from "../../utils/auth";

export default function Login() {
  const [tenantSlug, setTenantSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = getAuthToken();
  const redirectPath = location.state?.from?.pathname || "/";


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await loginAPI({ tenantSlug, email, password });

      persistAuthData({
        token: res.data.token,
        refreshToken: res.data.refreshToken,
        user: res.data.user,
      });

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
            I
          </div>
          <h1 className="text-2xl font-bold text-slate-950">Inventory Login</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage products, orders, and analytics.</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Tenant slug (optional)</label>
          <input
            type="text"
            placeholder="Enter tenant slug if required"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            value={tenantSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
