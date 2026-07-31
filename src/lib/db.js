import Dexie from 'dexie';

// Inisialisasi Database Dexie untuk Tokiva POS (Offline-First)
export const db = new Dexie('TokivaDB');

// Skema IndexedDB lokal toko
db.version(1).stores({
  // Master Produk (Indexed: id, nama, barcode, kategori_id, aktif)
  produk: 'id, nama, barcode, kategori_id, aktif',
  
  // Master Kategori & Satuan
  kategori: 'id, nama',
  satuan: 'id, nama',
  
  // Master Pelanggan
  pelanggan: 'id, nama, no_hp',
  
  // Data Shift Aktif Kasir
  shift_aktif: 'id, kasir_id, status',
  
  // Antrean Transaksi Offline (Indexed: id, nomor_transaksi, created_at, status_sync)
  transaksi_offline: 'id, nomor_transaksi, created_at, status_sync'
});
