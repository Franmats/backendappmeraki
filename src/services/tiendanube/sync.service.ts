import { pool } from '../../config/db';
import { createProduct, updateVariant, deactivateProduct,activateProduct } from './tiendanube.service';
import config from '../../config/config';

interface ProductRow {
  id: number;
  codigo: string;
  nombre: string;
  codigo_barras: string | null;
  precio: number;
  precio_descuento: number | null;
  stock: number;
  imagen: string | null;
  descripcion: string | null;
  activo: boolean;
  updated_at: Date;
}

export async function syncPendingProducts(): Promise<void> {
  const { rows } = await pool.query<ProductRow>(`
    SELECT p.*
    FROM productoscsvtienda p
    LEFT JOIN tiendanube_products tp ON tp.internal_code = p.codigo
    WHERE tp.internal_code IS NULL
       OR p.updated_at > tp.last_synced_at
       OR tp.sync_status = 'error'
    LIMIT 50
  `);

  console.log(`[Sync] ${rows.length} productos pendientes.`);

  for (const product of rows) {
    await syncProduct(product);
  }
}

async function syncProduct(product: ProductRow): Promise<void> {
  const { rows } = await pool.query(
    'SELECT * FROM tiendanube_products WHERE internal_code = $1',
    [product.codigo]
  );

  const existing = rows[0]?.tiendanube_id !== 0 ? rows[0] : null;

  try {
    if (!product.activo && existing) {
      // Producto desactivado → ocultar en TN
      await deactivateProduct(existing.tiendanube_id);
      await pool.query(
        `UPDATE tiendanube_products
         SET sync_status = 'ok', error_message = NULL,
             last_synced_at = NOW(), updated_at = NOW()
         WHERE internal_code = $1`,
        [product.codigo]
      );
      console.log(`[Sync] Producto ${product.codigo} desactivado en TN.`);

    } else if (!product.activo && !existing) {
      // Nunca se sincronizó y ya está inactivo, ignorar
      console.log(`[Sync] Producto ${product.codigo} inactivo y sin sync previo, ignorando.`);

    } else if (!existing) {
      // Producto nuevo → crear en TN
      const imagen = `${config.api_url}/api/dataforapptn/imagenes/${product.codigo}.jpg`;
      const { tiendanube_id, variant_id } = await createProduct({
        codigo: product.codigo,
        nombre: product.nombre,
        precio: product.precio,
        precio_descuento: product.precio_descuento,
        stock: product.stock,
        imagen: imagen,
        descripcion: product.descripcion,
      });

      await pool.query(
        `INSERT INTO tiendanube_products
          (internal_code, tiendanube_id, variant_id, sync_status, last_synced_at)
         VALUES ($1, $2, $3, 'ok', NOW())`,
        [product.codigo, tiendanube_id, variant_id]
      );
      console.log(`[Sync] Producto ${product.codigo} creado en TN.`);

    } else {
      await activateProduct(existing.tiendanube_id);
      // Producto existente → actualizar
      await updateVariant(existing.tiendanube_id, existing.variant_id, {
        precio: product.precio,
        precio_descuento: product.precio_descuento,
        stock: product.stock,
      });

      await pool.query(
        `UPDATE tiendanube_products
         SET sync_status = 'ok', error_message = NULL,
             last_synced_at = NOW(), updated_at = NOW()
         WHERE internal_code = $1`,
        [product.codigo]
      );
      console.log(`[Sync] Producto ${product.codigo} actualizado en TN.`);
    }

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error(`[Sync] Error en producto ${product.codigo}:`, message);

    await pool.query(
      `INSERT INTO tiendanube_products
        (internal_code, tiendanube_id, variant_id, sync_status, error_message)
       VALUES ($1, 0, 0, 'error', $2)
       ON CONFLICT (internal_code) DO UPDATE
       SET sync_status = 'error', error_message = $2, updated_at = NOW()`,
      [product.codigo, message]
    );
  }
}