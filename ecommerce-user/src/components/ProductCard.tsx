import Link from 'next/link';
import { Product } from '@/types/product';

export default function ProductCard({ product }: { product: Product }) {
    console.log("product ", product);
    
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
      <Link href={`/product/${product.slug}`}>
        <img src={process.env.NEXT_PUBLIC_API_URL+product?.images[0]?.url} alt={product.name} className="w-full h-48 object-cover rounded" />
        <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
        <p className="text-blue-600 font-bold">₹{product.price}</p>
      </Link>
    </div>
  );
}
