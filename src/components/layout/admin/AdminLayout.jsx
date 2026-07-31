'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, isInitialized, initAdminAuth } = useAdminAuthStore();

  useEffect(() => {
    initAdminAuth();
  }, [initAdminAuth]);

  useEffect(() => {
    if (isInitialized && !admin && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isInitialized, admin, pathname, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold tracking-wider text-slate-400">MEMUAT TOKIVA MASTER CONTROL HUB...</p>
      </div>
    );
  }

  if (!admin && pathname !== '/admin/login') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex selection:bg-emerald-500/30 selection:text-emerald-200">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-950">
        <AdminHeader title={title} />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
