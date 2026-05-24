import { create } from 'zustand';
import { authAPI, setToken } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,

  login: async ({ email, password }) => {
    set({ loading: true });
    const { data } = await authAPI.login({ email, password });
    setToken(data.token);
    set({ user: data.user, token: data.token, loading: false });
    return data;
  },

  logout: () => {
    setToken(null);
    set({ user: null, token: null });
  },
}));
