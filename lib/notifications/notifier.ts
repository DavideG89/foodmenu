import type { ReservationRecord, ReservationStatus } from '@/lib/types/reservation';

type NotificationChannel = 'email' | 'whatsapp';

type NotificationPayload = {
  channel: NotificationChannel;
  to: string;
  template: string;
  data: Record<string, unknown>;
};

const logNotification = ({ channel, to, template, data }: NotificationPayload) => {
  console.info(`[notify/${channel}]`, {
    to,
    template,
    data
  });
};

export const notifyReservationCreated = (reservation: ReservationRecord) => {
  const baseData = {
    reservationId: reservation.id,
    pickupSlot: reservation.pickupSlot,
    subtotal: reservation.subtotal
  };

  if (reservation.customer.email) {
    logNotification({
      channel: 'email',
      to: reservation.customer.email,
      template: 'reservation-created',
      data: baseData
    });
  }

  if (reservation.customer.phone) {
    logNotification({
      channel: 'whatsapp',
      to: reservation.customer.phone,
      template: 'reservation-created',
      data: {
        ...baseData,
        status: reservation.status
      }
    });
  }
};

export const notifyReservationStatusChange = (
  reservation: ReservationRecord,
  status: ReservationStatus
) => {
  const payload = {
    reservationId: reservation.id,
    pickupSlot: reservation.pickupSlot,
    status
  };

  if (reservation.customer.email) {
    logNotification({
      channel: 'email',
      to: reservation.customer.email,
      template: 'reservation-status-updated',
      data: payload
    });
  }

  if (reservation.customer.phone) {
    logNotification({
      channel: 'whatsapp',
      to: reservation.customer.phone,
      template: 'reservation-status-updated',
      data: payload
    });
  }
};

