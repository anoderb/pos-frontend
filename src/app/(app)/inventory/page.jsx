'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { formatRupiah } from '@/lib/utils';
import { api } from '@/lib/api';

export default function InventoryPage() {
  const [produkList, setProdukList] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    barcode: '',
    stok: 0,
    stok_minimum: 10,
    hpp: 0,
    harga_ecer: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirm Delete Modal
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/produk');
      if (res?.berhasil && Array.isArray(res.data)) {
        setProdukList(res.data);
      } else {
        setProdukList([]);
      }
    } catch {
      setProdukList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProduk = produkList.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitProduk = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post('/owner/produk', formData);
      setIsFormOpen(false);
      setFormData({
        nama: '',
        barcode: '',
        stok: 0,
        stok_minimum: 5,
        hpp: 0,
        harga_jual_default: 0,
      });
      fetchProduk();
    } catch (err) {
      alert('Gagal menyimpan produk: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduk = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await api.delete(`/owner/produk/${deleteId}`);
      setDeleteId(null);
      fetchProduk();
    } catch (err) {
      alert('Gagal menghapus produk: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Manajemen Inventori & Produk</h1>
          <p className="text-xs text-gray-500">Kelola master produk, stok, barcode, dan harga jual</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsFormOpen(true)}>
          Tambah Produk Baru
        </Button>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <Input
            placeholder="Cari berdasarkan nama atau kode barcode produk..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Table
        headers={['Kode Barcode', 'Nama Produk', 'Stok Tersedia', 'HPP Average', 'Harga Jual', 'Status', 'Aksi']}
        data={filteredProduk}
        isLoading={isLoading}
        emptyMessage="Belum ada data produk terdaftar."
        renderRow={(p) => {
          const hargaJual = p.satuan_jual && p.satuan_jual.length > 0
            ? p.satuan_jual[0].harga_ecer
            : 0;

          return (
            <tr key={p.id} className="hover:bg-gray-50/50">
              <td className="px-5 py-3.5 text-xs font-mono text-gray-500">
                {p.barcode || '-'}
              </td>
              <td className="px-5 py-3.5 font-bold text-gray-900">{p.nama}</td>
              <td className="px-5 py-3.5 font-bold">
                <span className={p.stok <= p.stok_minimum ? 'text-[#EF4444]' : 'text-gray-900'}>
                  {p.stok} {p.satuan_dasar?.nama || 'pcs'}
                </span>
              </td>
              <td className="px-5 py-3.5 text-gray-500">{formatRupiah(p.hpp)}</td>
              <td className="px-5 py-3.5 font-bold text-[#16A34A]">{formatRupiah(hargaJual)}</td>
              <td className="px-5 py-3.5">
                <Badge status={p.stok <= p.stok_minimum ? 'danger' : 'success'}>
                  {p.stok <= p.stok_minimum ? 'Stok Kritis' : 'Normal'}
                </Badge>
              </td>
              <td className="px-5 py-3.5 space-x-2">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(p.id)}
                  className="p-1.5 text-gray-400 hover:text-[#EF4444] hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          );
        }}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Tambah Produk Baru"
        size="md"
      >
        <form onSubmit={handleSubmitProduk} className="space-y-4">
          <Input
            label="Nama Produk"
            placeholder="Indomie Goreng Spasial 85g"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            required
          />

          <Input
            label="Kode Barcode"
            placeholder="089686010018"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Stok Awal"
              type="number"
              value={formData.stok}
              onChange={(e) => setFormData({ ...formData, stok: Number(e.target.value) })}
            />
            <Input
              label="Stok Minimum Warning"
              type="number"
              value={formData.stok_minimum}
              onChange={(e) => setFormData({ ...formData, stok_minimum: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Estimasi HPP (Modal)"
              type="number"
              prefix="Rp"
              value={formData.hpp}
              onChange={(e) => setFormData({ ...formData, hpp: Number(e.target.value) })}
            />
            <Input
              label="Harga Jual Ecer"
              type="number"
              prefix="Rp"
              value={formData.harga_jual_default}
              onChange={(e) => setFormData({ ...formData, harga_jual_default: Number(e.target.value) })}
              required
            />
          </div>

          <div className="pt-2">
            <Button variant="primary" fullWidth size="lg" isLoading={isSubmitting}>
              Simpan Produk Baru
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Nonaktifkan Produk Ini?"
        message="Produk tidak akan lagi tampil di katalog POS kasir."
        confirmText="Ya, Hapus"
        isDanger
        isLoading={isDeleting}
        onConfirm={handleDeleteProduk}
      />
    </div>
  );
}
