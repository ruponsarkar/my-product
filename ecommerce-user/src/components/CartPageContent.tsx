"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

const formatCurrency = (value: number) => `Rs ${value.toFixed(0)}`;

export default function CartPageContent() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section className="menu-panel rounded-[32px] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Your cart</p>
        <h1 className="mt-3 text-4xl font-semibold">Cart is Empty</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          Add a few dishes from the menu, then place one order for everything together.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white"
        >
          Browse Menu
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4">
        {items.map((item) => {
          const price = Number(item.product.sellingPrice ?? item.product.mrp ?? 0);
          const imageUrl = item.product?.images?.[0]?.url
            ? `${process.env.NEXT_PUBLIC_API_URL}${item.product.images[0].url}`
            : `https://placehold.co/320x320/f3e8d7/6b5b4d?text=${item.product.name || "Menu Item"}`;

          return (
            <article key={item.product._id} className="menu-panel rounded-[30px] p-5">
              <div className="flex flex-col gap-5 sm:flex-row">
                <img
                  src={imageUrl}
                  alt={item.product.name}
                  className="h-28 w-full rounded-[22px] object-cover sm:w-32"
                />
                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                        {item.product.category || "Featured item"}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold">{item.product.name}</h2>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {formatCurrency(price)} each
                      </p>
                    </div>
                    <p className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">
                      {formatCurrency(price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={Math.max(1, Number(item.product.stockQty || 1))}
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.product._id, Number(event.target.value) || 1)
                      }
                      className="w-24 rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
                    />
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]"
                    >
                      View Item
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product._id)}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <aside className="menu-panel h-fit rounded-[30px] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Order summary</p>
        <h2 className="mt-3 text-3xl font-semibold">{itemCount} items ready</h2>
        <div className="mt-6 flex items-center justify-between text-base">
          <span className="text-[var(--muted)]">Total</span>
          <span className="text-3xl font-bold text-[var(--accent)]">{formatCurrency(total)}</span>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white"
          >
            Proceed to Checkout
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="rounded-full border border-[var(--line)] bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)]"
          >
            Clear Cart
          </button>
        </div>
      </aside>
    </div>
  );
}
