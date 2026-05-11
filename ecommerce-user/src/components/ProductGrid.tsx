import ProductCard from './ProductCard';
import { ProductListResponse } from '@/types/product';

export default function ProductGrid({ products }: { products: ProductListResponse }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.data.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
