'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, Phone, Edit, UserPlus, Award, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api';

import FeedbackModal from '@/components/ui/FeedbackModal';
import ConfirmModal from '@/components/ui/ConfirmModal';

function CustomerAvatar({ nama }) {
  const initials = (nama || 'P').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="w-11 h-11 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0 select-none">
      {initials}
    </div>
  );
}

export default function KasirPelangganPage() {
  const [pelangganList, setPelangganList] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Form Modal (Tambah & Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nama: '', no_hp: '', alamat: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedback, setFeedback] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    fetchPelanggan();
  }, []);

  const fetchPelanggan = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/kasir/pelanggan');
      const data = Array.isArray(res) ? res : (res?.data || []);
      setPelangganList(data);
    } catch {
      setPelangganList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPelanggan = pelangganList.filter(
    (c) =>
      c.nama.toLowerCase().includes(search.toLowerCase()) ||
      (c.no_hp && c.no_hp.includes(search))
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ nama: '', no_hp: '', alamat: '' });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (pelanggan) => {
    setEditingId(pelanggan.id);
    setFormData({ nama: pelanggan.nama, no_hp: pelanggan.no_hp || '', alamat: pelanggan.alamat || '' });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      setFeedback({ isOpen: true, type: 'error', title: 'Validasi Gagal', message: 'Nama pelanggan wajib diisi!' });
      return;
    }
    try {
      setIsSubmitting(true);
      if (editingId) {
        await api.put(`/kasir/pelanggan/${editingId}`, formData);
        setFeedback({ isOpen: true, type: 'success', title: 'Berhasil!', message: 'Data pelanggan berhasil diperbarui.' });
      } else {
        await api.post('/kasir/pelanggan', formData);
        setFeedback({ isOpen: true, type: 'success', title: 'Berhasil!', message: 'Pelanggan baru berhasil ditambahkan.' });
      }
      setIsFormOpen(false);
      fetchPelanggan();
    } catch (err) {
      setFeedback({ isOpen: true, type: 'error', title: 'Gagal Menyimpan', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <div>
          <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-poppins)]">
            Manajemen Pelanggan
          </h1>
          <p className="text-xs text-gray-400">Total {pelangganList.length} pelanggan terdaftar</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#16A34A] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#15803D] active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama / no. whatsapp..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]/30"
        />
      </div>

      {/* Mobile Compact Customer Card List (Zero Horizontal Scroll!) */}
      {filteredPelanggan.length > 0 ? (
        <div className="space-y-2.5">
          {filteredPelanggan.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs flex items-center justify-between gap-3 hover:border-[#16A34A] transition-all"
            >
              {/* Customer Avatar */}
              <CustomerAvatar nama={c.nama} />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{c.nama}</h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 shrink-0">
                    <Award className="w-3 h-3" />
                    {c.poin || 0} Poin
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-500">
                  {c.no_hp ? (
                    <span className="flex items-center gap-1 font-mono text-gray-700">
                      <Phone className="w-3 h-3 text-[#16A34A]" />
                      {c.no_hp}
                    </span>
                  ) : (
                    <span className="text-gray-300">Tanpa No. HP</span>
                  )}
                </div>

                {c.alamat && (
                  <p className="text-[10px] text-gray-400 mt-1 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-300 shrink-0" />
                    {c.alamat}
                  </p>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => handleOpenEdit(c)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
                title="Edit Pelanggan"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-xs">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">Pelanggan Tidak Ditemukan</h4>
          <p className="text-xs text-gray-400">Belum ada data pelanggan terdaftar.</p>
        </div>
      )}

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap Pelanggan"
            placeholder="Ibu Rahma"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            required
          />
          <Input
            label="No. WhatsApp / HP"
            placeholder="081234567890"
            value={formData.no_hp}
            onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
          />
          <Input
            label="Alamat Lengkap"
            placeholder="Jl. Merdeka No. 12"
            value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
          />
          <Button variant="primary" fullWidth size="lg" isLoading={isSubmitting}>
            {editingId ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
          </Button>
        </form>
      </Modal>

      {/* Feedback Modal Popup */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
      />
    </div>
  );
}
