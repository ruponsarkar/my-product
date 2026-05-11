"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { ClientProfile, Product } from "@/types/product";
import { createPublicOrder } from "@/lib/api";
import { loadPublicCustomerSession } from "@/lib/publicCustomerSession";

const emptyClient = {
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

export default function PublicOrderForm({ product }: { product: Product }) {
  const router = useRouter();
  const [client, setClient] = useState<ClientProfile>(emptyClient);
  const [quantity, setQuantity] = useState(1);
  const [paymentType, setPaymentType] = useState<"cash" | "online">("cash");
  const [customerNote, setCustomerNote] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, startSubmit] = useTransition();
  const [detailsUnlocked, setDetailsUnlocked] = useState(false);

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

  const unitPrice = Number(product.sellingPrice ?? product.mrp ?? 0);
  const total = Number((unitPrice * quantity).toFixed(2));

  const updateField =
    (field: keyof ClientProfile) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setClient((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const mobile = String(client.mobile || "").replace(/\D/g, "");
    if (!client.name?.trim() || mobile.length < 10) {
      setError("Name and a valid mobile number are required.");
      return;
    }

    startSubmit(async () => {
      try {
        const response = await createPublicOrder({
          items: [{ product: product._id, quantity }],
          payment_type: paymentType,
          customer_note: customerNote.trim() || undefined,
          client: {
            ...client,
            mobile,
          },
        });

        router.push(
          `/order-success?orderId=${encodeURIComponent(response?.order?.order_id || "")}`
        );
      } catch (submitError: unknown) {
        setError(getErrorMessage(submitError, "Unable to place the order."));
      }
    });
  };

  const handleContinue = async () => {
    const mobile = String(client.mobile || "").replace(/\D/g, "");
    setError("");

    if (mobile.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setDetailsUnlocked(true);
    setClient((current) => ({ ...current, mobile }));
  };

  return (
    <form onSubmit={handleSubmit} className="menu-panel rounded-[30px] p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Place order</p>
          <h3 className="mt-2 text-3xl font-semibold">Delivery Details</h3>
        </div>
        <div className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent)]">
          Rs {total.toFixed(0)}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium">Mobile number</span>
          <input
            value={client.mobile || ""}
            onChange={updateField("mobile")}
            className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
            placeholder="01XXXXXXXXX"
          />
          <span className="mt-1 block text-xs text-[var(--muted)]">
            If you logged in on this device, your saved details can be filled automatically.
          </span>
        </label>

        {!detailsUnlocked ? (
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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

        <label className="block">
          <span className="mb-2 block text-sm font-medium">Quantity</span>
          <input
            type="number"
            min={1}
            max={Math.max(1, Number(product.stockQty || 1))}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
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
            placeholder="Any special instructions for this order"
          />
        </label>
          </>
        ) : null}
      </div>

      {error ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={!detailsUnlocked || isSubmitting || Number(product.stockQty || 0) <= 0}
          className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Placing order..." : Number(product.stockQty || 0) <= 0 ? "Out of Stock" : "Confirm Order"}
        </button>
        <AddToCartButton product={product} quantity={quantity} />
      </div>
    </form>
  );
}
