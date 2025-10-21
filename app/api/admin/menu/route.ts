import { NextRequest, NextResponse } from 'next/server';
import { deleteMenuItem, getMenu, upsertMenuItem } from '@/lib/server/mock-db';
import type { Product } from '@/data/mockData';

type UpsertPayload = {
  action: 'upsert';
  item: Product;
};

type DeletePayload = {
  action: 'delete';
  id: string;
};

type AdminMenuPayload = UpsertPayload | DeletePayload;

const isUpsertPayload = (payload: AdminMenuPayload): payload is UpsertPayload =>
  payload.action === 'upsert';

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as AdminMenuPayload;

  try {
    if (isUpsertPayload(payload)) {
      if (!payload.item?.name?.trim()) {
        throw new Error('Nome obbligatorio');
      }
      if (!payload.item?.categorySlug) {
        throw new Error('Categoria obbligatoria');
      }
      upsertMenuItem(payload.item);
    } else {
      if (!payload.id) {
        throw new Error('ID obbligatorio');
      }
      deleteMenuItem(payload.id);
    }

    return NextResponse.json(getMenu());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore inatteso';
    return NextResponse.json({ message }, { status: 400 });
  }
}

