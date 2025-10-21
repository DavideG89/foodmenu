'use client';

import Image from 'next/image';
import { Product } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';

export type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
  onOpen: (product: Product) => void;
};

export const ProductCard = ({ product, onAdd, onOpen }: ProductCardProps) => {
  const finalPrice = product.promoPrice ?? product.price;
  const isAvailable = product.available !== false;

  return (
    <article
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-soft transition-transform duration-300 ease-out hover:-translate-y-1 sm:flex-row"
      onClick={() => onOpen(product)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:h-full sm:w-48 sm:flex-shrink-0 sm:aspect-auto">
        <Image
          src={`${product.image}?auto=format&fit=crop&w=800&q=80`}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 25vw"
        />
        {product.badges?.map((badge) => (
          <span
            key={badge}
            className="absolute left-3 top-3 rounded-full bg-gleam px-3 py-1 text-xs font-semibold text-moss shadow"
          >
            {badge}
          </span>
        ))}
      </div>
      <div className="flex h-full flex-1 flex-col gap-3 px-4 py-4 sm:px-6 sm:py-6">
        <div>
          <h3 className="text-lg font-semibold text-text">{product.name}</h3>
          <p className="mt-1 text-sm text-text/70 line-clamp-2 sm:line-clamp-3">{product.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-col items-start gap-1">
            {product.promoPrice ? (
              <span className="text-xs uppercase tracking-wide text-text/40 line-through">
                {formatCurrency(product.price)}
              </span>
            ) : null}
            <span className="text-lg font-bold text-text">{formatCurrency(finalPrice)}</span>
          </div>
          <Button
            variant="primary"
            disabled={!isAvailable}
            onClick={(event) => {
              event.stopPropagation();
              if (isAvailable) {
                onAdd(product);
              }
            }}
            className="rounded-full px-4 py-2 text-sm"
          >
            {isAvailable ? '+ Aggiungi' : 'Esaurito'}
          </Button>
        </div>
      </div>
    </article>
  );
};
