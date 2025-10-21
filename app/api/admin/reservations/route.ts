import { NextResponse } from 'next/server';
import { listReservations } from '@/lib/server/mock-db';

export async function GET() {
  return NextResponse.json({ reservations: listReservations() });
}

