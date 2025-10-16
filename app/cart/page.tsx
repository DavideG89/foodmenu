'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';

export default function CartPage() {
  const { items, inc, dec, remove, clear, subtotal } = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const total = hydrated ? subtotal() : 0;

  if (!hydrated || items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-text">Il carrello è vuoto</p>
        <Button asChild>
          <Link href="/menu">Scopri il menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-4">
        {items.map(({ product, quantity }) => {
          const lineTotal = (product.promoPrice ?? product.price) * quantity;
          return (
            <div key={product.id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-soft">
              <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                <Image
                  src={`${product.image}?auto=format&fit=crop&w=400&q=80`}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-text">{product.name}</h3>
                  <p className="text-sm text-text/60">{formatCurrency(product.promoPrice ?? product.price)} cad.</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-base font-semibold"
                      onClick={() => dec(product.id)}
                      aria-label="Diminuisci"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-base font-semibold"
                      onClick={() => inc(product.id)}
                      aria-label="Aumenta"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text">{formatCurrency(lineTotal)}</p>
                    <button
                      className="text-xs font-medium text-text/50 underline"
                      onClick={() => remove(product.id)}
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between text-base font-semibold text-text">
          <span>Totale</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <p className="mt-2 text-sm text-text/60">Pagamento in contanti al ritiro.</p>
        <div className="mt-4 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={clear}>
            Svuota
          </Button>
          <Button asChild className="flex-1">
            <Link href="/cart/success">Conferma ordine (contanti)</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
