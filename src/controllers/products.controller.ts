import { stringify } from 'querystring';
import { ProductService } from '../services/products.service';




/**
 * Obtener un producto por ID con sus particiones
 * GET /api/products/:code
 */
export const getProductByCode = async (req, res) => {
    try {
        const barcode = req.params.code.trim();
         if (!barcode) {
    return res.status(400).json({ message: "Código requerido" })
  }
        const product = await ProductService.findByBarcode(barcode);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto', details: error });
    }
};
