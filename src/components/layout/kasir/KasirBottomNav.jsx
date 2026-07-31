'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ShoppingCart,
  Package,
  Grid,
  X,
  FileText,
  Users,
  Clock,
  Receipt,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function KasirBottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isOwner = user?.role === 'owner' || !user?.role; // Default true for owner preview

  // Drawer menu items exclusively for Kasir role
  const kasirDrawerItems = [
    {
      label: 'Riwayat Struk',
      desc: 'Lihat seluruh transaksi shift ini',
      href: '/kasir/riwayat',
      icon: Receipt,
      color: 'bg-emerald-50 text-[#16A34A]',
    },
    {
      label: 'Nota Masuk',
      desc: 'Terima restok barang dari supplier',
      href: '/kasir/nota-masuk',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Pelanggan',
      desc: 'Cari & tambah pelanggan baru',
      href: '/kasir/pelanggan',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Rekap Shift Saya',
      desc: 'Buka / tutup shift & rekap kas',
      href: '/kasir/shift',
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        />
      )}

      {/* Drawer Menu Lainnya untuk Kasir (Bottom Sheet) */}
      <div
        className={cn(
          'md:hidden fixed left-0 right-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 p-5 transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto pb-36',
          isDrawerOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        )}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5" />
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Menu Lainnya Kasir</h3>

        <div className="grid grid-cols-2 gap-3">
          {kasirDrawerItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsDrawerOpen(false)}
                className="p-4 bg-white border border-gray-100 hover:border-[#16A34A] shadow-xs rounded-2xl flex flex-col justify-between transition-all active:scale-[0.98] group"
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', item.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#16A34A]">
                    {item.label}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-tight">
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Nav Bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-full px-4 py-2 flex items-center justify-between">
          {[
            { label: 'Home', href: '/kasir/home', icon: Home },
            { label: 'Kasir', href: '/kasir/pos', icon: ShoppingCart },
            { label: 'Inventory', href: '/kasir/inventory', icon: Package },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsDrawerOpen(false)}
                className="flex flex-col items-center justify-center flex-1 py-1"
              >
                <div
                  className={cn(
                    'p-2 rounded-full transition-all duration-150',
                    isActive ? 'bg-[#ECFDF5] text-[#16A34A]' : 'text-gray-400 hover:text-gray-700'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-semibold mt-0.5',
                    isActive ? 'text-[#16A34A]' : 'text-gray-400'
                  )}
                >
                  {item.label}
                </span>
                {isActive && <div className="w-1.5 h-1.5 bg-[#16A34A] rounded-full mt-0.5" />}
              </Link>
            );
          })}

          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex flex-col items-center justify-center flex-1 py-1 focus:outline-none"
          >
            <div
              className={cn(
                'p-2 rounded-full transition-all duration-200',
                isDrawerOpen
                  ? 'bg-[#16A34A] text-white shadow-md rotate-90'
                  : 'text-gray-400 hover:text-gray-700'
              )}
            >
              {isDrawerOpen ? <X className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </div>
            <span
              className={cn(
                'text-[10px] font-semibold mt-0.5',
                isDrawerOpen ? 'text-[#16A34A]' : 'text-gray-400'
              )}
            >
              {isDrawerOpen ? 'Tutup' : 'Lainnya'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
