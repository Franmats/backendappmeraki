import express from 'express';
import config from './config/config';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { testConnection } from './config/db';
import { startSyncWorker } from './workers/sync.worker';
import webhookRoutes from './routes/tiendanube/webhook.routes';

async function bootstrap() {
  const app = express();

  app.use(helmet());

  app.use(cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true
  }));

  app.use(express.json());

  // ── Imágenes ──────────────────────────────────────────────
  const imageLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500
  });

  app.use('/api/dataforapptn/imagenes',
    imageLimit,
    (req, res, next) => {
      const ext = path.extname(req.path).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        return res.status(403).json({ error: 'Tipo de archivo no permitido' });
      }
      next();
    },
    express.static(config.images_dir)
  );

  // ── Rutas ─────────────────────────────────────────────────
  const productsRoutes = (await import('./routes/products.routes')).default;
  const usersRoutes = (await import('./routes/user.routes')).default;
  const adminRoutes = (await import('./routes/admin.routes')).default;

  app.use('/api', productsRoutes);
  app.use('/api', usersRoutes);
  app.use('/api', adminRoutes);
  app.use('/api/tiendanube', webhookRoutes);

  app.get('/', (req, res) => {
    res.send('¡Hola desde TypeScript con ES Modules!');
  });

  console.log('TN_STORE_ID:', config.tn_store_id);
  console.log('TN_ACCESS_TOKEN:', config.tn_access_token);
  console.log('PEDIDOS_DIR:', config.pedidos_dir);
  console.log('IMAGES_DIR:', config.images_dir);

  await testConnection();
  startSyncWorker();

  app.listen(config.port, () => {
    console.log(`Servidor corriendo en http://localhost:${config.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Error al iniciar la app:', err);
  process.exit(1);
});