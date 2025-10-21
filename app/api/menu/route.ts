import { NextResponse } from 'next/server';
import { getMenu } from '@/lib/server/mock-db';

export async function GET() {
  const menu = getMenu();
  return NextResponse.json(menu);
}

