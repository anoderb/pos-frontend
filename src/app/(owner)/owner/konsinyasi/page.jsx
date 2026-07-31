'use client';

import React, { useState } from 'react';
import {
  Handshake,
  Plus,
  Building2,
  DollarSign,
  TrendingUp,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';

export default function OwnerKonsinyasiPage() {
  const [vendorList, setVendorList] = useState([]);

  const totalOmsetKonsinyasi = vendorList.reduce((acc, v) => acc + (v.terjualQty * v.hargaJual), 0);
  const totalKomisiToko = vendorList.reduce((acc, v) => acc + (v.terjualQty * v.hargaJual * (v.komisiTokoPct / 100)), 0);
  const totalSetoranVendor = totalOmsetKonsinyasi - totalKomisiToko;

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
        <div>
          <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-poppins)]">
            Konsinyasi / Barang Titip Jual
          </h1>
          <p className="text-xs text-gray-400">Pengelolaan mitra titipan, hitung terjual & pembagian komisi toko</p>
        </div>

        <button
          onClick={() => alert('Fitur Tambah Vendor Konsinyasi Baru')}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#16A34A] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#15803D] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Barang Titipan</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-400">Total Omset Konsinyasi</span>
          <p className="text-lg font-extrabold text-gray-900 mt-1">{formatRupiah(totalOmsetKonsinyasi)}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-100 bg-emerald-50/30 shadow-xs">
          <span className="text-[11px] font-semibold text-[#16A34A]">Komisi Bersih Toko</span>
          <p className="text-lg font-extrabold text-[#16A34A] mt-1">{formatRupiah(totalKomisiToko)}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-indigo-100 bg-indigo-50/30 shadow-xs">
          <span className="text-[11px] font-semibold text-indigo-600">Total Setoran Ke Vendor</span>
          <p className="text-lg font-extrabold text-indigo-700 mt-1">{formatRupiah(totalSetoranVendor)}</p>
        </div>
      </div>

      {/* Vendor List */}
      <div className="space-y-3">
        {vendorList.map((item) => {
          const totalJual = item.terjualQty * item.hargaJual;
          const komisiToko = totalJual * (item.komisiTokoPct / 100);
          const setoranVendor = totalJual - komisiToko;

          return (
            <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{item.vendor}</h4>
                    <p className="text-[10px] text-gray-400">{item.produk}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  Komisi Toko {item.komisiTokoPct}%
                </span>
              </div>

              {/* Progress Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-medium text-gray-400 block">Titip / Terjual</span>
                  <span className="font-bold text-gray-900">{item.titipQty} / <span className="text-[#16A34A]">{item.terjualQty}</span></span>
                </div>
                <div className="p-2 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-medium text-gray-400 block">Sisa Stok</span>
                  <span className="font-bold text-gray-700">{item.sisaQty} pcs</span>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <span className="text-[10px] font-medium text-emerald-600 block">Bagian Toko</span>
                  <span className="font-bold text-[#16A34A]">{formatRupiah(komisiToko)}</span>
                </div>
              </div>

              {/* Settlement Footer */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-500">Wajib Diberikan Ke Vendor: <strong className="text-gray-900">{formatRupiah(setoranVendor)}</strong></span>
                <button
                  onClick={() => alert(`Setoran sebesar ${formatRupiah(setoranVendor)} ke ${item.vendor} telah diselesaikan!`)}
                  className="px-3 py-1.5 bg-[#16A34A] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#15803D]"
                >
                  Bayar Setoran
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
