'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wifi, WifiOff, Store, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const router = useRouter();
  const { user, toko, logout } = useAuthStore();
  const [isOnline, setIsOnline] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    router.replace('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
      {/* Brand & Toko Name (Mobile Header) */}
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-[#16A34A] text-white rounded-xl">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900 truncate">
            {toko?.nama || 'Tokiva POS'}
          </h1>
          <p className="text-[10px] text-gray-500 hidden sm:block">
            Kasir Cerdas UMKM (tokiva.biz.id)
          </p>
        </div>
      </div>

      {/* Connection Indicator & User Info */}
      <div className="flex items-center space-x-3">
        {/* Status Online/Offline */}
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            isOnline
              ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
          }`}
          title={isOnline ? 'Terhubung ke server online' : 'Mode Offline lokal aktif'}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Mode</span>
            </>
          )}
        </div>

        {/* User Pill (Clickable with Profile Popover & Logout) */}
        <div className="relative pl-2 border-l border-gray-100">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 focus:outline-none group active:scale-95 transition-transform"
            title="Menu Profil & Logout"
          >
            <div className="w-8 h-8 rounded-full bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center font-extrabold text-xs border border-emerald-200 shadow-xs">
              {user?.nama ? user.nama.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-gray-900 leading-tight">{user?.nama}</p>
              <p className="text-[10px] text-gray-500 capitalize">{user?.role}</p>
            </div>
          </button>

          {/* Profile Dropdown Popover */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center space-x-3 p-2 bg-emerald-50/70 rounded-xl mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center font-extrabold text-sm shrink-0 border border-emerald-200 shadow-xs">
                    {user?.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">{user?.nama || 'Pengguna'}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email || 'user@tokiva.biz.id'}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-100 text-[#16A34A] text-[9px] font-extrabold rounded-full uppercase">
                      {user?.role || 'Pengguna'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Keluar Akun (Logout)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
