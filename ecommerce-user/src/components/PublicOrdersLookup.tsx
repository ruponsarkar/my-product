"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  deletePublicOrder,
  getMyPublicOrders,
  getPublicCustomerSession,
  loginPublicCustomer,
  registerPublicCustomer,
} from "@/lib/api";
import {
  clearPublicCustomerSession,
  loadPublicCustomerSession,
  savePublicCustomerSession,
} from "@/lib/publicCustomerSession";
import { ClientProfile, PublicOrder } from "@/types/product";

const formatCurrency = (value?: number) => `Rs ${Number(value || 0).toFixed(0)}`;

const emptyClient: ClientProfile = {
  name: "",
  mobile: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  notes: "",
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function PublicOrdersLookup() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [client, setClient] = useState<ClientProfile>(emptyClient);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<PublicOrder[]>([]);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSubmitting, startSubmitting] = useTransition();
  const [isLoadingOrders, startLoadingOrders] = useTransition();
  const [deletingId, setDeletingId] = useState("");

  const fetchOrders = (sessionToken: string) => {
    startLoadingOrders(async () => {
      try {
        setError("");
        const data = await getMyPublicOrders(sessionToken);
        setOrders(data);
      } catch (fetchError: unknown) {
        setError(getErrorMessage(fetchError, "Unable to load orders."));
      }
    });
  };

  useEffect(() => {
    const session = loadPublicCustomerSession();

    if (!session?.token) {
      setIsHydrating(false);
      return;
    }

    startLoadingOrders(async () => {
      try {
        const sessionClient = await getPublicCustomerSession(session.token);
        setToken(session.token);
        setClient(sessionClient || emptyClient);
        savePublicCustomerSession({ token: session.token, client: sessionClient || emptyClient });
        const data = await getMyPublicOrders(session.token);
        setOrders(data);
      } catch {
        clearPublicCustomerSession();
        setToken("");
        setClient(emptyClient);
        setOrders([]);
      } finally {
        setIsHydrating(false);
      }
    });
  }, []);

  const updateClientField =
    (field: keyof ClientProfile) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setClient((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleAuthSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const mobile = String(client.mobile || "").replace(/\D/g, "");
    if (mobile.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    if (authMode === "register" && !client.name?.trim()) {
      setError("Name is required to create your account.");
      return;
    }

    startSubmitting(async () => {
      try {
        const response =
          authMode === "register"
            ? await registerPublicCustomer({
                name: String(client.name || "").trim(),
                mobile,
                password,
              })
            : await loginPublicCustomer({
                mobile,
                password,
              });

        const sessionClient = {
          ...client,
          ...response.client,
          mobile,
        };

        setToken(response.token);
        setClient(sessionClient);
        savePublicCustomerSession({ token: response.token, client: sessionClient });
        setPassword("");
        fetchOrders(response.token);
      } catch (authError: unknown) {
        setError(getErrorMessage(authError, "Unable to continue."));
      }
    });
  };

  const handleLogout = () => {
    clearPublicCustomerSession();
    setToken("");
    setOrders([]);
    setClient(emptyClient);
    setPassword("");
    setError("");
    setAuthMode("login");
  };

  const handleDelete = async (orderId: string) => {
    try {
      setDeletingId(orderId);
      setError("");
      await deletePublicOrder(orderId, token);
      fetchOrders(token);
    } catch (deleteError: unknown) {
      setError(getErrorMessage(deleteError, "Unable to delete this order."));
    } finally {
      setDeletingId("");
    }
  };

  if (isHydrating) {
    return (
      <section className="menu-panel rounded-[30px] p-6 text-center text-[var(--muted)] md:p-8">
        Restoring your account...
      </section>
    );
  }

  if (!token) {
    return (
      <div className="space-y-6">
        <section className="menu-panel rounded-[30px] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Secure access</p>
          <h2 className="mt-3 text-3xl font-semibold">My Orders</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Sign in with your phone number and password to view only your own orders. Your session stays saved on this device.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-[var(--line)] bg-white p-1">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                authMode === "login" ? "bg-[var(--accent)] text-white" : "text-[var(--muted)]"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                authMode === "register" ? "bg-[var(--accent)] text-white" : "text-[var(--muted)]"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            {authMode === "register" ? (
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium">Full name</span>
                <input
                  value={client.name || ""}
                  onChange={updateClientField("name")}
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
                  placeholder="Customer name"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Mobile number</span>
              <input
                value={client.mobile || ""}
                onChange={updateClientField("mobile")}
                className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
                placeholder="01XXXXXXXXX"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
                placeholder="Enter your password"
              />
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSubmitting ? "Please wait..." : authMode === "register" ? "Create Account" : "Login"}
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-[var(--muted)]">
            Orders can still be deleted within 2 minutes after placement.
          </p>
        </section>

        {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="menu-panel rounded-[30px] p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Signed in</p>
            <h2 className="mt-3 text-3xl font-semibold">My Orders</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {client.name || "Customer"} ({client.mobile || "No mobile"})
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-[var(--line)] bg-white px-5 py-2 text-sm font-semibold text-[var(--ink)]"
          >
            Logout
          </button>
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">
          This device will keep your session saved unless you log out.
        </p>
      </section>

      {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

      <div className="space-y-4">
        {orders.length === 0 && !isLoadingOrders ? (
          <section className="menu-panel rounded-[28px] p-8 text-center text-[var(--muted)]">
            No orders found for your account.
          </section>
        ) : null}

        {orders.map((order) => (
          <section key={order._id} className="menu-panel rounded-[28px] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Order ID</p>
                <h3 className="mt-2 text-2xl font-semibold">{order.order_id}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">
                  {formatCurrency(order.total)}
                </p>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
                  {order.status}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {(order.items || []).map((item, index) => (
                <div
                  key={`${order._id}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">{item.product?.name || "Product"}</p>
                    <p className="text-sm text-[var(--muted)]">Qty {item.quantity || 0}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(item.price)}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {order.canDelete ? (
                <button
                  type="button"
                  onClick={() => handleDelete(order._id)}
                  disabled={deletingId === order._id}
                  className="rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-700 disabled:opacity-60"
                >
                  {deletingId === order._id ? "Deleting..." : "Delete Order"}
                </button>
              ) : (
                <span className="rounded-full border border-[var(--line)] bg-white px-5 py-2 text-sm text-[var(--muted)]">
                  Delete window expired
                </span>
              )}
              <Link
                href="/"
                className="rounded-full border border-[var(--line)] bg-white px-5 py-2 text-sm font-semibold text-[var(--ink)]"
              >
                Order More
              </Link>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
