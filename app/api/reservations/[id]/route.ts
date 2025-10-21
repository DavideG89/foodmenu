import { NextResponse } from 'next/server';
import { getReservation } from '@/lib/server/mock-db';

type ReservationParams = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: ReservationParams) {
  const reservation = getReservation(params.id);
  if (!reservation) {
    return NextResponse.json({ message: 'Prenotazione non trovata' }, { status: 404 });
  }
  return NextResponse.json(reservation);
}

