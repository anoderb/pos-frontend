'use client';

import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Plus,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api';

export default function OwnerReturnSupplierPage() {
  const [returnList, setReturnList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplier: '',
    produk: '',
    qty: 0,
    alasan: '',
    nilai: 0,
  });

  useEffect(() => {
    api.get('/owner/supplier').then(res => {
      const data = res?.berhasil ? res.data : (Array.isArray(res?.data) ? res.data : []);
      if (Array.isArray(data)) setSupplierList(data);
    }).catch(() => {});

    api.get('/owner/return-supplier').then(res => {
      const data = res?.berhasil ? res.data : (Array.isArray(res?.data) ? res.data : []);
      if (Array.isArray(data)) setReturnList(data);
    }).catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const supplier = supplierList.find(s => s.nama?.toLowerCase() === formData.supplier?.toLowerCase());
      await api.post('/owner/return-supplier', {
        supplier_id: supplier?.id || null,
        total: Number(formData.nilai),
        alasan: formData.alasan,
        catatan: formData.produk,
        items: [{
          produk_id: null,
          nama_produk: formData.produk,
          satuan: 'pcs',
          qty: Number(formData.qty),
          harga_beli: Number(formData.nilai) / Math.max(1, Number(formData.qty)),
          subtotal: Number(formData.nilai),
        }],
      });
      setIsModalOpen(false);
      const res = await api.get('/owner/return-supplier');
      const data = res?.berhasil ? res.data : (Array.isArray(res?.data) ? res.data : []);
      if (Array.isArray(data)) setReturnList(data);
    } catch (err) {
      alert('Gagal: ' + (err?.message || 'Terjadi kesalahan'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
        <div>
          <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-poppins)]">
            Return Supplier (Pengembalian Barang)
          </h1>
          <p className="text-xs text-gray-400">Pengajuan klaim retur barang rusak / kadaluarsa ke distributor</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#16A34A] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#15803D] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Retur Baru</span>
        </button>
      </div>

      {/* Return List (Mobile Compact Card View) */}
      {returnList.length > 0 ? (
        <div className="space-y-2.5">
          {returnList.map((item) => {
            const isSelesai = item.status === 'Selesai';
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between gap-3 hover:border-[#16A34A] transition-all"
              >
                <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-gray-900">{item.nomor_return}</h4>
                  </div>
                  <p className="text-xs font-semibold text-gray-800 mt-1 truncate">{item.supplier?.nama || '-'}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.items?.[0]?.nama_produk || '-'} • {item.items?.[0]?.qty || 0} pcs</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-[#16A34A]">{formatRupiah(item.total)}</p>
                  <span className="text-[10px] text-gray-400 font-medium block mt-1">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-xs">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-600">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">Belum Ada Pengajuan Retur</h4>
          <p className="text-xs text-gray-400 mb-4">Belum ada daftar barang yang diretur ke supplier distributor.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16A34A] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#15803D] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Retur Pertama</span>
          </button>
        </div>
      )}

      {/* Modal Form Retur Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Formulir Retur Barang ke Supplier"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
          <Input
            label="Nama Supplier / Pemasok"
            value={formData.supplier}
            onChange={e => setFormData({ ...formData, supplier: e.target.value })}
            required
          />
          <Input
            label="Nama Produk Yang Diretur"
            value={formData.produk}
            onChange={e => setFormData({ ...formData, produk: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Jumlah Qty Retur"
              type="number"
              value={formData.qty}
              onChange={e => setFormData({ ...formData, qty: e.target.value })}
              required
            />
            <Input
              label="Estimasi Total Nilai Retur"
              type="number"
              prefix="Rp"
              value={formData.nilai}
              onChange={e => setFormData({ ...formData, nilai: e.target.value })}
              required
            />
          </div>
          <Input
            label="Alasan Retur / Kerusakan"
            value={formData.alasan}
            onChange={e => setFormData({ ...formData, alasan: e.target.value })}
            required
          />

          <Button variant="primary" fullWidth size="lg" type="submit">
            Kirim Pengajuan Retur
          </Button>
        </form>
      </Modal>
    </div>
  );
}
