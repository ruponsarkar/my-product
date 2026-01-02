export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http:127.0.0.1:4000';

export async function getProducts() {
  const res = await fetch(`${API_URL}/api/v1/products?limit=30`);
//   console.log("res1 ==>>", res);
  
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id: string) {
  const res = await fetch(`${API_URL}/api/v1/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}
