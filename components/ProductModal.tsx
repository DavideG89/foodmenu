'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Product } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

export type ProductModalProps = {
  product?: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: Product, quantity: number) => void;
};

export const ProductModal = ({ product, open, onOpenChange, onAdd }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const previousOverflow = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflow;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    setQuantity(1);
  }, [product?.id, open]);

  const total = useMemo(() => {
    if (!product) return 0;
    const price = product.promoPrice ?? product.price;
    return price * quantity;
  }, [product, quantity]);
  const isAvailable = product?.available !== false;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out" />
        <Dialog.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-h-[90vh] flex-col overflow-hidden rounded-t-3xl bg-background shadow-2xl shadow-black/25',
            'max-sm:translate-y-full max-sm:data-[state=open]:animate-sheet-in max-sm:data-[state=closed]:animate-sheet-out',
            'sm:inset-x-auto sm:bottom-10 sm:left-1/2 sm:w-[480px] sm:-translate-x-1/2 sm:translate-y-4 sm:rounded-3xl sm:bg-white/90 sm:backdrop-blur sm:opacity-0 sm:shadow-[0_35px_65px_rgba(30,48,6,0.25)] sm:transition-none',
            'sm:data-[state=open]:animate-modal-in sm:data-[state=closed]:animate-modal-out',
            'lg:w-[520px]'
          )}
        >
          {product ? (
            <>
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={`${product.image}?auto=format&fit=crop&w=1600&q=80`}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <Dialog.Close
                  type="button"
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-lg font-semibold text-white transition hover:bg-black/80"
                  aria-label="Chiudi"
                >
                  ✕
                </Dialog.Close>
                {product.badges?.map((badge) => (
                  <span
                    key={badge}
                    className="absolute left-4 top-4 mt-12 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-text"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6">
                <Dialog.Title className="text-2xl font-bold text-text">
                  {product.name}
                </Dialog.Title>
                <p className="mt-3 text-base text-text/80">{product.description}</p>
                <div className="mt-8 flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft">
                  <div>
                    <p className="text-sm font-medium text-text/60">Prezzo</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-text">{formatCurrency(product.promoPrice ?? product.price)}</span>
                      {product.promoPrice ? (
                        <span className="text-sm text-text/50 line-through">{formatCurrency(product.price)}</span>
                      ) : null}
                    </div>
                    {isAvailable ? null : (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-accent">
                        Non disponibile per il pickup
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-lg font-bold text-text'
                      )}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={!isAvailable}
                      aria-label="Diminuisci"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-lg font-semibold">{quantity}</span>
                    <button
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-lg font-bold text-text'
                      )}
                      onClick={() => setQuantity((q) => q + 1)}
                      disabled={!isAvailable}
                      aria-label="Aumenta"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-t border-black/10 bg-white px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                <div className="mb-3 flex items-center justify-between text-base font-semibold text-text">
                  <span>Totale</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <Button
                  fullWidth
                  disabled={!isAvailable}
                  onClick={() => {
                    if (!product || !isAvailable) return;
                    onAdd(product, quantity);
                  }}
                >
                  {isAvailable ? 'Aggiungi al carrello' : 'Non disponibile'}
                </Button>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
