import { api } from '@/lib/api';
import { db } from '@/lib/db';

export const syncService = {
  // Sync antrean transaksi offline ke Fastify server
  async syncOfflineTransactions() {
    if (!navigator.onLine) return;

    const pendingTx = await db.transaksi_offline
      .where('status_sync')
      .equals('pending')
      .toArray();

    if (pendingTx.length === 0) return;

    try {
      const res = await api.post('/kasir/transaksi/sync-offline', { transaksi: pendingTx });
      if (res.berhasil) {
        const ids = pendingTx.map((t) => t.id);
        await db.transaksi_offline.bulkDelete(ids);
        console.log(`Berhasil sync ${ids.length} transaksi offline.`);
      }
    } catch (err) {
      console.error('Gagal sync transaksi offline:', err);
    }
  },
};
