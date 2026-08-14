import { create } from 'zustand';
import { api } from '../services/api';

interface AuthState {
  isLoggedIn: boolean;
  isChecking: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isChecking: true,

  login: async (username: string, password: string) => {
    const res = await api.post('/api/auth/login', { username, password });
    if (res.data.success) {
      set({ isLoggedIn: true });
    }
  },

  logout: async () => {
    await api.post('/api/auth/logout');
    set({ isLoggedIn: false });
  },

  checkAuth: async () => {
    try {
      set({ isChecking: true });
      const res = await api.get('/api/auth/me');
      set({ isLoggedIn: res.data.isLoggedIn, isChecking: false });
    } catch {
      set({ isLoggedIn: false, isChecking: false });
    }
  },
}));
