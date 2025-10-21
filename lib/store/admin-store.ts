'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPersistStorage } from '@/lib/store/storage';

type AdminState = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const storage = createPersistStorage('session');

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false })
    }),
    {
      name: 'foodmenu-admin-auth',
      storage
    }
  )
);

