import { syncPendingProducts } from '../services/tiendanube/sync.service';

const INTERVAL_MS = 60_000;
let running = false;

async function tick(): Promise<void> {
  if (running) {
    console.log('[SyncWorker] Sync anterior todavía corriendo, saltando...');
    return;
  }

  running = true;

  try {
    console.log(`[SyncWorker] ${new Date().toISOString()} - Iniciando sync...`);
    await syncPendingProducts();
    console.log(`[SyncWorker] Sync completado.`);
  } catch (err) {
    console.error('[SyncWorker] Error inesperado:', err);
  } finally {
    running = false;
  }
}

export function startSyncWorker(): void {
  console.log('[SyncWorker] Worker iniciado.');
  tick();
  setInterval(tick, INTERVAL_MS);
}