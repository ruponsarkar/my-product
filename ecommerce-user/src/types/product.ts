export interface ProductImage {
  url?: string;
}

export interface Product {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  sellingPrice?: number;
  mrp?: number;
  stockQty?: number;
  images?: ProductImage[];
  isFeatured?: boolean;
}

export interface ProductListResponse {
  data: Product[];
}

export interface ClientProfile {
  _id?: string;
  name?: string;
  mobile?: string;
  hasPassword?: boolean;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  notes?: string;
}

export interface PublicCustomerAuthResponse {
  token: string;
  client: ClientProfile;
}

export interface PublicOrderItem {
  product?: {
    _id: string;
    name?: string;
    slug?: string;
    images?: ProductImage[];
  };
  quantity?: number;
  price?: number;
}

export interface PublicOrder {
  _id: string;
  order_id: string;
  customer_phone?: string;
  customer_name?: string;
  total?: number;
  status?: string;
  createdAt: string;
  canDelete?: boolean;
  items?: PublicOrderItem[];
}
