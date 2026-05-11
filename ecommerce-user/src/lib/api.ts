import {
  ClientProfile,
  Product,
  ProductListResponse,
  PublicCustomerAuthResponse,
  PublicOrder,
} from "@/types/product";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
export const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || "";

const buildUrl = (path: string, params?: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();

  if (TENANT_SLUG) {
    search.set("tenantSlug", TENANT_SLUG);
  }

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return `${API_URL}/api/v1${path}${query ? `?${query}` : ""}`;
};

export async function getFeaturedProducts(): Promise<ProductListResponse> {
  const res = await fetch(buildUrl("/public/products", { limit: 60 }), {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch featured products");
  return res.json();
}

export async function getPublicProduct(slug: string): Promise<Product> {
  const res = await fetch(buildUrl(`/public/products/${slug}`), {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function createPublicOrder(payload: {
  items: { product: string; quantity: number }[];
  payment_type: "cash" | "online";
  customer_note?: string;
  client: ClientProfile;
}) {
  const res = await fetch(buildUrl("/public/orders"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      tenantSlug: TENANT_SLUG || undefined,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to place order");
  }

  return data;
}

export async function registerPublicCustomer(payload: {
  name: string;
  mobile: string;
  password: string;
}): Promise<PublicCustomerAuthResponse> {
  const res = await fetch(buildUrl("/public/auth/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      tenantSlug: TENANT_SLUG || undefined,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to register");
  }

  return data;
}

export async function loginPublicCustomer(payload: {
  mobile: string;
  password: string;
}): Promise<PublicCustomerAuthResponse> {
  const res = await fetch(buildUrl("/public/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      tenantSlug: TENANT_SLUG || undefined,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to login");
  }

  return data;
}

export async function getPublicCustomerSession(token: string): Promise<ClientProfile> {
  const res = await fetch(buildUrl("/public/auth/me"), {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to load session");
  }

  return data?.client || null;
}

export async function getMyPublicOrders(token: string): Promise<PublicOrder[]> {
  const res = await fetch(buildUrl("/public/orders/my"), {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch orders");
  }

  return data?.data || [];
}

export async function deletePublicOrder(orderId: string, token: string) {
  const res = await fetch(buildUrl(`/public/orders/${orderId}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to delete order");
  }

  return data;
}
