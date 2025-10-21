import { NextRequest, NextResponse } from 'next/server';
import { createReservation } from '@/lib/server/mock-db';
import { notifyReservationCreated } from '@/lib/notifications/notifier';
import type { CreateReservationRequest } from '@/lib/types/reservation';

const validateReservationPayload = (payload: CreateReservationRequest) => {
  if (!payload.customer?.name?.trim()) {
    return 'Nome cliente obbligatorio';
  }
  if (!payload.customer?.phone?.trim()) {
    return 'Telefono obbligatorio';
  }
  if (!payload.pickupSlot) {
    return 'Slot di ritiro obbligatorio';
  }
  if (!payload.items?.length) {
    return 'Aggiungi almeno un articolo';
  }
  return null;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as CreateReservationRequest;
  const validationError = validateReservationPayload(payload);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  try {
    const reservation = createReservation(payload);
    notifyReservationCreated(reservation);
    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore inatteso';
    return NextResponse.json({ message }, { status: 400 });
  }
}

