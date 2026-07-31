'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import KasirLayout from '@/components/layout/kasir/KasirLayout';
import { useAuthStore } from '@/store/authStore';
import { Store } from 'lucide-react';

export default function KasirRouteGroupLayout({ children }) {
  const router = useRouter();
  const { initAuth, user, token, isInitialized } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (isInitialized && (!user || !token)) {
      router.replace('/login');
    }
  }, [isInitialized, user, token, router]);

  // Loading state saat inisialisasi session auth
  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-[#16A34A] text-white rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <Store className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-gray-500">Memeriksa Sesi Kasir...</p>
        </div>
      </div>
    );
  }

  return <KasirLayout>{children}</KasirLayout>;
}
