import type { ReservationItemSnapshot } from '@/lib/types/reservation';

export const calculateReservationSubtotal = (items: ReservationItemSnapshot[]) =>
  items.reduce(
    (total, item) => total + (item.promoPriceSnapshot ?? item.priceSnapshot) * item.qty,
    0
  );

