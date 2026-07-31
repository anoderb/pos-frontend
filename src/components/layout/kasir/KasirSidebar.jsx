'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ShoppingCart, Receipt, Clock, Package, FileText, Users, LogOut, Store } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export default function KasirSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, toko, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const kasirNavItems = [
    { label: 'Home Operational', href: '/kasir/home', icon: Home },
    { label: 'Kasir POS', href: '/kasir/pos', icon: ShoppingCart },
    { label: 'Riwayat Struk', href: '/kasir/riwayat', icon: Receipt },
    { label: 'Shift Work', href: '/kasir/shift', icon: Clock },
    { label: 'Katalog Produk', href: '/kasir/inventory', icon: Package },
    { label: 'Nota Masuk', href: '/kasir/nota-masuk', icon: FileText },
    { label: 'Pelanggan', href: '/kasir/pelanggan', icon: Users },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen p-4 justify-between select-none">
      <div>
        <div className="flex items-center space-x-3 px-3 py-3 mb-6 bg-[#ECFDF5] rounded-2xl border border-emerald-100">
          <div className="p-2.5 bg-[#16A34A] text-white rounded-xl shadow-sm">
            <Store className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-gray-900 truncate">{toko?.nama || 'Tokiva POS'}</h2>
            <p className="text-[10px] font-semibold text-[#16A34A] uppercase">Kasir Terminal</p>
          </div>
        </div>

        <nav className="space-y-1">
          {kasirNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-[#16A34A] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-gray-400')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 truncate">{user?.nama || 'Staf Kasir'}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
