import Link from "next/link";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="menu-shell">
      <section className="menu-panel mx-auto max-w-3xl rounded-[36px] px-8 py-12 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Order confirmed</p>
        <h1 className="mt-4 text-5xl font-semibold">Thank You</h1>
        <p className="mt-4 text-base leading-8 text-[var(--muted)]">
          {orderId
            ? `Your order ${orderId} has been placed successfully.`
            : "Your order has been placed successfully."}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)]"
          >
            Back to Menu
          </Link>
          <Link
            href="/my-orders"
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
          >
            View My Orders
          </Link>
        </div>
      </section>
    </div>
  );
}
