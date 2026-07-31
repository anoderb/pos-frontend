'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatRupiah } from '@/lib/utils';

import { api } from '@/lib/api';

export default function KasirDetailNotaMasukPage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/nota-masuk/${id}`);
      if (res?.berhasil && res.data) {
        setDetail(res.data);
      } else {
        setDetail(null);
      }
    } catch {
      setDetail(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-3xl mx-auto py-12 text-center text-gray-500 text-xs">Memuat detail nota masuk...</div>;
  }

  if (!detail) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500 space-y-3">
        <p className="text-sm font-bold text-gray-700">Detail nota masuk tidak ditemukan.</p>
        <Link href="/kasir/nota-masuk" className="text-xs font-bold text-[#16A34A] underline">Kembali ke List Nota Masuk</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/kasir/nota-masuk" className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke List Nota Masuk</span>
        </Link>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-start justify-between pb-6 border-b border-gray-100">
          <div>
            <Badge status={detail.status_bayar === 'lunas' ? 'success' : 'warning'} size="md">
              {detail.status_bayar === 'lunas' ? 'Lunas' : 'Sebagian / Hutang'}
            </Badge>
            <h2 className="text-xl font-black text-gray-900 mt-2 font-mono">{detail.nomor_nota}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Tanggal: {detail.tanggal} | Supplier: {detail.supplier.nama}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400">Total Nilai Restok</span>
            <p className="text-lg font-black text-[#16A34A]">{formatRupiah(detail.total)}</p>
          </div>
        </div>

        {/* List Item Restok */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Item Barang Diterima</h4>
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100 py-2">
            {detail.items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-gray-900">{item.nama_produk}</h5>
                  <p className="text-gray-400">{item.qty} {item.satuan} x {formatRupiah(item.harga_beli)}</p>
                </div>
                <span className="font-bold text-gray-900">{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Foto Nota Fisik */}
        <div className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-100">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
            <ImageIcon className="w-4 h-4 text-gray-500" />
            <span>Foto Nota Fisik Supplier</span>
          </div>
          <div className="h-32 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs font-semibold">
            [ Foto Nota Fisik Terlampir ]
          </div>
        </div>
      </Card>
    </div>
  );
}
