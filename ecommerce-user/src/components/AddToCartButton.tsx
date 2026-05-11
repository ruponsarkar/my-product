"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { Product } from "@/types/product";

export default function AddToCartButton({
  product,
  quantity = 1,
  className = "",
}: {
  product: Product;
  quantity?: number;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const isOutOfStock = Number(product.stockQty || 0) <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={`rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
    >
      {isOutOfStock ? "Out of Stock" : added ? "Added" : "Add to Cart"}
    </button>
  );
}
