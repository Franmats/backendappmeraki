import express from 'express';

import {getProductByCode} from '../controllers/products.controller';

const router = express.Router();

// Rutas de productos

router.get('/products/:code', getProductByCode);


export default router;