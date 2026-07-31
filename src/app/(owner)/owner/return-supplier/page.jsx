'use client';

import React, { useState } from 'react';
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

export default function OwnerReturnSupplierPage() {
  const [returnList, setReturnList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplier: '',
    produk: '',
    qty: 0,
    alasan: '',
    nilai: 0,
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const newRet = {
      id: 'ret-' + Date.now(),
      nomorRetur: 'RET-260730-00' + (returnList.length + 1),
      supplier: formData.supplier,
      tanggal: '30 Jul 2026',
      produk: `${formData.produk} (${formData.alasan})`,
      qty: Number(formData.qty),
      totalNilai: Number(formData.nilai),
      status: 'Diproses',
    };
    setReturnList(prev => [newRet, ...prev]);
    setIsModalOpen(false);
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
                    <h4 className="text-xs font-bold text-gray-900">{item.nomorRetur}</h4>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0',
                        isSelesai ? 'bg-emerald-50 text-[#16A34A]' : 'bg-amber-50 text-amber-700'
                      )}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-gray-800 mt-1 truncate">{item.supplier}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.produk} • {item.qty} pcs</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-[#16A34A]">{formatRupiah(item.totalNilai)}</p>
                  <span className="text-[10px] text-gray-400 font-medium block mt-1">{item.tanggal}</span>
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
