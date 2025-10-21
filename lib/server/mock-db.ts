import { randomUUID } from 'crypto';
import { categories as seedCategories, products as seedProducts, type Product } from '@/data/mockData';
import { calculateReservationSubtotal } from '@/lib/reservations';
import type {
  CreateReservationRequest,
  ReservationListItem,
  ReservationRecord,
  ReservationStatus,
  SlotSummary
} from '@/lib/types/reservation';

type SlotConfig = {
  startHour: string;
  endHour: string;
  slotSize: number;
  capacity: number;
  daysOfWeek: number[];
};

type MockDatabase = {
  menu: {
    categories: typeof seedCategories;
    items: Product[];
  };
  reservations: Map<string, ReservationRecord>;
  slotConfig: SlotConfig;
};

const DEFAULT_SLOT_CONFIG: SlotConfig = {
  startHour: '11:30',
  endHour: '22:00',
  slotSize: 30,
  capacity: 6,
  daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
};

const globalForMockDb = globalThis as typeof globalThis & {
  __mockDatabase__?: MockDatabase;
};

if (!globalForMockDb.__mockDatabase__) {
  globalForMockDb.__mockDatabase__ = {
    menu: {
      categories: seedCategories.map((category) => ({ ...category })),
      items: seedProducts.map((product) => ({ ...product }))
    },
    reservations: new Map(),
    slotConfig: { ...DEFAULT_SLOT_CONFIG }
  };
}

const db = globalForMockDb.__mockDatabase__!;

const allowedTransitions: Record<ReservationStatus, ReservationStatus[]> = {
  NEW: ['PREPARING'],
  PREPARING: ['READY'],
  READY: ['DELIVERED'],
  DELIVERED: []
};

const dateKeyFromISO = (iso: string) => iso.slice(0, 10);

const buildDateAtTime = (date: string, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const base = new Date(`${date}T00:00:00`);
  base.setHours(hours, minutes, 0, 0);
  return base;
};

export const getMenu = () => ({
  categories: db.menu.categories,
  items: db.menu.items
});

export const upsertMenuItem = (item: Product) => {
  const normalized: Product = {
    ...item,
    id: item.id || randomUUID(),
    available: item.available ?? true
  };

  const existingIndex = db.menu.items.findIndex((menuItem) => menuItem.id === normalized.id);

  if (existingIndex >= 0) {
    db.menu.items[existingIndex] = {
      ...db.menu.items[existingIndex],
      ...normalized
    };
  } else {
    db.menu.items.push(normalized);
  }

  return normalized;
};

export const deleteMenuItem = (id: string) => {
  db.menu.items = db.menu.items.filter((item) => item.id !== id);
};

export const getSlotConfig = () => db.slotConfig;

export const updateSlotConfig = (config: Partial<SlotConfig>) => {
  db.slotConfig = { ...db.slotConfig, ...config };
  return db.slotConfig;
};

export const getSlotsForDate = (date: string): SlotSummary[] => {
  const validatedDate = date || new Date().toISOString().slice(0, 10);
  const dateObj = new Date(`${validatedDate}T00:00:00`);
  if (Number.isNaN(dateObj.getTime())) {
    throw new Error('Data non valida');
  }
  const day = dateObj.getDay();
  if (!db.slotConfig.daysOfWeek.includes(day)) {
    return [];
  }

  const { startHour, endHour, slotSize, capacity } = db.slotConfig;
  const startDate = buildDateAtTime(validatedDate, startHour);
  const endDate = buildDateAtTime(validatedDate, endHour);

  if (startDate >= endDate) {
    return [];
  }

  const slots: SlotSummary[] = [];
  const reservations = Array.from(db.reservations.values());

  const cursor = new Date(startDate);
  while (cursor < endDate) {
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor);
    slotEnd.setMinutes(slotEnd.getMinutes() + slotSize);

    const slotId = slotStart.toISOString();
    const reservedCount = reservations.filter(
      (reservation) => reservation.pickupSlot === slotId
    ).length;

    slots.push({
      id: slotId,
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      capacity,
      remaining: Math.max(capacity - reservedCount, 0)
    });

    cursor.setMinutes(cursor.getMinutes() + slotSize);
  }

  return slots;
};

export const listReservations = (): ReservationListItem[] => {
  return Array.from(db.reservations.values()).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
};

export const getReservation = (id: string) => db.reservations.get(id);

export const createReservation = (payload: CreateReservationRequest) => {
  const pickupSlot = payload.pickupSlot;
  const dateKey = dateKeyFromISO(pickupSlot);
  const slots = getSlotsForDate(dateKey);
  const slot = slots.find((candidate) => candidate.id === pickupSlot);

  if (!slot) {
    throw new Error('Lo slot selezionato non è disponibile');
  }

  if (slot.remaining <= 0) {
    throw new Error('Lo slot è al completo');
  }

  const subtotal = calculateReservationSubtotal(payload.items);
  const record: ReservationRecord = {
    id: randomUUID(),
    status: 'NEW',
    createdAt: new Date().toISOString(),
    customer: payload.customer,
    pickupSlot,
    notes: payload.notes,
    items: payload.items,
    subtotal,
    payment: payload.payment
  };

  db.reservations.set(record.id, record);
  return record;
};

export const updateReservationStatus = (id: string, status: ReservationStatus) => {
  const reservation = db.reservations.get(id);
  if (!reservation) {
    throw new Error('Prenotazione non trovata');
  }

  if (reservation.status === status) {
    return reservation;
  }

  const allowed = allowedTransitions[reservation.status];
  if (!allowed.includes(status)) {
    throw new Error('Transizione di stato non valida');
  }

  const updated: ReservationRecord = {
    ...reservation,
    status
  };

  db.reservations.set(id, updated);
  return updated;
};

