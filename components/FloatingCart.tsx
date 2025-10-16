'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/format';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const FloatingCart = () => {
  const count = useCartStore((state) => state.count());
  const subtotal = useCartStore((state) => state.subtotal());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || count === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-[calc(84px+env(safe-area-inset-bottom)+env(safe-area-inset-bottom))] left-0 right-0 z-50 flex justify-center">
      <Link
        href="/cart"
        className={cn(
          'flex w-[90%] max-w-sm items-center justify-between rounded-2xl bg-primary px-5 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-primary/90'
        )}
      >
        <span>🛒 {count}</span>
        <span>• {formatCurrency(subtotal)}</span>
      </Link>
    </div>
  );
};
