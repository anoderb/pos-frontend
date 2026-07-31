'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, Mail, Lock, LogIn } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FeedbackModal from '@/components/ui/FeedbackModal';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, initAuth, user, token } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [feedback, setFeedback] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    initAuth();
  }, []);

  // Autoredirect jika sudah login
  useEffect(() => {
    if (user && token) {
      if (user.role === 'owner') {
        router.replace('/owner/dashboard');
      } else {
        router.replace('/kasir/home');
      }
    }
  }, [user, token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Email dan password wajib diisi');
      return;
    }

    try {
      setIsLoading(true);
      const userProfile = await login(email, password);
      setFeedback({
        isOpen: true,
        type: 'success',
        title: 'Login Berhasil!',
        message: `Selamat datang kembali, ${userProfile?.nama || 'Pengguna'}!`,
      });
      setTimeout(() => {
        if (userProfile?.role === 'owner') {
          router.replace('/owner/dashboard');
        } else {
          router.replace('/kasir/home');
        }
      }, 800);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal login. Cek email & password Anda.');
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Gagal Login',
        message: err.message || 'Email atau password tidak sesuai.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 shadow-xl border-gray-100/80">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="p-3 bg-[#16A34A] text-white rounded-2xl shadow-md mb-3">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tokiva POS</h1>
        <p className="text-xs text-gray-500 mt-1">Kasir Cerdas untuk UMKM Modern (tokiva.biz.id)</p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-[#EF4444] rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Alamat Email"
          type="email"
          placeholder="email@toko.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isLoading}
            icon={LogIn}
          >
            Masuk ke Aplikasi
          </Button>
        </div>
      </form>

      {/* Footer Register Link */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-600">
          Belum punya akun toko?{' '}
          <Link href="/register" className="font-bold text-[#16A34A] hover:underline">
            Daftar Toko Baru
          </Link>
        </p>
      </div>

      {/* Feedback Modal Popup */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
      />
    </Card>
  );
}
