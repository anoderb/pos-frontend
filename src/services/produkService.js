import api from '@/lib/api';
import { db } from '@/lib/db';

export const produkService = {
  // Sync masif data produk dari API server ke Dexie.js
  async syncProdukFromServer() {
    try {
      const res = await api.get('/produk');
      if (res.berhasil && res.data) {
        await db.produk.bulkPut(res.data);
      }
      return res;
    } catch (err) {
      console.warn('Gagal fetch produk dari server, menggunakan data lokal IndexedDB:', err.message);
    }
  },

  // Cari produk lokal dari Dexie.js (Offline-capable)
  async getProdukLokal() {
    return await db.produk.where('aktif').equals(1).toArray();
  },

  // Cari barcode di Dexie.js
  async getProdukByBarcode(kode) {
    return await db.produk.where('barcode').equals(kode).first();
  },
};
