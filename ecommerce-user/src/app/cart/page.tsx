import CartPageContent from "@/components/CartPageContent";

export default function CartPage() {
  return (
    <div className="menu-shell">
      <section className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Your selections</p>
        <h1 className="mt-2 text-4xl font-semibold md:text-5xl">Cart</h1>
      </section>
      <CartPageContent />
    </div>
  );
}
