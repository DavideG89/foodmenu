import { NextRequest, NextResponse } from 'next/server';
import { updateReservationStatus } from '@/lib/server/mock-db';
import { notifyReservationStatusChange } from '@/lib/notifications/notifier';
import type { UpdateReservationStatusRequest } from '@/lib/types/reservation';

type Params = {
  params: {
    id: string;
  };
};

export async function POST(request: NextRequest, { params }: Params) {
  const payload = (await request.json()) as UpdateReservationStatusRequest;
  if (!payload.status) {
    return NextResponse.json({ message: 'Stato obbligatorio' }, { status: 400 });
  }

  try {
    const updated = updateReservationStatus(params.id, payload.status);
    notifyReservationStatusChange(updated, payload.status);
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore inatteso';
    const status = message === 'Prenotazione non trovata' ? 404 : 400;
    return NextResponse.json({ message }, { status });
  }
}
