'use client';

import React, { useEffect } from 'react';
import KasirLayout from '@/components/layout/kasir/KasirLayout';
import OwnerLayout from '@/components/layout/owner/OwnerLayout';
import { useAuthStore } from '@/store/authStore';

export default function AppLayout({ children }) {
  const { initAuth, user } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Dispatch ke layout khusus Kasir jika role === 'kasir'
  if (user?.role === 'kasir') {
    return <KasirLayout>{children}</KasirLayout>;
  }

  // Dispatch ke layout khusus Owner jika role === 'owner' (Default)
  return <OwnerLayout>{children}</OwnerLayout>;
}
