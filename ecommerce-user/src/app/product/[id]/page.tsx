import { getProduct } from '@/lib/api';

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = await params;  
    // console.log("product ==> _id4 ", params);
  const product = await getProduct(id); 
  

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <img src={process.env.NEXT_PUBLIC_API_URL+product?.images[0]?.url} alt={product.name} className="w-full h-64 object-cover rounded" />
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p className="text-blue-600 font-semibold text-xl">₹{product.price}</p>
      <p className="mt-2 text-gray-600">{product.description}</p>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
    </div>
  );
}
