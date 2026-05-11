"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";

const linkClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-semibold ${
    active ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:text-[var(--accent)]"
  }`;

export default function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="menu-shell mb-6 flex flex-wrap items-center justify-between gap-3">
      <Link href="/" className="text-lg font-semibold tracking-[0.08em] text-[var(--ink)]">
        Hunger-Dhaba
      </Link>

      <nav className="flex flex-wrap items-center gap-2">
        <Link href="/" className={linkClass(pathname === "/")}>
          Menu
        </Link>
        <Link href="/my-orders" className={linkClass(pathname === "/my-orders")}>
          My Orders
        </Link>
        <Link href="/cart" className={linkClass(pathname === "/cart")}>
          Cart {itemCount > 0 ? `(${itemCount})` : ""}
        </Link>
      </nav>
    </header>
  );
}
