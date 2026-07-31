'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, FileText, Building2, Upload, CheckCircle2, Search, Calendar, ChevronRight } from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api';

export default function KasirNotaMasukPage() {
  const [notaList, setNotaList] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchNota();
  }, []);

  const fetchNota = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/kasir/nota-masuk');
      const data = Array.isArray(res) ? res : (res?.data || []);
      setNotaList(data);
    } catch {
      setNotaList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNota = notaList.filter((n) => {
    const matchesSearch =
      n.nomor_nota.toLowerCase().includes(search.toLowerCase()) ||
      (n.supplier?.nama && n.supplier.nama.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'semua') return true;
    return n.status_bayar === statusFilter;
  });

  return (
    <div className="max-w-md mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <div>
          <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-poppins)]">
            Nota Masuk Restok
          </h1>
          <p className="text-xs text-gray-400">Penerimaan stok dari supplier</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#16A34A] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#15803D] active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Terima Nota</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari no. nota / supplier..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]/30"
        />
      </div>

      {/* Filter Status Pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {[
          { id: 'semua', label: 'Semua Nota' },
          { id: 'lunas', label: 'Lunas' },
          { id: 'sebagian', label: 'Hutang / Sebagian' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setStatusFilter(item.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border',
              statusFilter === item.id
                ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-xs'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Mobile Compact Nota Card List (Zero Horizontal Scroll!) */}
      {filteredNota.length > 0 ? (
        <div className="space-y-2.5">
          {filteredNota.map((n) => {
            const isLunas = n.status_bayar === 'lunas';

            return (
              <div
                key={n.id}
                className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs flex items-center justify-between gap-3 hover:border-[#16A34A] transition-all"
              >
                {/* Nota Icon Badge */}
                <div className="w-11 h-11 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>

                {/* Nota Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-gray-900 font-mono tracking-tight truncate">
                      {n.nomor_nota}
                    </h4>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0',
                        isLunas ? 'bg-emerald-50 text-[#16A34A]' : 'bg-amber-50 text-amber-700'
                      )}
                    >
                      {isLunas ? 'Lunas' : 'Hutang'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 font-semibold mt-1 truncate">
                    {n.supplier?.nama || 'Supplier'}
                  </p>

                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-300" />
                      {n.tanggal}
                    </span>
                  </div>
                </div>

                {/* Right Amount & Link */}
                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-[#16A34A]">
                    {formatRupiah(n.total)}
                  </p>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-gray-400 hover:text-[#16A34A] mt-1">
                    Detail
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-xs">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">Nota Masuk Tidak Ditemukan</h4>
          <p className="text-xs text-gray-400">Belum ada nota masuk yang sesuai pencarian.</p>
        </div>
      )}

      {/* Modal Form Restok Nota Masuk */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Terima Barang Nota Masuk Baru"
        size="md"
      >
        <div className="space-y-4 text-xs">
          <Input label="Nomor Nota Supplier" placeholder="INV/2026/07/001" required />
          <Input label="Nama Supplier" placeholder="PT Indofood Sukses Makmur" required />
          <Input label="Total Pembelian" type="number" prefix="Rp" required />
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-2 cursor-pointer hover:border-[#16A34A] transition-colors">
            <Upload className="w-6 h-6 text-[#16A34A] mx-auto" />
            <p className="font-semibold text-gray-700">Upload Foto Nota Fisik</p>
            <p className="text-[10px] text-gray-400">PNG, JPG hingga 5MB</p>
          </div>
          <Button variant="primary" fullWidth size="lg" onClick={() => setIsFormOpen(false)}>
            Simpan & Tambah Stok
          </Button>
        </div>
      </Modal>
    </div>
  );
}
