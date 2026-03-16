import { TNProduct, TNOrder } from '../../types/tiendanube';
import  config  from '../../config/config';

const BASE_URL = `https://api.tiendanube.com/v1/${config.tn_store_id}`;

const getHeaders = () => ({
  Authentication: `bearer ${config.tn_access_token}`,
  'Content-Type': 'application/json',
  'User-Agent': 'prueba francomats424@gmail.com',
});

export async function createProduct(data: {
  codigo: string;
  nombre: string;
  precio: number;
  precio_descuento: number | null;
  stock: number;
  imagen: string | null;
  descripcion: string | null;
}): Promise<{ tiendanube_id: number; variant_id: number }> {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      name: { es: data.nombre },
      description: { es: data.descripcion ?? '' },
      variants: [
        {
          price: data.precio.toString(),
          promotional_price: data.precio_descuento?.toString() ?? null,
          stock: data.stock,
          sku: data.codigo,
        },
      ],
      ...(data.imagen ? { images: [{ src: data.imagen }] } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TN createProduct error: ${res.status} - ${err}`);
  }

  const product: TNProduct = await res.json();
  return {
    tiendanube_id: product.id,
    variant_id: product.variants[0].id,
  };
}

export async function updateVariant(
  tiendanube_id: number,
  variant_id: number,
  data: {
    precio: number;
    precio_descuento: number | null;
    stock: number;
  }
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/products/${tiendanube_id}/variants/${variant_id}`,
    {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        price: data.precio.toString(),
        promotional_price: data.precio_descuento?.toString() ?? null,
        stock: data.stock,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TN updateVariant error: ${res.status} - ${err}`);
  }
}

export async function deactivateProduct(tiendanube_id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/products/${tiendanube_id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ published: false }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TN deactivateProduct error: ${res.status} - ${err}`);
  }
}

export async function getOrder(order_id: number): Promise<TNOrder> {
  const res = await fetch(`${BASE_URL}/orders/${order_id}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TN getOrder error: ${res.status} - ${err}`);
  }

  return res.json();
}

export async function activateProduct(tiendanube_id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/products/${tiendanube_id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ published: true }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TN activateProduct error: ${res.status} - ${err}`);
  }
}