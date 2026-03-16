import fs from 'fs';
import path from 'path';
import { TNOrder } from '../../types/tiendanube';
import config from '../../config/config';

function getPedidosDir(): string {
  return config.pedidos_dir ?? './pedidos';
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = value.toString();
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toRow(values: (string | number | null | undefined)[]): string {
  return values.map(escapeCsv).join(',');
}

export function generateOrderCsvs(order: TNOrder): void {
  const dir = getPedidosDir();
  ensureDir(dir);

  // ── Archivo principal del pedido ──────────────────────────
  const pedidoPath = path.join(dir, `pedido_${order.number}.csv`);
  const pedidoHeaders = [
    'numero_pedido',
    'estado',
    'estado_pago',
    'nombre',
    'email',
    'dni',
    'telefono',
    'direccion',
    'ciudad',
    'provincia',
    'codigo_postal',
    'subtotal',
    'descuento',
    'total',
  ];

  const pedidoRow = toRow([
    order.number,
    order.status,
    order.payment_status,
    order.billing_address?.name ?? order.customer?.name,
    order.customer?.email,
    order.customer?.identification,
    order.customer?.phone,
    order.billing_address?.address,
    order.billing_address?.city,
    order.billing_address?.province,
    order.billing_address?.zipcode,
    order.subtotal,
    order.total_discount,
    order.total,
  ]);

  fs.writeFileSync(pedidoPath, [pedidoHeaders.join(','), pedidoRow].join('\n'), 'utf8');
  console.log(`[CSV] Pedido escrito: ${pedidoPath}`);

  // ── Archivo de items del pedido ───────────────────────────
  const itemsPath = path.join(dir, `pedido_${order.number}_items.csv`);
  const itemsHeaders = [
    'numero_pedido',
    'sku',
    'nombre',
    'cantidad',
    'precio_unitario',
    'descuento',
    'subtotal',
  ];

  const itemsRows = order.products.map((p) =>
    toRow([
      order.number,
      p.sku,
      p.name,
      p.quantity,
      p.price,
      p.discount ?? 0,
      (parseFloat(p.price) * p.quantity).toFixed(2),
    ])
  );

  fs.writeFileSync(
    itemsPath,
    [itemsHeaders.join(','), ...itemsRows].join('\n'),
    'utf8'
  );
  console.log(`[CSV] Items escritos: ${itemsPath}`);
}