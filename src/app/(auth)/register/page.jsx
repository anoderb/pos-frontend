'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    nama_toko: '',
    alamat_toko: '',
    no_telp_toko: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id || e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.nama || !formData.email || !formData.password || !formData.nama_toko) {
      setErrorMsg('Semua kolom yang berbintang wajib diisi');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/auth/register', formData);
      setSuccessMsg('Registrasi Toko Berhasil! Silakan masuk menggunakan akun Anda.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal meregistrasi toko. Cek kembali data Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 shadow-xl border-gray-100/80">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="p-3 bg-[#16A34A] text-white rounded-2xl shadow-md mb-2">
          <Store className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-black text-gray-900">Registrasi Toko Baru</h1>
        <p className="text-xs text-gray-500 mt-0.5">Daftarkan Toko Anda & Mulai Bertransaksi</p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-[#EF4444] rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-[#16A34A] rounded-xl text-xs font-semibold">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          id="nama"
          label="Nama Owner / Pemilik"
          placeholder="Budi Santoso"
          icon={User}
          value={formData.nama}
          onChange={handleChange}
          required
        />

        <Input
          id="email"
          label="Email Toko / Pemilik"
          type="email"
          placeholder="budi@tokiva.biz.id"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          id="password"
          label="Password (Minimal 8 karakter)"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <hr className="my-2 border-gray-100" />

        <Input
          id="nama_toko"
          label="Nama Toko / Usaha"
          placeholder="Toko Kelontong Berkah"
          icon={Store}
          value={formData.nama_toko}
          onChange={handleChange}
          required
        />

        <Input
          id="no_telp_toko"
          label="No. Telepon / WhatsApp Toko"
          placeholder="081234567890"
          icon={Phone}
          value={formData.no_telp_toko}
          onChange={handleChange}
        />

        <Input
          id="alamat_toko"
          label="Alamat Lengkap Toko"
          placeholder="Jl. Sukajadi No. 12, Bandung"
          icon={MapPin}
          value={formData.alamat_toko}
          onChange={handleChange}
        />

        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isLoading}
            icon={ArrowRight}
          >
            Daftarkan Toko Sekarang
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-bold text-[#16A34A] hover:underline">
            Masuk ke Aplikasi
          </Link>
        </p>
      </div>
    </Card>
  );
}
