'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, Share2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Input from '@/components/ui/Input';
import { formatRupiah } from '@/lib/utils';
import { api } from '@/lib/api';

export default function KasirDetailRiwayatPage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [alasanVoid, setAlasanVoid] = useState('');
  const [isVoiding, setIsVoiding] = useState(false);

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/transaksi/${id}`);
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

  const handleVoidTx = async () => {
    if (!alasanVoid) {
      alert('Alasan void wajib diisi!');
      return;
    }
    try {
      setIsVoiding(true);
      await api.post(`/transaksi/${id}/void`, { alasan_void: alasanVoid });
      alert('Transaksi berhasil di-void!');
      setIsVoidModalOpen(false);
      fetchDetail();
    } catch (err) {
      alert('Gagal void transaksi: ' + (err.response?.data?.pesan || err.message));
    } finally {
      setIsVoiding(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-3xl mx-auto py-12 text-center text-gray-500 text-xs">Memuat detail transaksi...</div>;
  }

  if (!detail) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500 space-y-3">
        <p className="text-sm font-bold text-gray-700">Detail transaksi tidak ditemukan.</p>
        <Link href="/kasir/riwayat" className="text-xs font-bold text-[#16A34A] underline">Kembali ke Riwayat</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/kasir/riwayat" className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" icon={Printer} onClick={() => window.print()}>
            Cetak Ulang Struk
          </Button>
          {detail.status === 'selesai' && (
            <Button variant="danger" icon={AlertTriangle} onClick={() => setIsVoidModalOpen(true)}>
              Void Transaksi
            </Button>
          )}
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-start justify-between pb-6 border-b border-gray-100">
          <div>
            <Badge status={detail.status === 'selesai' ? 'success' : 'danger'} size="md">
              {detail.status === 'selesai' ? 'Transaksi Selesai' : 'Transaksi Divoid'}
            </Badge>
            <h2 className="text-xl font-black text-gray-900 mt-2 font-mono">{detail.nomor_transaksi}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{detail.tanggal} | Kasir: {detail.kasir_nama}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400">Metode Bayar</span>
            <p className="text-sm font-extrabold text-gray-900 uppercase">{detail.metode_bayar}</p>
          </div>
        </div>

        {/* Tabel Items */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Item Pembelian</h4>
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100 py-2">
            {detail.items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-gray-900">{item.nama_produk}</h5>
                  <p className="text-gray-400">{item.qty} x {formatRupiah(item.harga_satuan)}</p>
                </div>
                <span className="font-bold text-gray-900">{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Rincian Pembayaran */}
        <div className="space-y-2 pt-2 text-xs">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal Item</span>
            <span className="font-semibold text-gray-900">{formatRupiah(detail.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Diskon Transaksi</span>
            <span className="font-semibold text-gray-900">{formatRupiah(detail.diskon_total)}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
            <span>TOTAL STRUK</span>
            <span className="text-[#16A34A]">{formatRupiah(detail.total)}</span>
          </div>
          <div className="flex justify-between text-gray-500 pt-1">
            <span>Nominal Diterima ({detail.metode_bayar})</span>
            <span className="font-semibold text-gray-900">{formatRupiah(detail.nominal_bayar)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Kembalian</span>
            <span className="font-semibold text-[#16A34A]">{formatRupiah(detail.kembalian)}</span>
          </div>
        </div>
      </Card>

      {/* Modal Confirm Void */}
      <ConfirmModal
        isOpen={isVoidModalOpen}
        onClose={() => setIsVoidModalOpen(false)}
        title="Void / Batalkan Transaksi Ini?"
        message="Stok produk akan direstorasi otomatis. Tindakan ini tidak dapat dibatalkan!"
        confirmText="Ya, Void Transaksi"
        isDanger
        isLoading={isVoiding}
        onConfirm={handleVoidTx}
      >
        <div className="mt-3">
          <Input
            label="Alasan Void / Pembatalan"
            placeholder="Salah input barang / pembeli batal..."
            value={alasanVoid}
            onChange={(e) => setAlasanVoid(e.target.value)}
            required
          />
        </div>
      </ConfirmModal>
    </div>
  );
}
