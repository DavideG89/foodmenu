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

  return (
    <article
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-soft transition-transform duration-300 ease-out hover:-translate-y-1"
      onClick={() => onOpen(product)}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={`${product.image}?auto=format&fit=crop&w=800&q=80`}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
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
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div>
          <h3 className="text-lg font-semibold text-text">{product.name}</h3>
          <p className="mt-1 text-sm text-text/70 line-clamp-2">{product.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-text">{formatCurrency(finalPrice)}</span>
            {product.promoPrice ? (
              <span className="text-sm text-text/50 line-through">{formatCurrency(product.price)}</span>
            ) : null}
          </div>
          <Button
            variant="primary"
            onClick={(event) => {
              event.stopPropagation();
              onAdd(product);
            }}
            className="rounded-full px-3 py-2 text-sm"
          >
            + Aggiungi
          </Button>
        </div>
      </div>
    </article>
  );
};
