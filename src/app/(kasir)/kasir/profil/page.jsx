'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Store, Shield, LogOut, Key, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { useAuthStore } from '@/store/authStore';

export default function KasirProfilPage() {
  const router = useRouter();
  const { user, toko, logout } = useAuthStore();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordLama || !passwordBaru) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setPasswordLama('');
      setPasswordBaru('');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-gray-900">Profil & Sesi Staf Kasir</h1>
        <p className="text-xs text-gray-500">Informasi akun pengguna kasir, sesi aktif, dan keamanan</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-[#ECFDF5] text-[#16A34A] rounded-2xl flex items-center justify-center font-black text-2xl border border-emerald-100">
            {user?.nama?.substring(0, 2).toUpperCase() || 'KS'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-gray-900">{user?.nama || 'Siti Rahma'}</h2>
              <Badge status="success" size="sm">
                Staf Kasir
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'kasir1@tokiva.biz.id'}</p>
            <p className="text-[11px] text-gray-400 mt-1">ID Kasir: KSR-890123</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Toko Tempat Bertugas</span>
            </div>
            <p className="text-sm font-black text-gray-900">{toko?.nama || 'Toko Tokiva Jaya'}</p>
            <p className="text-[11px] text-gray-500">{toko?.alamat || 'Jl. Raya Utama No. 45'}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Hak Akses Role</span>
            </div>
            <p className="text-sm font-black text-gray-900">Staf Operasional Kasir (POS)</p>
            <p className="text-[11px] text-gray-500">Akses terbatas ke POS, Shift, Restok, & Pelanggan</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-gray-100">
          <Button variant="secondary" icon={Key} onClick={() => setIsPasswordModalOpen(true)}>
            Ubah Password
          </Button>

          <Button variant="danger" icon={LogOut} onClick={handleLogout}>
            Keluar Sesi Kasir
          </Button>
        </div>
      </Card>

      {/* Modal Ubah Password */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setIsSuccess(false);
        }}
        title="Ubah Password Akun Kasir"
        size="sm"
      >
        {isSuccess ? (
          <div className="flex flex-col items-center text-center space-y-3 py-4">
            <div className="p-3 bg-emerald-100 text-[#16A34A] rounded-full">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Password Berhasil Diperbarui!</h4>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setIsPasswordModalOpen(false);
                setIsSuccess(false);
              }}
            >
              Selesai
            </Button>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Password Lama Saat Ini"
              type="password"
              placeholder="••••••••"
              value={passwordLama}
              onChange={(e) => setPasswordLama(e.target.value)}
              required
            />
            <Input
              label="Password Baru"
              type="password"
              placeholder="••••••••"
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
              required
            />
            <Button variant="primary" fullWidth size="lg" isLoading={isSubmitting}>
              Simpan Password Baru
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
