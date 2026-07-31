'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OwnerLayout from '@/components/layout/owner/OwnerLayout';
import { useAuthStore } from '@/store/authStore';
import { Store } from 'lucide-react';

export default function OwnerRouteGroupLayout({ children }) {
  const router = useRouter();
  const { initAuth, user, token, isInitialized } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (!user || !token) {
        router.replace('/login');
      } else if (user.role !== 'owner') {
        // Staf Kasir mencoba mengakses area Owner
        router.replace('/kasir/home');
      }
    }
  }, [isInitialized, user, token, router]);

  // Loading state saat inisialisasi session auth
  if (!isInitialized || !user || user.role !== 'owner') {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-[#16A34A] text-white rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <Store className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-gray-500">Memeriksa Hak Akses Owner...</p>
        </div>
      </div>
    );
  }

  return <OwnerLayout>{children}</OwnerLayout>;
}
