import { Router } from 'express';
import { handleOrderWebhook } from '../../controllers/tiendanube/webhook.controller';

const router = Router();

router.post('/webhook/orders', handleOrderWebhook);

export default router;