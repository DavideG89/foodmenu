'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from './cart-store';
import type {
  ReservationDraft,
  ReservationItemSnapshot,
  ReservationRecord
} from '@/lib/types/reservation';
import { createPersistStorage } from '@/lib/store/storage';

type ReservationState = {
  draft: ReservationDraft;
  lastReservation: ReservationRecord | null;
  updateDraft: (updates: Partial<ReservationDraft>) => void;
  resetDraft: () => void;
  setLastReservation: (reservation: ReservationRecord | null) => void;
  snapshotCartItems: (items: CartItem[]) => ReservationItemSnapshot[];
};

const createDefaultDraft = (): ReservationDraft => ({
  name: '',
  phone: '',
  email: '',
  notes: '',
  pickupSlot: undefined
});

const storage = createPersistStorage('session');

export const useReservationStore = create<ReservationState>()(
  persist(
    (set, get) => ({
      draft: createDefaultDraft(),
      lastReservation: null,
      updateDraft: (updates) =>
        set({
          draft: { ...get().draft, ...updates }
        }),
      resetDraft: () => set({ draft: createDefaultDraft() }),
      setLastReservation: (reservation) => set({ lastReservation: reservation }),
      snapshotCartItems: (items) =>
        items.map(({ product, quantity }) => ({
          id: product.id,
          nameSnapshot: product.name,
          priceSnapshot: product.price,
          promoPriceSnapshot: product.promoPrice,
          qty: quantity
        }))
    }),
    {
      name: 'foodmenu-reservation',
      partialize: (state) => ({
        draft: state.draft,
        lastReservation: state.lastReservation
      }),
      storage
    }
  )
);
