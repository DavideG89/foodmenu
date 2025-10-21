export type ReservationStatus = 'NEW' | 'PREPARING' | 'READY' | 'DELIVERED';

export type ReservationItemSnapshot = {
  id: string;
  nameSnapshot: string;
  priceSnapshot: number;
  promoPriceSnapshot?: number;
  qty: number;
};

export type ReservationRecord = {
  id: string;
  status: ReservationStatus;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  pickupSlot: string;
  notes?: string;
  items: ReservationItemSnapshot[];
  subtotal: number;
  payment: 'CASH';
};

export type ReservationDraft = {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  pickupSlot?: string;
};

export type SlotSummary = {
  id: string;
  start: string;
  end: string;
  capacity: number;
  remaining: number;
};

export type SlotsResponse = {
  date: string;
  slots: SlotSummary[];
};

export type ReservationListItem = ReservationRecord;

export type CreateReservationRequest = {
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  pickupSlot: string;
  notes?: string;
  items: ReservationRecord['items'];
  payment: 'CASH';
};

export type CreateReservationResponse = ReservationRecord;

export type UpdateReservationStatusRequest = {
  status: ReservationStatus;
};
