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
  Bot,
  LayoutDashboard,
  Settings,
  Building2,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();
  const { user, isOwner } = useAuthStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const mainTabs = [
    { label: 'Home', href: '/dashboard', icon: Home, roles: ['owner', 'kasir'] },
    { label: 'Kasir', href: '/pos', icon: ShoppingCart, roles: ['owner', 'kasir'] },
    { label: 'Inventory', href: '/inventory', icon: Package, roles: ['owner', 'kasir'] },
  ];

  // Menu items inside "Menu Lainnya" drawer
  const drawerItems = [
    {
      label: 'Nota Masuk',
      desc: 'Tambah stok dari supplier',
      href: '/nota-masuk',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      roles: ['owner', 'kasir'],
    },
    {
      label: 'Pelanggan',
      desc: 'Lihat & kelola data pelanggan',
      href: '/pelanggan',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600',
      roles: ['owner', 'kasir'],
    },
    {
      label: 'Rekap Shift Saya',
      desc: 'Lihat rekap transaksi shift aktif',
      href: '/shift',
      icon: Clock,
      color: 'bg-emerald-50 text-[#16A34A]',
      roles: ['owner', 'kasir'],
    },
    {
      label: 'Koreksi AI',
      desc: 'Review hasil visual scanner',
      href: '/ai',
      icon: Bot,
      color: 'bg-teal-50 text-teal-600',
      roles: ['owner', 'kasir'],
    },
    {
      label: 'Supplier',
      desc: 'Daftar & histori supplier',
      href: '/supplier',
      icon: Building2,
      color: 'bg-amber-50 text-amber-600',
      roles: ['owner'],
    },
    {
      label: 'Kelola Kasir',
      desc: 'Manajemen akun staf kasir',
      href: '/pengguna',
      icon: Users,
      color: 'bg-rose-50 text-rose-600',
      roles: ['owner'],
    },
    {
      label: 'Pengaturan Toko',
      desc: 'Profil toko & warna tema',
      href: '/settings',
      icon: Settings,
      color: 'bg-purple-50 text-purple-600',
      roles: ['owner'],
    },
  ];

  const filteredDrawerItems = drawerItems.filter((item) =>
    user ? item.roles.includes(user.role) : true
  );

  return (
    <>
      {/* Backdrop for Menu Drawer */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        />
      )}

      {/* Drawer Menu Lainnya (Sliding Bottom to Top) */}
      <div
        className={cn(
          'md:hidden fixed left-0 right-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 p-5 transition-transform duration-300 ease-out max-h-[80vh] overflow-y-auto pb-24',
          isDrawerOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        )}
      >
        {/* Top Handle bar */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5" />

        <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Menu Lainnya</h3>

        {/* 2-Column Card Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredDrawerItems.map((item) => {
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

      {/* Floating Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-full px-4 py-2 flex items-center justify-between">
          {/* Main Navigation Tabs */}
          {mainTabs.map((item) => {
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
                    'p-2 rounded-full transition-all duration-150 relative',
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

          {/* Action Button 'Lainnya' / Toggle Drawer */}
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
