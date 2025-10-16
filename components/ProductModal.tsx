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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
        />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background transition-transform duration-300 ease-out data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full"
        >
          {product ? (
            <>
              <div className="relative h-64 w-full">
                <Image
                  src={`${product.image}?auto=format&fit=crop&w=1200&q=80`}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <Dialog.Close
                  type="button"
                  className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white"
                >
                  Chiudi
                </Dialog.Close>
                {product.badges?.map((badge) => (
                  <span
                    key={badge}
                    className="absolute left-4 top-4 mt-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-text"
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
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-lg font-bold text-text'
                      )}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
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
                      aria-label="Aumenta"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-t border-black/10 bg-white px-5 py-4">
                <div className="mb-3 flex items-center justify-between text-base font-semibold text-text">
                  <span>Totale</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <Button
                  fullWidth
                  onClick={() => {
                    if (!product) return;
                    onAdd(product, quantity);
                  }}
                >
                  Aggiungi al carrello
                </Button>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
