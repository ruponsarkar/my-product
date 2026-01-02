import { getProducts } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Featured Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
