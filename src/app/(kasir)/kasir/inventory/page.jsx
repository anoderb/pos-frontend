'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Package, Barcode, AlertTriangle, ArrowLeft, Filter, Tag, CheckCircle2 } from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import { api } from '@/lib/api';

function ProdukThumb({ nama, className }) {
  const initials = (nama || 'P').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={cn('bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-[#16A34A] font-bold text-xs select-none shrink-0', className)}>
      {initials}
    </div>
  );
}

export default function KasirInventoryPage() {
  const [produkList, setProdukList] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('semua');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/produk');
      if (res?.berhasil && Array.isArray(res.data)) {
        setProdukList(res.data);
      } else {
        setProdukList([]);
      }
    } catch {
      setProdukList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProduk = produkList.filter((p) => {
    const matchesSearch =
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search));

    if (!matchesSearch) return false;

    if (categoryFilter === 'semua') return true;
    if (categoryFilter === 'kritis') return p.stok <= p.stok_minimum;
    return p.kategori?.toLowerCase() === categoryFilter.toLowerCase();
  });

  const kritisCount = produkList.filter(p => p.stok <= p.stok_minimum).length;

  return (
    <div className="max-w-md mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <div>
          <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-poppins)]">
            Katalog Produk
          </h1>
          <p className="text-xs text-gray-400">Total {produkList.length} produk terdaftar</p>
        </div>
        {kritisCount > 0 && (
          <button
            onClick={() => setCategoryFilter('kritis')}
            className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-[#EF4444] border border-red-100 rounded-full text-xs font-bold"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {kritisCount} Stok Kritis
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari produk / barcode..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]/30"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {[
          { id: 'semua', label: 'Semua Produk' },
          { id: 'kritis', label: `Stok Kritis (${kritisCount})` },
          { id: 'makanan', label: 'Makanan' },
          { id: 'minuman', label: 'Minuman' },
          { id: 'sembako', label: 'Sembako' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border',
              categoryFilter === cat.id
                ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-xs'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Mobile Compact Product List (Zero Horizontal Scroll!) */}
      {filteredProduk.length > 0 ? (
        <div className="space-y-2.5">
          {filteredProduk.map((p) => {
            const sj = p.satuan_jual && p.satuan_jual.length > 0 ? p.satuan_jual[0] : {};
            const isKritis = p.stok <= p.stok_minimum;

            return (
              <div
                key={p.id}
                className={cn(
                  'bg-white rounded-2xl p-3 border shadow-xs flex items-center justify-between gap-3 transition-all hover:border-[#16A34A]',
                  isKritis ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
                )}
              >
                {/* Product Thumbnail */}
                <ProdukThumb nama={p.nama} className="w-12 h-12 rounded-xl text-xs" />

                {/* Main Product Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{p.nama}</h4>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">
                      {p.barcode || 'NO-BARCODE'}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        isKritis ? 'bg-red-100 text-[#EF4444]' : 'bg-emerald-50 text-[#16A34A]'
                      )}
                    >
                      Stok: {p.stok} {p.satuan_dasar?.nama || 'pcs'}
                    </span>
                  </div>
                </div>

                {/* Pricing Details */}
                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-[#16A34A]">
                    {formatRupiah(sj.harga_ecer || p.harga || 0)}
                  </p>
                  {sj.harga_grosir && (
                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                      Grosir {formatRupiah(sj.harga_grosir)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-xs">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">Produk Tidak Ditemukan</h4>
          <p className="text-xs text-gray-400">Tidak ada barang yang cocok dengan kata kunci pencarian.</p>
        </div>
      )}
    </div>
  );
}
