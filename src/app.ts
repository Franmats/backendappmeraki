// backend/src/app.ts
import express from 'express';
import config from './config/config';
import cors from 'cors';
import { testConnection } from './config/db';

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

  app.get('/', (req, res) => {
    res.send('¡Hola desde TypeScript con ES Modules!');
  });

  // 🔹 Probar conexión ANTES de levantar el servidor
  await testConnection();

  app.listen(config.port, () => {
    console.log(`Servidor corriendo en http://localhost:${config.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Error al iniciar la app:', err);
  process.exit(1);
});
