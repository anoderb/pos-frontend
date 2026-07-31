import { create } from 'zustand';
import { api } from '@/lib/api';

export const DEMO_MASTER_ADMIN = {
  id: 'demo-master-admin-id',
  nama: 'Master Admin Tokiva (Demo)',
  email: 'admin.demo@tokiva.biz.id',
  role: 'master_admin',
};

export const useAdminAuthStore = create((set, get) => ({
  admin: null,
  token: null,
  isInitialized: false,
  isLoading: false,

  // Initialize Admin Auth state
  initAdminAuth: async () => {
    if (typeof window === 'undefined') return;

    const savedToken = localStorage.getItem('tokiva_admin_token');
    const savedAdmin = localStorage.getItem('tokiva_admin_profile');

    if (savedToken && savedAdmin) {
      try {
        const adminObj = JSON.parse(savedAdmin);
        set({
          token: savedToken,
          admin: adminObj,
          isInitialized: true,
        });

        // Verify profile against backend API
        if (!savedToken.startsWith('demo-admin-token-')) {
          api.get('/admin/auth/profil', {
            headers: { Authorization: `Bearer ${savedToken}` }
          })
          .then((res) => {
            if (res.berhasil && res.data) {
              localStorage.setItem('tokiva_admin_profile', JSON.stringify(res.data));
              set({ admin: res.data });
            }
          })
          .catch(() => {
            get().logoutAdmin();
          });
        }
      } catch (err) {
        get().logoutAdmin();
      }
    } else {
      set({ isInitialized: true, admin: null, token: null });
    }
  },

  // Login Admin
  loginAdmin: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/admin/auth/login', { email, password });

      if (res.berhasil && res.data) {
        const { token, admin } = res.data;

        localStorage.setItem('tokiva_admin_token', token);
        localStorage.setItem('tokiva_admin_profile', JSON.stringify(admin));

        set({
          admin,
          token,
          isLoading: false,
        });
        return { success: true };
      }
      set({ isLoading: false });
      return { success: false, message: res.pesan || 'Login Gagal' };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.message || 'Terjadi kesalahan saat login Admin' };
    }
  },

  // Login Demo Mode for Testing
  loginDemoAdmin: () => {
    const demoToken = 'demo-admin-token-super';
    localStorage.setItem('tokiva_admin_token', demoToken);
    localStorage.setItem('tokiva_admin_profile', JSON.stringify(DEMO_MASTER_ADMIN));

    set({
      admin: DEMO_MASTER_ADMIN,
      token: demoToken,
      isInitialized: true,
      isLoading: false,
    });
  },

  // Logout Admin
  logoutAdmin: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tokiva_admin_token');
      localStorage.removeItem('tokiva_admin_profile');
    }
    set({
      admin: null,
      token: null,
      isInitialized: true,
      isLoading: false,
    });
  },
}));
