import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import PublicOrderForm from "@/components/PublicOrderForm";
import { getPublicProduct } from "@/lib/api";

export default async function PublicProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  const imageUrl = product?.images?.[0]?.url
    ? `${process.env.NEXT_PUBLIC_API_URL}${product.images[0].url}`
    : `https://placehold.co/900x900/f3e8d7/6b5b4d?text=${product.name || "Menu Item"}`;
  const price = Number(product.sellingPrice ?? product.mrp ?? 0);

  return (
    <div className="menu-shell">
      <Link href="/" className="mb-5 inline-flex text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)]">
        Back to menu
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.95fr]">
        <section className="menu-panel overflow-hidden rounded-[34px] p-5 md:p-7">
          <div className="overflow-hidden rounded-[28px] bg-[var(--paper-strong)]">
            <img src={imageUrl} alt={product.name} className="h-[420px] w-full object-cover md:h-[560px]" />
          </div>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
                {product.category || "Featured item"}
              </p>
              <h1 className="mt-3 text-5xl font-semibold">{product.name}</h1>
              <div
                className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]"
                dangerouslySetInnerHTML={{
                  __html:
                    product.description ||
                    "<p>Prepared with care and available for direct ordering from the public menu.</p>",
                }}
              />
            </div>
            <div className="rounded-[24px] bg-[var(--accent-soft)] px-5 py-4 text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Price</p>
              <p className="mt-2 text-3xl font-bold text-[var(--accent)]">Rs {price.toFixed(0)}</p>
              <AddToCartButton product={product} className="mt-4 w-full" />
            </div>
          </div>
        </section>

        <PublicOrderForm product={product} />
      </div>
    </div>
  );
}
