'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Store } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { initAuth, user, token, isInitialized } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (isInitialized) {
      if (user && token) {
        if (user.role === 'owner') {
          router.replace('/owner/dashboard');
        } else {
          router.replace('/kasir/home');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [isInitialized, user, token, router]);

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-14 h-14 bg-[#16A34A] text-white rounded-3xl flex items-center justify-center shadow-xl animate-pulse">
          <Store className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-poppins)]">Tokiva POS</h1>
        <p className="text-xs font-semibold text-gray-400">Mengarahkan ke Halaman Toko...</p>
      </div>
    </div>
  );
}
