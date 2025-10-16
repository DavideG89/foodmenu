'use client';

import { cn } from '@/lib/utils';

type CategoryTabsProps = {
  categories: { name: string; slug: string }[];
  active: string;
  onSelect: (slug: string) => void;
};

export const CategoryTabs = ({ categories, active, onSelect }: CategoryTabsProps) => {
  return (
    <div className="sticky top-[56px] z-20 -mx-4 bg-background/95 px-4 py-3 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => {
          const isActive = active === category.slug;
          return (
            <button
              key={category.slug}
              onClick={() => onSelect(category.slug)}
              className={cn(
                'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition',
                isActive
                  ? 'border-primary bg-primary text-white shadow-soft'
                  : 'border-black/10 bg-white text-text/80 hover:text-text'
              )}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
