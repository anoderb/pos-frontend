'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Save,
  CheckCheck,
} from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import Button from '@/components/ui/Button';

import { api } from '@/lib/api';

export default function OwnerStockOpnamePage() {
  const [opnameList, setOpnameList] = useState([]);
  const [activeOpname, setActiveOpname] = useState(null);
  const [items, setItems] = useState([]);
  const [tahap, setTahap] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinalized, setIsFinalized] = useState(false);

  // Fetch daftar opname
  const fetchOpnameList = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/owner/opname');
      const data = res?.berhasil && Array.isArray(res.data) ? res.data : (Array.isArray(res?.data) ? res.data : []);
      setOpnameList(data);
      const draft = data.find(o => o.status === 'draft' || o.status === 'review');
      if (draft) {
        setActiveOpname(draft);
        setTahap(draft.status === 'review' ? 2 : 1);
        fetchOpnameDetail(draft.id);
      }
    } catch { setOpnameList([]); }
    finally { setIsLoading(false); }
  };

  // Fetch detail opname + items
  const fetchOpnameDetail = async (opnameId) => {
    try {
      const res = await api.get(`/owner/opname/${opnameId}`);
      const data = res?.berhasil ? res.data : (res?.data || null);
      if (data) {
        setActiveOpname(data);
        setItems((data.items || []).map(item => ({
          id: item.produk_id,
          nama: item.nama_produk,
          stokSistem: Number(item.stok_sistem || 0),
          stokFisik: item.stok_fisik !== null ? Number(item.stok_fisik) : Number(item.stok_sistem || 0),
          selisih: Number(item.selisih || 0),
          nilaiSelisih: Number(item.nilai_selisih || 0),
        })));
      }
    } catch {}
  };

  // 1️⃣ Buat opname baru
  const handleBuatOpname = async () => {
    try {
      const res = await api.post('/owner/opname', { tanggal: new Date().toISOString().slice(0, 10) });
      if (res?.berhasil && res.data) {
        setActiveOpname(res.data);
        setTahap(2);
        fetchOpnameDetail(res.data.id);
      }
    } catch (err) { alert('Gagal: ' + (err?.message || 'Terjadi kesalahan')); }
  };

  // 2️⃣ Update stok fisik per produk (local state)
  const handleUpdateFisik = (id, val) => {
    const numVal = Math.max(0, Number(val) || 0);
    setItems(prev => prev.map(item => item.id === id ? { ...item, stokFisik: numVal } : item));
  };

  // Simpan fisik + submit review
  const handleSimpanFisik = async () => {
    try {
      for (const item of items) {
        await api.put(`/owner/opname/${activeOpname.id}/item/${item.id}`, { stok_fisik: item.stokFisik });
      }
      await api.post(`/owner/opname/${activeOpname.id}/review`);
      setTahap(3);
      fetchOpnameDetail(activeOpname.id);
    } catch (err) { alert('Gagal: ' + (err?.message || 'Terjadi kesalahan')); }
  };

  const totalSelisihUnit = items.reduce((acc, item) => acc + (item.stokFisik - item.stokSistem), 0);
  const totalNilaiSelisih = items.reduce((acc, item) => acc + (item.nilaiSelisih || 0), 0);

  // 3️⃣ Finalize
  const handleFinalApprove = async () => {
    try {
      await api.post(`/owner/opname/${activeOpname.id}/final`);
      setIsFinalized(true);
      fetchOpnameList();
    } catch (err) { alert('Gagal: ' + (err?.message || 'Terjadi kesalahan')); }
  };

  useEffect(() => { fetchOpnameList(); }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
        <div>
          <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-poppins)]">
            Stock Opname 3-Tahap
          </h1>
          <p className="text-xs text-gray-400">Audit stok fisik barang vs sistem & rekonsiliasi selisih</p>
        </div>

        {tahap === 1 && (
          <button
            onClick={handleBuatOpname}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#16A34A] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#15803D] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Mulai Opname Baru</span>
          </button>
        )}
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between gap-2">
        {[
          { step: 1, title: '1. Buat Sesi Draft' },
          { step: 2, title: '2. Input Hitung Fisik' },
          { step: 3, title: '3. Penyesuaian & Approval' },
        ].map((s) => (
          <div
            key={s.step}
            onClick={() => setTahap(s.step)}
            className={cn(
              'flex-1 text-center py-2 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none',
              tahap === s.step
                ? 'bg-emerald-50 text-[#16A34A] border-emerald-200 ring-1 ring-emerald-300'
                : s.step < tahap
                ? 'bg-gray-50 text-gray-500 border-gray-200'
                : 'bg-white text-gray-400 border-gray-100'
            )}
          >
            {s.title}
          </div>
        ))}
      </div>

      {/* STEP 1: SESI LIST */}
      {tahap === 1 && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Sesi Aktif
              </span>
              <h3 className="text-sm font-bold text-gray-900">{activeOpname?.nomor_opname || 'Opname'}</h3>
              <p className="text-xs text-gray-400">
                Dibuat: {activeOpname?.created_at ? new Date(activeOpname.created_at).toLocaleDateString('id-ID') : '-'} • Status: {activeOpname?.status || '-'}
              </p>
            </div>
            <button
              onClick={() => setTahap(2)}
              className="flex items-center gap-1 px-3 py-2 bg-[#16A34A] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#15803D]"
            >
              Lanjutkan Hitung
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INPUT HITUNG FISIK */}
      {tahap === 2 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Hitung Fisik Barang di Toko
              </h3>
              <span className="text-xs text-gray-400">Total {items.length} Barang</span>
            </div>

            <div className="space-y-2.5">
              {items.map((item) => {
                const selisih = item.stokFisik - item.stokSistem;
                return (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.nama}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Stok Sistem: {item.stokSistem} pcs</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Stok Fisik</label>
                        <input
                          type="number"
                          value={item.stokFisik}
                          onChange={(e) => handleUpdateFisik(item.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-center text-gray-900 focus:outline-none focus:border-[#16A34A]"
                        />
                      </div>
                      <div className="w-16 text-right">
                        <span className="text-[9px] font-bold text-gray-400 block mb-0.5">Selisih</span>
                        <span className={cn('text-xs font-extrabold', selisih < 0 ? 'text-[#EF4444]' : selisih > 0 ? 'text-[#16A34A]' : 'text-gray-400')}>
                          {selisih > 0 ? `+${selisih}` : selisih}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSimpanFisik}
                className="flex items-center gap-1 px-4 py-2 bg-[#16A34A] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#15803D]"
              >
                Lanjut ke Review Approval
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: REKONSILIASI & APPROVAL */}
      {tahap === 3 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 font-[family-name:var(--font-poppins)]">
              Ringkasan Rekonsiliasi Opname
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                <span className="text-[10px] font-semibold text-red-600 block">Total Unit Selisih</span>
                <span className="text-lg font-extrabold text-[#EF4444]">{totalSelisihUnit} Pcs</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-[10px] font-semibold text-amber-600 block">Estimasi Nilai Selisih</span>
                <span className="text-lg font-extrabold text-amber-700">{formatRupiah(totalNilaiSelisih)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <p className="text-xs font-bold text-gray-800">Detail Barang Yang Berbeda:</p>
              {items.filter(i => i.stokFisik !== i.stokSistem).map(item => (
                <div key={item.id} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-800">{item.nama}</span>
                  <span className="font-bold text-[#EF4444]">
                    {item.stokFisik - item.stokSistem} pcs ({formatRupiah(item.nilaiSelisih)})
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleFinalApprove}
              disabled={isFinalized}
              className={cn(
                'w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all',
                isFinalized
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                  : 'bg-[#16A34A] hover:bg-[#15803D] text-white active:scale-98'
              )}
            >
              <CheckCheck className="w-4 h-4" />
              <span>{isFinalized ? 'Stock Opname Telah Disetujui ✓' : 'Setujui & Perbarui Stok Sistem'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
