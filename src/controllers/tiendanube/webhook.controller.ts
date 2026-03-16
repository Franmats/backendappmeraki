import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { getOrder } from '../../services/tiendanube/tiendanube.service';
import { generateOrderCsvs } from '../../services/tiendanube/csv.service';
import { TNWebhookPayload } from '../../types/tiendanube';

export async function handleOrderWebhook(req: Request, res: Response): Promise<void> {
  const payload: TNWebhookPayload = req.body;

  // TN espera 200 rápido
  res.status(200).json({ received: true });

  try {
    if (!payload.event.startsWith('orders/')) return;

    // Evitar duplicados
    const { rows } = await pool.query(
      'SELECT id FROM tiendanube_orders WHERE tiendanube_id = $1',
      [payload.id]
    );
    if (rows.length > 0) {
      console.log(`[Webhook] Pedido ${payload.id} ya procesado, ignorando.`);
      return;
    }

    // Traer pedido completo desde TN
    const order = await getOrder(payload.id);

    // Guardar en PostgreSQL
    await pool.query(
      `INSERT INTO tiendanube_orders
        (tiendanube_id, customer_email, customer_dni, total, status, raw_payload)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        order.id,
        order.customer?.email ?? null,
        order.customer?.identification ?? null,
        parseFloat(order.total),
        order.status,
        JSON.stringify(order),
      ]
    );

    // Generar CSVs
    generateOrderCsvs(order);

    console.log(`[Webhook] Pedido ${order.number} procesado correctamente.`);
  } catch (err) {
    console.error('[Webhook] Error procesando pedido:', err);
  }
}