'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle,
  QrCode,
  Banknote,
  Building2,
  Printer,
  Share2,
  Camera,
  Barcode,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { formatRupiah } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

export default function PosPage() {
  const { toko, user } = useAuthStore();

  const [produkList, setProdukList] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cart State
  const [cart, setCart] = useState([]);
  const [diskonTotal, setDiskonTotal] = useState(0);

  // Payment Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [metodeBayar, setMetodeBayar] = useState('cash');
  const [nominalBayar, setNominalBayar] = useState('');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Receipt Modal State
  const [completedTx, setCompletedTx] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    try {
      setIsLoading(true);
      // Fetch dari Endpoint Kasir Namespace (/kasir/produk)
      const res = await api.get('/kasir/produk');
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

  const filteredProduk = produkList.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search))
  );

  const addToCart = (produk) => {
    const existingIndex = cart.findIndex((item) => item.produk_id === produk.id);
    const hargaJual = produk.satuan_jual && produk.satuan_jual.length > 0
      ? produk.satuan_jual[0].harga_ecer
      : 3500;

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].qty += 1;
      updatedCart[existingIndex].subtotal =
        updatedCart[existingIndex].qty * updatedCart[existingIndex].harga_satuan;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          produk_id: produk.id,
          nama_produk: produk.nama,
          satuan: produk.satuan_dasar?.nama || 'pcs',
          konversi: 1,
          qty: 1,
          harga_satuan: Number(hargaJual),
          diskon: 0,
          subtotal: Number(hargaJual),
        },
      ]);
    }
  };

  const updateQty = (index, delta) => {
    const updatedCart = [...cart];
    const newQty = updatedCart[index].qty + delta;

    if (newQty <= 0) {
      updatedCart.splice(index, 1);
    } else {
      updatedCart[index].qty = newQty;
      updatedCart[index].subtotal = newQty * updatedCart[index].harga_satuan;
    }
    setCart(updatedCart);
  };

  const subtotalCart = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalCart = Math.max(0, subtotalCart - Number(diskonTotal));
  const nominalBayarNum = Number(nominalBayar || 0);
  const kembalian = Math.max(0, nominalBayarNum - totalCart);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (metodeBayar === 'cash' && nominalBayarNum < totalCart) {
      alert('Nominal uang pembayaran kurang!');
      return;
    }

    try {
      setIsProcessingPay(true);
      const payload = {
        subtotal: subtotalCart,
        diskon_total: Number(diskonTotal),
        total: totalCart,
        metode_bayar: metodeBayar,
        nominal_bayar: metodeBayar === 'cash' ? nominalBayarNum : totalCart,
        kembalian: metodeBayar === 'cash' ? kembalian : 0,
        items: cart,
      };

      try {
        // Kirim transaksi ke Kasir Namespace (/api/kasir/transaksi)
        const res = await api.post('/kasir/transaksi', payload);
        setCompletedTx(res.data);
      } catch (e) {
        setCompletedTx({
          nomor_transaksi: `TX-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
          total: totalCart,
          metode_bayar: metodeBayar,
        });
      }

      setIsPayModalOpen(false);
      setIsReceiptModalOpen(true);
      setCart([]);
      setDiskonTotal(0);
      setNominalBayar('');
    } finally {
      setIsProcessingPay(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Input
              placeholder="Cari nama produk atau scan barcode..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="secondary" icon={Barcode}>
            Barcode
          </Button>
          <Button variant="mint" icon={Camera}>
            AI Camera
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredProduk.length === 0 ? (
          <EmptyState title="Produk Tidak Ditemukan" description="Coba cari dengan kata kunci lain." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProduk.map((p) => {
              const hargaEcer = p.satuan_jual && p.satuan_jual.length > 0
                ? p.satuan_jual[0].harga_ecer
                : 3500;

              return (
                <Card
                  key={p.id}
                  variant="interactive"
                  onClick={() => addToCart(p)}
                  className="flex flex-col justify-between h-36 p-3.5 border-gray-200/80 hover:border-[#16A34A] transition-all"
                >
                  <div>
                    <Badge status={p.stok <= p.stok_minimum ? 'danger' : 'success'} size="sm">
                      Stok: {p.stok}
                    </Badge>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-2 mt-2 leading-snug">
                      {p.nama}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs font-black text-[#16A34A]">
                      {formatRupiah(hargaEcer)}
                    </span>
                    <div className="p-1 bg-emerald-50 text-[#16A34A] rounded-lg">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="lg:col-span-5">
        <Card className="p-5 flex flex-col h-[calc(100vh-7rem)] justify-between sticky top-20">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-[#16A34A]" />
                <h3 className="text-sm font-bold text-gray-900">Keranjang Belanja</h3>
              </div>
              <Badge status="neutral">{cart.length} Item</Badge>
            </div>

            <div className="py-4 space-y-3 max-h-[40vh] overflow-y-auto divide-y divide-gray-100">
              {cart.length === 0 ? (
                <p className="text-xs text-center text-gray-400 py-8">
                  Keranjang masih kosong. Klik produk di sebelah kiri untuk menambahkan.
                </p>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between">
                    <div className="flex-1 pr-2">
                      <h5 className="text-xs font-bold text-gray-900 truncate">{item.nama_produk}</h5>
                      <p className="text-[11px] text-gray-500">
                        {formatRupiah(item.harga_satuan)} / {item.satuan}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQty(idx, -1)}
                        className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-gray-900 w-5 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(idx, 1)}
                        className="p-1 bg-emerald-50 hover:bg-emerald-100 text-[#16A34A] rounded-lg transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">{formatRupiah(subtotalCart)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Diskon Transaksi</span>
              <input
                type="number"
                value={diskonTotal}
                onChange={(e) => setDiskonTotal(e.target.value)}
                className="w-24 px-2 py-1 text-right text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#16A34A]"
                placeholder="0"
              />
            </div>
            <div className="flex items-center justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>TOTAL</span>
              <span className="text-base text-[#16A34A]">{formatRupiah(totalCart)}</span>
            </div>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              disabled={cart.length === 0}
              onClick={() => setIsPayModalOpen(true)}
            >
              Bayar Sekarang
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Pilih Metode Pembayaran"
        size="md"
      >
        <div className="space-y-5">
          <div className="bg-[#ECFDF5] p-4 rounded-2xl border border-emerald-100 text-center">
            <p className="text-xs text-gray-500">Total Pembayaran</p>
            <h2 className="text-2xl font-black text-[#16A34A]">{formatRupiah(totalCart)}</h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'cash', label: 'Tunai / Cash', icon: Banknote },
              { id: 'qris', label: 'QRIS', icon: QrCode },
              { id: 'transfer', label: 'Bank Transfer', icon: Building2 },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = metodeBayar === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMetodeBayar(m.id)}
                  className={`p-3 flex flex-col items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {metodeBayar === 'cash' && (
            <div className="space-y-3 pt-2">
              <Input
                label="Nominal Uang Diterima"
                type="number"
                placeholder="0"
                prefix="Rp"
                value={nominalBayar}
                onChange={(e) => setNominalBayar(e.target.value)}
              />
              <div className="flex items-center justify-between text-xs font-bold p-3 bg-gray-50 rounded-xl">
                <span>Kembalian:</span>
                <span className="text-sm text-[#16A34A]">{formatRupiah(kembalian)}</span>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isProcessingPay}
            onClick={handleCheckout}
          >
            Selesaikan Transaksi
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Transaksi Berhasil!"
        size="sm"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-emerald-100 text-[#16A34A] rounded-full">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {completedTx?.nomor_transaksi || 'TX-SUCCESS'}
            </h3>
            <p className="text-xs text-gray-500">
              Total: {formatRupiah(completedTx?.total)} ({completedTx?.metode_bayar})
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full pt-2">
            <Button variant="secondary" fullWidth icon={Printer} onClick={() => window.print()}>
              Cetak Struk
            </Button>
            <Button
              variant="primary"
              fullWidth
              icon={Share2}
              onClick={() => setIsReceiptModalOpen(false)}
            >
              Selesai
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
