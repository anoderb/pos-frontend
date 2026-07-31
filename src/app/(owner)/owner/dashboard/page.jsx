'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Plus,
  ClipboardCheck,
  RotateCcw,
  Handshake,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import { api } from '@/lib/api';

export default function OwnerDashboardPage() {
  const [periodeFilter, setPeriodeFilter] = useState('hari_ini');
  const [stats, setStats] = useState({
    omset: 0,
    labaBersih: 0,
    totalTx: 0,
    stokKritis: 0,
  });
  const [topBestSeller, setTopBestSeller] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, [periodeFilter]);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const dashRes = await api.get('/owner/dashboard').catch(() => null);

      const dash = dashRes?.data || dashRes || {};

      setStats({
        omset: Number(dash.omzet_hari_ini || dash.omset || 0),
        labaBersih: Number(dash.estimasi_laba || dash.laba_bersih || 0),
        totalTx: Number(dash.total_transaksi_hari_ini || dash.totalTx || 0),
        stokKritis: Number(dash.total_stok_kritis || 0),
      });

      setTopBestSeller(Array.isArray(dash.stok_kritis_list) ? dash.stok_kritis_list : (Array.isArray(dash.top_best_seller) ? dash.top_best_seller : []));
    } catch {
      setStats({ omset: 0, labaBersih: 0, totalTx: 0, stokKritis: 0 });
      setTopBestSeller([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header Greeting & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-poppins)]">
            Executive Dashboard
          </h1>
          <p className="text-xs text-gray-400">Ringkasan performa keuangan & operasional toko Anda</p>
        </div>

        {/* Period Filter */}
        <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-xs self-start sm:self-auto">
          {[
            { id: 'hari_ini', label: 'Hari Ini' },
            { id: 'minggu_ini', label: 'Minggu Ini' },
            { id: 'bulan_ini', label: 'Bulan Ini' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPeriodeFilter(p.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                periodeFilter === p.id
                  ? 'bg-[#16A34A] text-white shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Omset Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-400">Total Omset</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatRupiah(stats.omset)}</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <span>Perkembangan hari ini</span>
          </div>
        </div>

        {/* Laba Bersih Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-400">Laba Bersih Est.</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-bold text-[#16A34A]">{formatRupiah(stats.labaBersih)}</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <span>Margin {stats.omset > 0 ? Math.round((stats.labaBersih / stats.omset) * 100) : 0}%</span>
          </div>
        </div>

        {/* Total Transaksi Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-400">Transaksi</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900">{stats.totalTx} Struk</p>
          {stats.totalTx > 0 ? (
            <p className="text-[10px] text-gray-400 font-medium">
              Rata-rata: {formatRupiah(Math.round(stats.omset / stats.totalTx))}/tx
            </p>
          ) : (
            <p className="text-[10px] text-gray-400 font-medium">Belum ada transaksi</p>
          )}
        </div>

        {/* Stok Kritis Card */}
        <Link href="/owner/produk" className="bg-white rounded-2xl p-4 border border-red-100 bg-red-50/20 shadow-xs space-y-2 hover:border-red-300 transition-all block">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-red-600">Stok Kritis</span>
            <div className="w-8 h-8 rounded-xl bg-red-100 text-[#EF4444] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-bold text-[#EF4444]">{stats.stokKritis} Produk</p>
          <p className="text-[10px] text-red-500 font-semibold">Perlu restok segera →</p>
        </Link>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Aksi Manajerial Cepat</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Link
            href="/owner/produk"
            className="p-3 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 border border-gray-100 rounded-xl flex items-center gap-2.5 transition-all text-gray-700 hover:text-[#16A34A]"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">Tambah Produk</p>
              <p className="text-[10px] text-gray-400">Atur multi-harga</p>
            </div>
          </Link>

          <Link
            href="/owner/stock-opname"
            className="p-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-100 rounded-xl flex items-center gap-2.5 transition-all text-gray-700 hover:text-blue-600"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">Stock Opname</p>
              <p className="text-[10px] text-gray-400">Audit stok 3-tahap</p>
            </div>
          </Link>

          <Link
            href="/owner/return-supplier"
            className="p-3 bg-gray-50 hover:bg-amber-50 hover:border-amber-200 border border-gray-100 rounded-xl flex items-center gap-2.5 transition-all text-gray-700 hover:text-amber-600"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">Return Supplier</p>
              <p className="text-[10px] text-gray-400">Retur barang rusak</p>
            </div>
          </Link>

          <Link
            href="/owner/konsinyasi"
            className="p-3 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 border border-gray-100 rounded-xl flex items-center gap-2.5 transition-all text-gray-700 hover:text-indigo-600"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Handshake className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">Konsinyasi</p>
              <p className="text-[10px] text-gray-400">Bagi hasil vendor</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Top Best Seller List */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Top Produk Terlaris</h3>
          <Link href="/owner/laporan" className="text-xs font-semibold text-[#16A34A] hover:underline flex items-center gap-0.5">
            Lihat Laporan Full
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {topBestSeller.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className={cn('w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center text-white', i === 0 ? 'bg-[#16A34A]' : 'bg-gray-400')}>
                  {i + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{item.nama}</h4>
                  <p className="text-[10px] text-gray-400">{item.terjual} pcs terjual</p>
                </div>
              </div>
              <p className="text-xs font-bold text-[#16A34A]">{formatRupiah(item.totalOmset)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
