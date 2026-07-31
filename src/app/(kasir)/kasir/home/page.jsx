'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  ShoppingCart,
  Package,
  Users,
  FileText,
  ArrowRight,
  Bell,
  Zap,
} from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';

import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function KasirHomePage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);
  const [shift, setShift] = useState(null);
  const [recentTx, setRecentTx] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setMounted(true);
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setIsLoading(true);
      const [shiftRes, txRes] = await Promise.all([
        api.get('/kasir/shift').catch(() => null),
        api.get('/transaksi').catch(() => null),
      ]);

      if (shiftRes?.berhasil && shiftRes.data) {
        setShift(shiftRes.data);
      } else {
        setShift(null);
      }

      if (txRes?.berhasil && Array.isArray(txRes.data)) {
        setRecentTx(txRes.data.slice(0, 5));
      } else {
        setRecentTx([]);
      }
    } catch {
      setShift(null);
      setRecentTx([]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalOmzet = (shift?.total_penjualan_cash || 0) + (shift?.total_penjualan_qris || 0);

  const quickActions = [
    { title: 'Kasir POS', desc: 'Scan & checkout', href: '/kasir/pos', icon: ShoppingCart, color: 'bg-emerald-50 text-[#16A34A]' },
    { title: 'Katalog Stok', desc: 'Cek stok & harga', href: '/kasir/inventory', icon: Package, color: 'bg-amber-50 text-amber-600' },
    { title: 'Pelanggan', desc: 'Cari pelanggan', href: '/kasir/pelanggan', icon: Users, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Nota Masuk', desc: 'Restok supplier', href: '/kasir/nota-masuk', icon: FileText, color: 'bg-blue-50 text-blue-600' },
  ];

  return (
    <div className="max-w-md mx-auto space-y-5">
      {/* Header Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-poppins)]">
            Halo, {user?.nama || 'Kasir'} 👋
          </h1>
          <p className="text-xs text-gray-400" suppressHydrationWarning>
            Shift aktif • {mounted ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '18:43'} WIB
          </p>
        </div>
        <Link href="/kasir/notifikasi" className="p-2 bg-white border border-gray-200 rounded-xl relative hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-white" />
        </Link>
      </div>

      {/* Shift Banner */}
      <div className="bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-2xl p-4 text-white shadow-sm">
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="w-4 h-4 text-emerald-200" />
          <span className="text-xs font-semibold text-emerald-100">{shift ? 'Shift Aktif' : 'Shift Belum Dibuka'}</span>
        </div>
        <p className="text-2xl font-bold font-[family-name:var(--font-poppins)]">{formatRupiah(totalOmzet)}</p>
        <p className="text-xs text-emerald-200 mt-0.5">
          {shift
            ? `${shift.total_transaksi || 0} Transaksi • Modal ${formatRupiah(shift.modal_awal || 0)}`
            : 'Silakan buka shift kasir baru untuk memulai transaksi'}
        </p>

        <div className="flex gap-2 mt-3">
          <Link href="/kasir/pos" className="flex-1 py-2 bg-white/20 backdrop-blur text-center rounded-xl text-xs font-semibold hover:bg-white/30 transition-colors">
            Buka POS
          </Link>
          <Link href="/kasir/shift" className="flex-1 py-2 bg-white text-[#16A34A] text-center rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors">
            {shift ? 'Rekap Shift' : 'Buka Shift'}
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 font-[family-name:var(--font-poppins)] mb-3">Akses Cepat</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs hover:border-[#16A34A] transition-all active:scale-[0.98]">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-2', item.color)}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Omzet Split */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs">
          <p className="text-[10px] text-gray-400 font-semibold uppercase">Cash Laci</p>
          <p className="text-base font-bold text-[#16A34A] mt-1">{formatRupiah(shift?.total_penjualan_cash || 0)}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs">
          <p className="text-[10px] text-gray-400 font-semibold uppercase">Non-Tunai</p>
          <p className="text-base font-bold text-sky-700 mt-1">{formatRupiah(shift?.total_penjualan_qris || 0)}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 font-[family-name:var(--font-poppins)]">Transaksi Terakhir</h3>
          <Link href="/kasir/riwayat" className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xs divide-y divide-gray-50 overflow-hidden">
          {recentTx.map(tx => (
            <Link key={tx.id} href={`/kasir/riwayat/${tx.id}`}>
              <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors">
                <div>
                  <p className="text-xs font-semibold text-gray-900 font-mono">{tx.nomor}</p>
                  <p className="text-[10px] text-gray-400">{tx.waktu} • {tx.metode.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className={cn('text-xs font-bold', tx.status === 'void' ? 'text-[#EF4444] line-through' : 'text-[#16A34A]')}>
                    {formatRupiah(tx.total)}
                  </p>
                  {tx.status === 'void' && <span className="text-[9px] text-[#EF4444] font-semibold">VOID</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
