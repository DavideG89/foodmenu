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
              className="w-full rounded-2xl border border-white/10 bg-[#1C1C1C] px-12 py-3 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
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
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar snap-x snap-mandatory">
        {categories.map((category) => {
          const isActive = active === category.slug;
          return (
            <button
              key={category.slug}
              onClick={() => onSelect(category.slug)}
              className={cn(
                'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ease-out snap-start',
                isActive
                  ? 'border-transparent bg-emerald-600 text-white shadow-soft'
                  : 'border-white/10 bg-[#1C1C1C] text-white/80 hover:text-white'
              )}
            >
              <span className="flex items-center gap-2">
                {category.image ? (
                  <span className="relative h-6 w-6 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="24px"
                    />
                  </span>
                ) : null}
                <span>{category.name}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
