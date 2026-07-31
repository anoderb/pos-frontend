'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Building2,
  Clock,
  FileText,
  RotateCcw,
  Handshake,
  Sliders,
  CheckSquare,
  Bot,
  Settings,
  LogOut,
  Store,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, toko, logout, isOwner } = useAuthStore();

  const navItems = [
    { label: 'Kasir POS', href: '/pos', icon: ShoppingCart, roles: ['owner', 'kasir'] },
    { label: 'Shift Work', href: '/shift', icon: Clock, roles: ['owner', 'kasir'] },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['owner'] },
    { label: 'Inventori Produk', href: '/inventory', icon: Package, roles: ['owner', 'kasir'] },
    { label: 'Nota Masuk', href: '/nota-masuk', icon: FileText, roles: ['owner', 'kasir'] },
    { label: 'Supplier', href: '/supplier', icon: Building2, roles: ['owner'] },
    { label: 'Pelanggan', href: '/pelanggan', icon: Users, roles: ['owner', 'kasir'] },
    { label: 'Retur Supplier', href: '/return-supplier', icon: RotateCcw, roles: ['owner'] },
    { label: 'Konsinyasi', href: '/konsinyasi', icon: Handshake, roles: ['owner'] },
    { label: 'Stock Adjustment', href: '/stock-adjustment', icon: Sliders, roles: ['owner'] },
    { label: 'Stock Opname', href: '/stock-opname', icon: CheckSquare, roles: ['owner'] },
    { label: 'Koreksi AI', href: '/ai', icon: Bot, roles: ['owner', 'kasir'] },
    { label: 'Kelola Kasir', href: '/pengguna', icon: Users, roles: ['owner'] },
    { label: 'Laporan & Analytics', href: '/laporan', icon: FileText, roles: ['owner'] },
    { label: 'Pengaturan Toko', href: '/settings', icon: Settings, roles: ['owner'] },
  ];

  const filteredNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen p-4 justify-between select-none">
      <div>
        {/* Header Toko Info */}
        <div className="flex items-center space-x-3 px-3 py-3 mb-6 bg-[#ECFDF5] rounded-2xl border border-emerald-100">
          <div className="p-2.5 bg-[#16A34A] text-white rounded-xl shadow-sm">
            <Store className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-gray-900 truncate">
              {toko?.nama || 'Tokiva POS'}
            </h2>
            <p className="text-[10px] font-semibold text-[#16A34A] capitalize">
              Role: {user?.role || 'kasir'}
            </p>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

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

      {/* User Profile & Logout */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 truncate">{user?.nama || 'User Tokiva'}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-gray-400 hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
            title="Keluar / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
