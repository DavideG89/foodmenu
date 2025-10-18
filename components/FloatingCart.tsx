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
    <div
      className="fixed inset-x-0 bottom-0 z-50 px-4 lg:hidden"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
    >
      <Link
        href="/cart"
        className={cn(
          'block rounded-t-3xl border border-primary/40 bg-primary px-5 py-4 text-pearl shadow-[0_-18px_36px_rgba(30,48,6,0.25)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-pearl focus-visible:ring-accent'
        )}
        aria-label={`Vai al carrello: ${count} articoli, totale ${formatCurrency(subtotal)}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pearl/15 text-2xl">
              🛒
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold uppercase tracking-widest text-pearl/80">
                Carrello
              </span>
              <span className="text-base font-semibold">
                {count} {count === 1 ? 'articolo' : 'articoli'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-pearl/80">Totale</span>
            <p className="text-lg font-semibold">{formatCurrency(subtotal)}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};
