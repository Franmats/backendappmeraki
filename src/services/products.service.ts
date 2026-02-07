// src/services/products.service.ts
import { pool } from '../config/db';


export interface Product {
  id: number
  descripcion: string
  codigo: string
  precio: number
}


export class ProductService {

static async findByBarcode(
    barcode: string
  ): Promise<Product | null> {
    const query = `
      SELECT id, descripcion, codigo, precio
      FROM productos
      WHERE codigo = $1
      LIMIT 1
    `

    const { rows } = await pool.query(query, [barcode])

    if (rows.length === 0) {
      return null
    }

    return rows[0]
  }
}

export default ProductService;
