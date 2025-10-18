'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { type Category } from '@/data/mockData';

type CategoryTabsProps = {
  categories: Category[];
  active: string;
  onSelect: (slug: string) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export const CategoryTabs = ({
  categories,
  active,
  onSelect,
  searchValue,
  onSearchChange
}: CategoryTabsProps) => {
  return (
    <div className="sticky top-[56px] z-20 -mx-4 bg-background/95 px-4 py-3">
      {onSearchChange ? (
        <div className="mb-3">
          <label htmlFor="menu-search" className="sr-only">
            Cerca nel menù
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔍
            </span>
            <input
              id="menu-search"
              type="search"
              value={searchValue ?? ''}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cerca nel menù..."
              className="w-full rounded-2xl border border-primary/20 bg-white px-12 py-3 text-sm text-text placeholder:text-text/50 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              autoComplete="off"
            />
            {searchValue ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-white/80 transition hover:bg-white/20"
                aria-label="Cancella ricerca"
              >
                ✕
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((category) => {
          const isActive = active === category.slug;
          return (
            <button
              key={category.slug}
              onClick={() => onSelect(category.slug)}
              className={cn(
                'group flex w-24 flex-col items-center rounded-2xl border px-4 py-3 text-xs font-semibold transition-all duration-300 ease-out',
                isActive
                  ? ' bg-primary text-pearl shadow-[0_12px_24px_rgba(30,48,6,0.2)]'
                  : 'border-primary/10 bg-white/80 text-text/70 hover:text-text'
              )}
            >
              <span className="flex items-center justify-center">
                {category.image ? (
                  <span className="relative h-14 w-14 overflow-hidden rounded-xl bg-white">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  </span>
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-xl">
                    ⭐️
                  </span>
                )}
              </span>
              <span
                className={cn(
                  'mt-3 text-xs font-medium leading-tight',
                  isActive ? 'text-pearl' : 'text-text/80'
                )}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
