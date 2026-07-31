'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin/AdminLayout';
import { api } from '@/lib/api';
import { CheckSquare, Check, X, Store, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminKurasiPage() {
  const [koreksiList, setKoreksiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchKurasi();
  }, []);

  const fetchKurasi = async () => {
    setIsLoading(true);
    try {
      const savedToken = localStorage.getItem('tokiva_admin_token') || localStorage.getItem('tokiva_jwt_token');
      const res = await api.get('/admin/kurasi', {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      if (res.berhasil && res.data) {
        setKoreksiList(res.data);
      }
    } catch (err) {
      // Silently handle — UI shows empty state
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const savedToken = localStorage.getItem('tokiva_admin_token') || localStorage.getItem('tokiva_jwt_token');
      await api.put(`/admin/kurasi/${id}/setujui`, {}, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      fetchKurasi();
    } catch (err) {
      alert('Gagal menyetujui koreksi: ' + err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const savedToken = localStorage.getItem('tokiva_admin_token') || localStorage.getItem('tokiva_jwt_token');
      await api.put(`/admin/kurasi/${id}/tolak`, {}, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      fetchKurasi();
    } catch (err) {
      alert('Gagal menolak koreksi: ' + err.message);
    }
  };

  const totalPages = Math.ceil(koreksiList.length / itemsPerPage) || 1;
  const currentKoreksi = koreksiList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <AdminLayout title="Kurasi Koreksi Kasir & Unknown Products">
      <div className="space-y-6">
        {/* Header Bar */}
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" /> Antrean Kurasi Koreksi Kasir
          </h2>
          <p className="text-xs text-slate-400">
            Review crowdsourced foto barang dari kamera POS saat kasir melakukan koreksi tebakan AI
          </p>
        </div>

        {/* List of Pending Corrections */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Memuat antrean koreksi kasir...
            </div>
          ) : koreksiList.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-200">Antrean Kurasi Bersih! 🎉</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Tidak ada koreksi kasir baru yang perlu dikurasi saat ini. Seluruh foto crowdsourced telah terverifikasi.
              </p>
            </div>
          ) : (
            currentKoreksi.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img src={item.foto_url} alt="Koreksi" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                        AI: {item.deteksi_ai?.prediksi || 'Unknown'} ({(item.deteksi_ai?.confidence * 100).toFixed(0)}%)
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                        Kasir: {item.produk_dipilih?.nama || 'Produk Dipilih'}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 pt-1">
                      <Store className="w-3.5 h-3.5 text-slate-400" /> {item.toko?.nama || 'Toko Kasir'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleReject(item.id)}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> Tolak Foto
                  </button>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="w-4 h-4" /> Setujui Masuk Dataset
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Kurasi Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <span>
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, koreksiList.length)} dari {koreksiList.length} Antrean
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-200 px-3">
                Halaman {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
