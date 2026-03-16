export interface TNProduct {
  id: number;
  name: Record<string, string>;
  variants: TNVariant[];
}

export interface TNVariant {
  id: number;
  price: string;
  promotional_price: string | null;
  stock: number | null;
  sku: string;
}
export interface TNOrder {
  id: number;
  number: number;
  status: string;
  payment_status: string;
  total: string;
  subtotal: string;
  total_discount: string;
  customer: {
    email: string;
    name: string;
    identification: string; // DNI
    phone: string;
  };
  billing_address: {
    name: string;
    address: string;
    city: string;
    province: string;
    zipcode: string;
  };
  products: TNOrderProduct[];
}

export interface TNOrderProduct {
  product_id: number;
  variant_id: number;
  name: string;
  sku: string;
  quantity: number;
  price: string;
  discount: string | null;
}

export interface TNWebhookPayload {
  store_id: number;
  event: string;
  id: number;
}