'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, Banknote, Printer, CheckCircle2, Timer } from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';

export default function KasirShiftPage() {
  const [shiftAktif, setShiftAktif] = useState(null);
  const [isShiftLoading, setIsShiftLoading] = useState(true);

  useEffect(() => {
    fetchActiveShift();
  }, []);

  const fetchActiveShift = async () => {
    try {
      setIsShiftLoading(true);
      const res = await api.get('/kasir/shift');
      if (res?.berhasil && res.data) {
        setShiftAktif(res.data);
      } else {
        setShiftAktif(null);
      }
    } catch {
      setShiftAktif(null);
    } finally {
      setIsShiftLoading(false);
    }
  };

  const [elapsed, setElapsed] = useState('00:00');
  const [isBukaModalOpen, setIsBukaModalOpen] = useState(false);
  const [isTutupModalOpen, setIsTutupModalOpen] = useState(false);
  const [isZReportOpen, setIsZReportOpen] = useState(false);
  const [lastClosed, setLastClosed] = useState(null);
  const [modalAwal, setModalAwal] = useState('200000');
  const [kasAktual, setKasAktual] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Timer
  useEffect(() => {
    if (!shiftAktif) return;
    const start = new Date(shiftAktif.waktu_buka).getTime();
    const tick = () => {
      const diff = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(diff / 3600)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      setElapsed(`${h}:${m}`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [shiftAktif]);

  const totalPenjualan = (shiftAktif?.total_penjualan_cash || 0) + (shiftAktif?.total_penjualan_qris || 0);
  const rataRata = shiftAktif?.total_transaksi ? Math.round(totalPenjualan / shiftAktif.total_transaksi) : 0;
  const totalEkspektasi = (shiftAktif?.modal_awal || 0) + (shiftAktif?.total_penjualan_cash || 0);
  const kasNum = Number(kasAktual) || 0;
  const selisih = kasNum - totalEkspektasi;

  const handleBukaShift = (e) => {
    e.preventDefault();
    setIsLoading(true);
    api.post('/kasir/shift/buka', { modal_awal: Number(modalAwal) }).catch(() => {});
    setTimeout(() => {
      setShiftAktif({
        id: `SHF-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-001`,
        waktu_buka: new Date().toISOString(),
        modal_awal: Number(modalAwal),
        status: 'buka',
        total_penjualan_cash: 0,
        total_penjualan_qris: 0,
        total_transaksi: 0,
        metode_terbanyak: '-',
        metode_persen: 0,
      });
      setIsBukaModalOpen(false);
      setIsLoading(false);
    }, 600);
  };

  const handleTutupShift = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const closed = { ...shiftAktif, kas_aktual: kasNum, selisih };
    api.post('/kasir/shift/tutup', { shift_id: shiftAktif.id, kas_aktual: kasNum }).catch(() => {});
    setTimeout(() => {
      setLastClosed(closed);
      setShiftAktif(null);
      setIsTutupModalOpen(false);
      setIsZReportOpen(true);
      setIsLoading(false);
    }, 600);
  };

  const shiftDate = shiftAktif
    ? new Date(shiftAktif.waktu_buka).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
    : '';
  const shiftTime = shiftAktif
    ? new Date(shiftAktif.waktu_buka).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    : '';

  return (
    <div className="max-w-md mx-auto space-y-5">
      <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-poppins)]">Rekap Shift Saya</h1>

      {shiftAktif ? (
        <>
          {/* Shift Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header badge */}
            <div className="px-4 pt-4 pb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ECFDF5] rounded-full">
                <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-[#16A34A]">Shift Aktif</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{shiftDate}, {shiftTime}</p>
              <p className="text-xs text-gray-400 font-mono mt-0.5">#{shiftAktif.id}</p>
            </div>

            {/* Timer Row */}
            <div className="px-4 pb-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4 text-[#16A34A]" />
                </div>
                <span className="text-3xl font-bold text-gray-900 font-mono tracking-wider">{elapsed}</span>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-[10px] text-gray-400">Mulai</p>
                  <p className="text-xs font-semibold text-gray-700">{shiftTime.replace(' WIB','')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Waktu Selesai</p>
                  <p className="text-xs font-semibold text-gray-400">—</p>
                </div>
              </div>
            </div>

            {/* Stats Grid 2x2 */}
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              <div className="p-4 border-b border-gray-100">
                <p className="text-xs text-gray-400">Total Transaksi</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{shiftAktif.total_transaksi}</p>
              </div>
              <div className="p-4 border-b border-gray-100">
                <p className="text-xs text-gray-400">Total Penjualan</p>
                <p className="text-lg font-bold text-[#16A34A] mt-1">{formatRupiah(totalPenjualan)}</p>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400">Rata-rata Transaksi</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatRupiah(rataRata)}</p>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400">Metode Terbanyak</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {shiftAktif.metode_terbanyak} <span className="text-sm text-gray-400">({shiftAktif.metode_persen}%)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Tutup Shift Button */}
          <button
            onClick={() => setIsTutupModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold py-3.5 rounded-2xl transition-all shadow-sm"
          >
            <Square className="w-4 h-4" />
            Tutup Shift & Rekap Kas
          </button>
        </>
      ) : (
        /* No Shift Active */
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">Belum Ada Shift Aktif</h3>
          <p className="text-xs text-gray-400 mb-4">Buka shift kasir terlebih dahulu sebelum transaksi.</p>
          <button
            onClick={() => setIsBukaModalOpen(true)}
            className="flex items-center justify-center gap-2 mx-auto bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold py-3 px-6 rounded-2xl transition-all shadow-sm"
          >
            <Play className="w-4 h-4" />
            Buka Shift Baru
          </button>
        </div>
      )}

      {/* Modal Buka Shift */}
      <Modal isOpen={isBukaModalOpen} onClose={() => setIsBukaModalOpen(false)} title="Buka Shift Kasir Baru" size="sm">
        <form onSubmit={handleBukaShift} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Modal Awal Laci Kasir</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#16A34A]">Rp</span>
              <input
                type="number"
                value={modalAwal}
                onChange={e => setModalAwal(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:border-[#16A34A]"
                required
              />
            </div>
          </div>
          <Button variant="primary" fullWidth size="lg" isLoading={isLoading}>Mulai Shift Sekarang</Button>
        </form>
      </Modal>

      {/* Modal Tutup Shift */}
      <Modal isOpen={isTutupModalOpen} onClose={() => setIsTutupModalOpen(false)} title="Tutup Shift & Rekap Kas" size="sm">
        <form onSubmit={handleTutupShift} className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Modal Awal</span><span className="font-semibold">{formatRupiah(shiftAktif?.modal_awal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Penjualan Cash</span><span className="font-semibold">{formatRupiah(shiftAktif?.total_penjualan_cash)}</span></div>
            <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t"><span>Ekspektasi Kas</span><span className="text-[#16A34A]">{formatRupiah(totalEkspektasi)}</span></div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Kas Fisik Aktual di Laci</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#16A34A]">Rp</span>
              <input type="number" value={kasAktual} onChange={e => setKasAktual(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:border-[#16A34A]" required />
            </div>
          </div>
          {kasAktual && (
            <div className={cn('p-3 rounded-xl text-xs font-bold flex justify-between', selisih === 0 ? 'bg-emerald-50 text-[#16A34A]' : selisih > 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-[#EF4444]')}>
              <span>Selisih Kas:</span>
              <span>{selisih === 0 ? 'Pas / Sesuai' : `${selisih > 0 ? '+' : ''}${formatRupiah(selisih)}`}</span>
            </div>
          )}
          <Button variant="danger" fullWidth size="lg" isLoading={isLoading}>Selesaikan & Tutup Shift</Button>
        </form>
      </Modal>

      {/* Z-Report Modal */}
      <Modal isOpen={isZReportOpen} onClose={() => setIsZReportOpen(false)} title="Z-Report Tutup Shift" size="sm">
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 font-mono text-[11px]">
            <div className="text-center font-bold text-gray-900 border-b pb-2 text-xs">*** Z-REPORT TUTUP SHIFT ***</div>
            <div className="flex justify-between"><span>Modal Awal:</span><span>{formatRupiah(lastClosed?.modal_awal)}</span></div>
            <div className="flex justify-between"><span>Penjualan Cash:</span><span>{formatRupiah(lastClosed?.total_penjualan_cash)}</span></div>
            <div className="flex justify-between font-bold border-t pt-1"><span>Ekspektasi:</span><span>{formatRupiah((lastClosed?.modal_awal || 0) + (lastClosed?.total_penjualan_cash || 0))}</span></div>
            <div className="flex justify-between"><span>Kas Aktual:</span><span>{formatRupiah(lastClosed?.kas_aktual)}</span></div>
            <div className="flex justify-between font-bold text-[#16A34A]"><span>Selisih:</span><span>{formatRupiah(lastClosed?.selisih)}</span></div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth icon={Printer} onClick={() => window.print()}>Cetak</Button>
            <Button variant="primary" fullWidth onClick={() => setIsZReportOpen(false)}>Selesai</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
