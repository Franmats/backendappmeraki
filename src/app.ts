// backend/src/app.ts
import express from 'express';
import config from './config/config';
import cors from 'cors';
import { testConnection } from './config/db';
import { startSyncWorker } from './workers/sync.worker';

import webhookRoutes from './routes/tiendanube/webhook.routes';



async function bootstrap() {
  const app = express();

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true
}));
  app.use(express.json());

  // Import dinámico de rutas (como ya lo tenías)

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

  // 🔹 Probar conexión ANTES de levantar el servidor
  await testConnection();
// Al final del archivo, después de las rutas
startSyncWorker();
  app.listen(config.port, () => {
    console.log(`Servidor corriendo en http://localhost:${config.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Error al iniciar la app:', err);
  process.exit(1);
});
