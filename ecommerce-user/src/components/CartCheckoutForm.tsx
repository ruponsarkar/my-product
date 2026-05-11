"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useCart } from "@/components/CartProvider";
import { createPublicOrder } from "@/lib/api";
import { loadPublicCustomerSession } from "@/lib/publicCustomerSession";
import { ClientProfile } from "@/types/product";

const emptyClient = {
  name: "",
  mobile: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  notes: "",
};

const formatCurrency = (value: number) => `Rs ${value.toFixed(0)}`;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function CartCheckoutForm() {
  const router = useRouter();
  const { items, total, itemCount, clearCart } = useCart();
  const [client, setClient] = useState<ClientProfile>(emptyClient);
  const [paymentType, setPaymentType] = useState<"cash" | "online">("cash");
  const [customerNote, setCustomerNote] = useState("");
  const [error, setError] = useState("");
  const [detailsUnlocked, setDetailsUnlocked] = useState(false);
  const [isSubmitting, startSubmit] = useTransition();

  useEffect(() => {
    const session = loadPublicCustomerSession();
    if (!session?.client) return;

    const hydrateId = window.setTimeout(() => {
      setClient({
        ...emptyClient,
        ...session.client,
      });
    }, 0);

    return () => window.clearTimeout(hydrateId);
  }, []);

  const updateField =
    (field: keyof ClientProfile) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setClient((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleContinue = () => {
    const mobile = String(client.mobile || "").replace(/\D/g, "");
    setError("");

    if (mobile.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setDetailsUnlocked(true);
    setClient((current) => ({ ...current, mobile }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const mobile = String(client.mobile || "").replace(/\D/g, "");
    if (!client.name?.trim() || mobile.length < 10) {
      setError("Name and a valid mobile number are required.");
      return;
    }

    startSubmit(async () => {
      try {
        const response = await createPublicOrder({
          items: items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
          payment_type: paymentType,
          customer_note: customerNote.trim() || undefined,
          client: {
            ...client,
            mobile,
          },
        });

        clearCart();
        router.push(`/order-success?orderId=${encodeURIComponent(response?.order?.order_id || "")}`);
      } catch (submitError: unknown) {
        setError(getErrorMessage(submitError, "Unable to place the order."));
      }
    });
  };

  if (items.length === 0) {
    return (
      <section className="menu-panel rounded-[32px] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Checkout</p>
        <h1 className="mt-3 text-4xl font-semibold">Nothing to Checkout</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          Add a few items to your cart before placing a combined order.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Menu
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="menu-panel rounded-[30px] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Checkout</p>
        <h1 className="mt-3 text-4xl font-semibold">Confirm Your Order</h1>
        <div className="mt-6 space-y-3">
          {items.map((item) => {
            const price = Number(item.product.sellingPrice ?? item.product.mrp ?? 0);
            return (
              <div
                key={item.product._id}
                className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-[var(--muted)]">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatCurrency(price * item.quantity)}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-between rounded-[24px] bg-[var(--accent-soft)] px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Total items</p>
            <p className="mt-2 text-2xl font-semibold">{itemCount}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Grand total</p>
            <p className="mt-2 text-3xl font-bold text-[var(--accent)]">{formatCurrency(total)}</p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="menu-panel rounded-[30px] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Delivery details</p>
        <h2 className="mt-3 text-3xl font-semibold">Where should we send it?</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium">Mobile number</span>
            <input
              value={client.mobile || ""}
              onChange={updateField("mobile")}
              className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
              placeholder="01XXXXXXXXX"
            />
          </label>

          {!detailsUnlocked ? (
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white"
              >
                Continue
              </button>
            </div>
          ) : null}

          {detailsUnlocked ? (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Full name</span>
                <input
                  value={client.name || ""}
                  onChange={updateField("name")}
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
                  placeholder="Customer name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Email</span>
                <input
                  type="email"
                  value={client.email || ""}
                  onChange={updateField("email")}
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
                  placeholder="Optional email"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium">Address line 1</span>
                <input
                  value={client.addressLine1 || ""}
                  onChange={updateField("addressLine1")}
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
                  placeholder="House, street, area"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Address line 2</span>
                <input
                  value={client.addressLine2 || ""}
                  onChange={updateField("addressLine2")}
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
                  placeholder="Landmark or apartment"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">City</span>
                <input
                  value={client.city || ""}
                  onChange={updateField("city")}
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
                  placeholder="City"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Payment type</span>
                <select
                  value={paymentType}
                  onChange={(event) => setPaymentType(event.target.value as "cash" | "online")}
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
                >
                  <option value="cash">Cash on delivery</option>
                  <option value="online">Online</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Saved note</span>
                <input
                  value={client.notes || ""}
                  onChange={updateField("notes")}
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
                  placeholder="Client note"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium">Order note</span>
                <textarea
                  value={customerNote}
                  onChange={(event) => setCustomerNote(event.target.value)}
                  className="min-h-28 w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
                  placeholder="Any special instructions for this combined order"
                />
              </label>
            </>
          ) : null}
        </div>

        {error ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}

        <button
          type="submit"
          disabled={!detailsUnlocked || isSubmitting}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Placing order..." : `Place ${itemCount}-item Order`}
        </button>
      </form>
    </div>
  );
}
