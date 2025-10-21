import { NextRequest, NextResponse } from 'next/server';
import { getSlotsForDate } from '@/lib/server/mock-db';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);

  try {
    const slots = getSlotsForDate(date);
    return NextResponse.json({ date, slots });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore inatteso';
    return NextResponse.json({ message }, { status: 400 });
  }
}

