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
              className="w-full rounded-2xl border border-white/10 bg-white px-12 py-3 text-sm text-text placeholder:text-text/50 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
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
                'flex w-24 flex-col items-center rounded-2xl border px-4 py-3 text-xs font-semibold transition-all duration-300 ease-out',
                isActive
                  ? ' bg-primary/10 text-white'
                  : 'border-white/10  text-white/80 hover:text-white'
              )}
            >
              <span className="flex items-center justify-center">
                {category.image ? (
                  <span
                    className={cn(
                      'relative h-10 w-10  transition-colors'
                    )}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={32}
                      height={32}
                      className="h-full w-full  transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  </span>
                ) : null}
              </span>
              <span className="mt-3 text-xs font-medium leading-tight text-black">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
