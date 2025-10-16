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
    <div className="pointer-events-none fixed bottom-[calc(84px+env(safe-area-inset-bottom)+env(safe-area-inset-bottom))] left-0 right-0 z-50 flex justify-center px-4">
      <Link
        href="/cart"
        className={cn(
          'pointer-events-auto flex w-full max-w-lg items-center justify-between rounded-3xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-[0_20px_40px_-15px_rgba(0,179,126,0.45)] transition-all duration-300 hover:translate-y-[-2px] hover:bg-primary/95 active:translate-y-0'
        )}
      >
        <span className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg">
            🛒
          </span>
          {count} articoli
        </span>
        <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
          {formatCurrency(subtotal)}
        </span>
      </Link>
    </div>
  );
};
