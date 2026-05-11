import Link from 'next/link';
import { Product } from '@/types/product';
import AddToCartButton from '@/components/AddToCartButton';

const stripHtml = (value?: string) =>
  String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product?.images?.[0]?.url
    ? `${process.env.NEXT_PUBLIC_API_URL}${product.images[0].url}`
    : `https://placehold.co/640x640/f3e8d7/6b5b4d?text=${product.name || "Menu Item"}`;
  const price = Number(product.sellingPrice ?? product.mrp ?? 0);

  return (
    <div className="menu-panel group overflow-hidden rounded-[28px] p-3">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="overflow-hidden rounded-[22px] bg-[var(--paper-strong)]">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="px-2 pb-2 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
                {product.category || "Chef Special"}
              </p>
              <h2 className="mt-2 text-2xl font-semibold leading-none">{product.name}</h2>
            </div>
            <p className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-bold text-[var(--accent)]">
              Rs {price.toFixed(0)}
            </p>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
            {stripHtml(product.description) || "Freshly prepared and ready to order."}
          </p>
        </div>
      </Link>
      <div className="px-2 pb-2 pt-1">
        <AddToCartButton product={product} className="w-full" />
      </div>
    </div>
  );
}
