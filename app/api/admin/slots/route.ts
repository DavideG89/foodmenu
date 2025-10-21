import { NextRequest, NextResponse } from 'next/server';
import { getSlotConfig, updateSlotConfig } from '@/lib/server/mock-db';

const validateConfig = (payload: Partial<ReturnType<typeof getSlotConfig>>) => {
  if (payload.startHour && !/^\d{2}:\d{2}$/.test(payload.startHour)) {
    throw new Error('Formato orario di inizio non valido');
  }
  if (payload.endHour && !/^\d{2}:\d{2}$/.test(payload.endHour)) {
    throw new Error('Formato orario di fine non valido');
  }
  if (payload.slotSize !== undefined && payload.slotSize <= 0) {
    throw new Error('Durata slot non valida');
  }
  if (payload.capacity !== undefined && payload.capacity <= 0) {
    throw new Error('Capienza slot non valida');
  }
  if (payload.daysOfWeek) {
    const isValid = payload.daysOfWeek.every((day) => day >= 0 && day <= 6);
    if (!isValid) {
      throw new Error('Giorni della settimana non validi');
    }
  }
};

export async function GET() {
  return NextResponse.json(getSlotConfig());
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as Partial<ReturnType<typeof getSlotConfig>>;

  try {
    validateConfig(payload);
    const config = updateSlotConfig(payload);
    return NextResponse.json(config);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore inatteso';
    return NextResponse.json({ message }, { status: 400 });
  }
}

