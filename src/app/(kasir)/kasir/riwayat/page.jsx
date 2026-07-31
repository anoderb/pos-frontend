'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Receipt, Calendar, Filter, Eye } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import { formatRupiah } from '@/lib/utils';

import { api } from '@/lib/api';

export default function KasirRiwayatPage() {
  const [riwayat, setRiwayat] = useState([]);
  const [search, setSearch] = useState('');
  const [filterMetode, setFilterMetode] = useState('semua');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const fetchRiwayat = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/kasir/transaksi');
      const data = Array.isArray(res) ? res : (res?.data || []);
      setRiwayat(data);
    } catch {
      setRiwayat([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRiwayat = riwayat.filter((tx) => {
    const matchSearch =
      (tx.nomor_transaksi || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.created_at || '').includes(search);
    const matchMetode =
      filterMetode === 'semua' || tx.metode_bayar === filterMetode;
    return matchSearch && matchMetode;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Riwayat Transaksi Kasir</h1>
          <p className="text-xs text-gray-500">Daftar seluruh struk transaksi penjualan shift aktif Anda</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8">
          <Input
            placeholder="Cari berdasarkan nomor struk atau tanggal..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sm:col-span-4 flex items-center space-x-2">
          <select
            value={filterMetode}
            onChange={(e) => setFilterMetode(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#16A34A] font-semibold text-gray-700"
          >
            <option value="semua">Semua Metode Bayar</option>
            <option value="cash">Tunai / Cash</option>
            <option value="qris">QRIS</option>
            <option value="transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Table List Riwayat */}
      <Table
        headers={['Nomor Struk', 'Waktu Transaksi', 'Jumlah Item', 'Metode Bayar', 'Total Pembayaran', 'Status', 'Aksi']}
        data={filteredRiwayat}
        emptyMessage="Belum ada transaksi di shift ini."
        renderRow={(tx) => (
          <tr key={tx.id} className="hover:bg-gray-50/50">
            <td className="px-5 py-3.5 font-bold text-gray-900 text-xs font-mono">{tx.nomor_transaksi}</td>
            <td className="px-5 py-3.5 text-xs text-gray-600">{tx.tanggal}</td>
            <td className="px-5 py-3.5 text-xs font-semibold text-gray-900">{tx.total_item} Item</td>
            <td className="px-5 py-3.5 text-xs font-semibold uppercase">{tx.metode_bayar}</td>
            <td className="px-5 py-3.5 font-bold text-[#16A34A]">{formatRupiah(tx.total)}</td>
            <td className="px-5 py-3.5">
              <Badge status={tx.status === 'selesai' ? 'success' : 'danger'}>
                {tx.status === 'selesai' ? 'Selesai' : 'Voided'}
              </Badge>
            </td>
            <td className="px-5 py-3.5">
              <Link href={`/kasir/riwayat/${tx.id}`}>
                <Button variant="mint" size="sm" icon={Eye}>
                  Detail Struk
                </Button>
              </Link>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
