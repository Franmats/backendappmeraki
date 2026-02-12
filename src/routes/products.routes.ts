import express from 'express';

import {getProductByCode} from '../controllers/products.controller';
import { authenticateUser } from '../controllers/users.controller';

const router = express.Router();

// Rutas de productos

router.get('/products/:code',authenticateUser, getProductByCode);


export default router;