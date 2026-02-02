import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponse } from '../api/services/authService';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  setUser: (user: UserResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' } // Saves user to localStorage automatically
  )
);