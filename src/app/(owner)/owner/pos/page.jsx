'use client';

import React from 'react';
import KasirPosPage from '@/app/(kasir)/kasir/pos/page';

/**
 * Dedicated Owner POS Direct Route (/owner/pos)
 * Reuses KasirPosPage engine while maintaining OwnerLayout & OwnerBottomNav consistency.
 */
export default function OwnerPosPage() {
  return <KasirPosPage />;
}
