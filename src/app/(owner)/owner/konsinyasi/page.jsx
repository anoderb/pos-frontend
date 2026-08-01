'use client';

import React, { useState, useEffect } from 'react';
import {
  Handshake,
  Plus,
  Building2,
  PackageCheck,
  X,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';

export default function OwnerKonsinyasiPage() {
  const [konsinyasiList, setKonsinyasiList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    supplier_id: '',
    produk_id: '',
    nama_produk: '',
    qty_terima: 0,
    harga_beli: 0,
    harga_jual: 0,
    tanggal_jatuh_tempo: '',
  });

  const fetchKonsinyasi = () => {
    api.get('/owner/konsinyasi').then(res => {
      const data = res?.berhasil ? res.data : (Array.isArray(res?.data) ? res.data : []);
      if (Array.isArray(data)) setKonsinyasiList(data);
    }).catch(() => {}).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchKonsinyasi();
    api.get('/owner/supplier').then(res => {
      const data = res?.berhasil ? res.data : (Array.isArray(res?.data) ? res.data : []);
      if (Array.isArray(data)) setSupplierList(data);
    }).catch(() => {});
    api.get('/owner/produk').then(res => {
      const data = res?.berhasil ? res.data : (Array.isArray(res?.data) ? res.data : []);
      if (Array.isArray(data)) setProdukList(data);
    }).catch(() => {});
  }, []);

  const handleOpenAdd = () => {
    setFormData({ supplier_id: '', produk_id: '', nama_produk: '', qty_terima: 0, harga_beli: 0, harga_jual: 0, tanggal_jatuh_tempo: '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const selectedProduk = produkList.find(p => p.id === formData.produk_id);
    try {
      await api.post('/owner/konsinyasi', {
        supplier_id: formData.supplier_id,
        tanggal_terima: new Date().toISOString().slice(0, 10),
        tanggal_jatuh_tempo: formData.tanggal_jatuh_tempo || undefined,
        items: [{
          produk_id: formData.produk_id,
          nama_produk: selectedProduk?.nama || formData.nama_produk,
          satuan: 'pcs',
          qty_terima: Number(formData.qty_terima),
          harga_beli: Number(formData.harga_beli),
          harga_jual: Number(formData.harga_jual),
        }],
      });
      setIsModalOpen(false);
      fetchKonsinyasi();
    } catch (err) {
      alert('Gagal: ' + (err?.message || 'Terjadi kesalahan'));
    }
  };

  const handleBayar = async (konsinyasiId) => {
    const jumlah = prompt('Jumlah pembayaran:');
    if (!jumlah) return;
    try {
      await api.post(`/owner/konsinyasi/${konsinyasiId}/bayar`, { jumlah_bayar: Number(jumlah) });
      fetchKonsinyasi();
    } catch (err) { alert('Gagal: ' + (err?.message || 'Terjadi kesalahan')); }
  };

  const handleKembali = async (konsinyasiId, itemId) => {
    const qty = prompt('Jumlah dikembalikan:');
    if (!qty) return;
    try {
      await api.post(`/owner/konsinyasi/${konsinyasiId}/kembali`, { item_id: itemId, qty_kembali: Number(qty) });
      fetchKonsinyasi();
    } catch (err) { alert('Gagal: ' + (err?.message || 'Terjadi kesalahan')); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Konsinyasi / Barang Titip Jual</h1>
          <p className="text-xs text-gray-400">Kelola barang titipan supplier & settlement pembayaran</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center gap-1.5 px-3 py-2 bg-[#16A34A] text-white rounded-xl text-xs font-bold hover:bg-[#15803D] transition-all">
          <Plus className="w-4 h-4" /> Tambah Barang Titipan
        </button>
      </div>

      {konsinyasiList.map((ksn) => {
        const firstItem = ksn.items?.[0] || {};
        const totalDibayar = Number(ksn.total_dibayar || 0);
        const totalNilai = Number(ksn.total_nilai || 0);
        const sisaBayar = Math.max(0, totalNilai - totalDibayar);

        return (
          <div key={ksn.id} className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{ksn.supplier?.nama || '-'}</h4>
                  <p className="text-[10px] text-gray-400">{firstItem.nama_produk || '-'} • {ksn.nomor_konsinyasi}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ksn.status === 'aktif' ? 'bg-emerald-50 text-[#16A34A] border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                {ksn.status === 'aktif' ? 'Aktif' : 'Selesai'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-gray-50 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Terima / Terjual</span>
                <span className="font-bold">{firstItem.qty_terima || 0} / <span className="text-[#16A34A]">{firstItem.qty_terjual || 0}</span></span>
              </div>
              <div className="p-2 bg-gray-50 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Sisa / Kembali</span>
                <span className="font-bold">{(firstItem.qty_terima || 0) - (firstItem.qty_terjual || 0) - (firstItem.qty_kembali || 0)} / {firstItem.qty_kembali || 0}</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Harga Jual</span>
                <span className="font-bold text-[#16A34A]">{formatRupiah(firstItem.harga_jual || 0)}</span>
              </div>
            </div>

            {ksn.status === 'aktif' && (
              <div className="flex items-center justify-between pt-1 gap-2">
                <span className="text-xs text-gray-500">Dibayar: <strong>{formatRupiah(totalDibayar)}</strong> / {formatRupiah(totalNilai)}</span>
                <div className="flex gap-1.5">
                  {firstItem.id && (
                    <button onClick={() => handleKembali(ksn.id, firstItem.id)} className="px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-200 hover:bg-amber-100">
                      Kembali
                    </button>
                  )}
                  {sisaBayar > 0 && (
                    <button onClick={() => handleBayar(ksn.id)} className="px-2.5 py-1.5 bg-[#16A34A] text-white rounded-xl text-xs font-bold hover:bg-[#15803D]">
                      Bayar
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Barang Konsinyasi" size="md">
        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 block">Supplier</label>
            <select value={formData.supplier_id} onChange={e => setFormData({ ...formData, supplier_id: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs" required>
              <option value="">Pilih Supplier...</option>
              {supplierList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 block">Produk</label>
            <select value={formData.produk_id} onChange={e => { const p = produkList.find(x => x.id === e.target.value); setFormData({ ...formData, produk_id: e.target.value, nama_produk: p?.nama || '' }); }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs" required>
              <option value="">Pilih Produk...</option>
              {produkList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Qty Terima" type="number" value={formData.qty_terima} onChange={e => setFormData({ ...formData, qty_terima: e.target.value })} required />
            <Input label="Harga Beli (Rp)" type="number" value={formData.harga_beli} onChange={e => setFormData({ ...formData, harga_beli: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Harga Jual (Rp)" type="number" value={formData.harga_jual} onChange={e => setFormData({ ...formData, harga_jual: e.target.value })} required />
            <Input label="Jatuh Tempo" type="date" value={formData.tanggal_jatuh_tempo} onChange={e => setFormData({ ...formData, tanggal_jatuh_tempo: e.target.value })} />
          </div>
          <Button variant="primary" fullWidth size="lg" type="submit">Simpan Konsinyasi</Button>
        </form>
      </Modal>
    </div>
  );
}
