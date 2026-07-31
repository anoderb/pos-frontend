'use client';

import React from 'react';
import KasirSidebar from './KasirSidebar';
import KasirNavbar from './KasirNavbar';
import KasirBottomNav from './KasirBottomNav';

export default function KasirLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      <KasirSidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <KasirNavbar />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
      <KasirBottomNav />
    </div>
  );
}
