'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Tag,
  ArrowLeft,
  Filter,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function KasirNotifikasiPage() {
  const [notifList, setNotifList] = useState([]);
  const [filter, setFilter] = useState('semua');

  const filteredNotif = notifList.filter(n => {
    if (filter === 'semua') return true;
    return n.tipe === filter;
  });

  const unreadCount = notifList.filter(n => n.isUnread).length;

  const handleMarkAllRead = () => {
    setNotifList(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  const handleClearAll = () => {
    setNotifList([]);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/kasir/pos" className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-gray-900 font-[family-name:var(--font-poppins)]">
              Notifikasi Kasir
            </h1>
            <p className="text-[11px] text-gray-400">
              {unreadCount > 0 ? `${unreadCount} pesan belum dibaca` : 'Semua notifikasi sudah dibaca'}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-xs font-semibold text-[#16A34A] hover:underline"
          >
            <CheckCheck className="w-4 h-4" />
            Tandai Dibaca
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {[
          { id: 'semua', label: 'Semua' },
          { id: 'stok', label: 'Stok Kritis' },
          { id: 'shift', label: 'Shift' },
          { id: 'harga', label: 'Harga' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border',
              filter === item.id
                ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-xs'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filteredNotif.length > 0 ? (
        <div className="space-y-3">
          {filteredNotif.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setNotifList(prev => prev.map(n => n.id === item.id ? { ...n, isUnread: false } : n))}
                className={cn(
                  'p-4 rounded-2xl border transition-all cursor-pointer relative shadow-xs',
                  item.isUnread ? 'bg-white border-[#16A34A]/30 ring-1 ring-[#16A34A]/20' : 'bg-gray-50/70 border-gray-100'
                )}
              >
                {item.isUnread && (
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#16A34A] rounded-full animate-pulse" />
                )}

                <div className="flex gap-3 items-start">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border', item.badgeColor)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-xs font-bold text-gray-900">{item.judul}</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.pesan}</p>
                    <p className="text-[10px] font-semibold text-gray-400 mt-2">{item.waktu}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-xs">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">Tidak Ada Notifikasi</h4>
          <p className="text-xs text-gray-400">Belum ada pemberitahuan baru di kategori ini.</p>
        </div>
      )}

      {/* Clear All Footer Button */}
      {notifList.length > 0 && (
        <div className="text-center pt-2">
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#EF4444] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Bersihkan Notifikasi
          </button>
        </div>
      )}
    </div>
  );
}
