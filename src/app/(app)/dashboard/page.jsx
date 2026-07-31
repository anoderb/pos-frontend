'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Clock,
  Package,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import { formatRupiah } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

const DEFAULT_DASHBOARD = {
  omzet_hari_ini: 0,
  total_transaksi_hari_ini: 0,
  total_stok_kritis: 0,
  stok_kritis_list: [],
  shift_aktif: null,
};

export default function DashboardPage() {
  const { isOwner } = useAuthStore();
  const [dataWidget, setDataWidget] = useState(DEFAULT_DASHBOARD);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/owner/dashboard');
      if (res?.berhasil && res.data) {
        setDataWidget(res.data);
      } else {
        setDataWidget(DEFAULT_DASHBOARD);
      }
    } catch {
      setDataWidget(DEFAULT_DASHBOARD);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Dashboard Analytics Owner</h1>
          <p className="text-xs text-gray-500">Ringkasan performa penjualan & status toko hari ini</p>
        </div>
        <Button variant="mint" size="sm" onClick={fetchDashboardData}>
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          variant="stat"
          title="Omzet Hari Ini"
          subtitle="Total Pendapatan Bersih"
          icon={DollarSign}
        >
          <p className="text-xl font-black text-[#16A34A] mt-2">
            {formatRupiah(dataWidget?.omzet_hari_ini)}
          </p>
        </Card>

        <Card
          variant="stat"
          title="Total Transaksi"
          subtitle="Jumlah Struk Selesai"
          icon={ShoppingCart}
        >
          <p className="text-xl font-black text-gray-900 mt-2">
            {dataWidget?.total_transaksi_hari_ini || 0} Struk
          </p>
        </Card>

        <Card
          variant="stat"
          title="Stok Kritis"
          subtitle="Produk < Stok Minimum"
          icon={AlertTriangle}
        >
          <div className="flex items-center justify-between mt-2">
            <p className="text-xl font-black text-[#EF4444]">
              {dataWidget?.total_stok_kritis || 0} Produk
            </p>
            {dataWidget?.total_stok_kritis > 0 && (
              <Badge status="danger">Perlu Restok</Badge>
            )}
          </div>
        </Card>

        <Card
          variant="stat"
          title="Shift Aktif"
          subtitle="Status Kasir Bertugas"
          icon={Clock}
        >
          <div className="mt-2">
            {dataWidget?.shift_aktif ? (
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {dataWidget.shift_aktif.kasir?.nama || 'Kasir'}
                </p>
                <Badge status="success" size="sm">
                  Aktif Buka
                </Badge>
              </div>
            ) : (
              <p className="text-xs font-semibold text-gray-400">Tidak ada shift buka</p>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
          <Package className="w-4 h-4 text-[#EF4444]" />
          <span>Daftar Produk Stok Kritis (Segera Beli ke Supplier)</span>
        </h3>

        <Table
          headers={['Nama Produk', 'Sisa Stok Fisik', 'Stok Minimum Warning', 'Aksi']}
          data={dataWidget?.stok_kritis_list || []}
          isLoading={isLoading}
          emptyMessage="Seluruh stok produk berada dalam batas aman! 🎉"
          renderRow={(item) => (
            <tr key={item.id} className="hover:bg-gray-50/50">
              <td className="px-5 py-3.5 font-bold text-gray-900">{item.nama}</td>
              <td className="px-5 py-3.5 font-bold text-[#EF4444]">{item.stok}</td>
              <td className="px-5 py-3.5 text-gray-500">{item.stok_minimum}</td>
              <td className="px-5 py-3.5">
                <Button variant="mint" size="sm">
                  Restok Nota Masuk
                </Button>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}
