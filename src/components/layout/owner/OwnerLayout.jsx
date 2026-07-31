'use client';

import React from 'react';
import OwnerNavbar from './OwnerNavbar';
import OwnerSidebar from './OwnerSidebar';
import OwnerBottomNav from './OwnerBottomNav';

export default function OwnerLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAF9] text-gray-900 font-sans antialiased flex">
      {/* Desktop Sidebar */}
      <OwnerSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <OwnerNavbar />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-28 md:pb-8">
          {children}
        </main>
      </div>

      {/* Floating Bottom Nav for Mobile */}
      <OwnerBottomNav />
    </div>
  );
}
