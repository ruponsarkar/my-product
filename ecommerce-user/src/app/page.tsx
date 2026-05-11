import { getFeaturedProducts } from '@/lib/api';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="menu-shell">
      <section className="menu-panel relative overflow-hidden rounded-[36px] px-6 py-10 md:px-10 md:py-14">
        <div className="absolute inset-x-8 top-6 h-px bg-[linear-gradient(90deg,transparent,rgba(159,91,46,0.4),transparent)]" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--muted)]">Featured selection</p>
          <h1 className="mt-5 text-5xl font-semibold md:text-7xl">Hunger-Dhaba Menu</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
            Browse the featured dishes and pantry picks, then open any item to place your order with delivery details.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/cart"
              className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)]"
            >
              View Cart
            </Link>
            <Link
              href="/my-orders"
              className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
            >
              My Orders
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Today&apos;s menu</p>
            <h2 className="mt-2 text-3xl font-semibold">Featured Products</h2>
          </div>
          <p className="text-sm text-[var(--muted)]">{products.data.length} items</p>
        </div>
      </section>

      <ProductGrid products={products} />
    </div>
  );
}
