import ProductCard from './ProductCard';
import { Product } from '@/types/product';

export default function ProductGrid({ products }: { products: Product[] }) {
    // console.log("--->", products);
    
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.data.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
