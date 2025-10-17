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
    <div className="fixed bottom-[calc(84px+env(safe-area-inset-bottom)+env(safe-area-inset-bottom))] left-0 right-0 z-50 flex justify-end px-4">
      <Link
        href="/cart"
        className={cn(
          'pointer-events-auto relative flex h-16 w-16 items-center justify-center rounded-full bg-white border border-primary text-xl text-white shadow-[0_25px_45px_-18px_rgba(0,179,126,0.6)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary/95 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
          'after:absolute after:-right-3 after:-top-3 after:flex after:h-6 after:min-w-[1.75rem] after:items-center after:justify-center after:rounded-full after:bg-yellow-400 after:px-2 after:text-xs after:font-semibold after:text-primary after:content-[attr(data-count)]'
        )}
        data-count={count}
        aria-label={`Vai al carrello: ${count} articoli, totale ${formatCurrency(subtotal)}`}
      >
        🛒  
        <span className="pointer-events-none absolute right-full mr-3 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
        
        </span>
      </Link>
    </div>
  );
};
