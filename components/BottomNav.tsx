'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart-store';
import { useEffect, useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/info', label: 'Info' }
];

export const BottomNav = () => {
  const pathname = usePathname();
  const count = useCartStore((state) => state.count());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (pathname === '/' || pathname === '/pickup') {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 flex justify-center px-4">
      <nav className="flex w-full max-w-md items-center justify-around rounded-full border border-gray-200 bg-white px-5 py-3 pb-[env(safe-area-inset-bottom)] shadow-lg shadow-emerald-100/40 min-h-[64px]">
        {links.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : pathname === link.href || pathname?.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-1 rounded-full text-xs font-medium transition-all duration-200 ease-out',
                isActive ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-700 hover:-translate-y-[1px]'
              )}
            >
              <span className="text-sm leading-none">{link.label}</span>
              <span
                className={cn(
                  'h-1 w-2 rounded-full transition-colors',
                  isActive ? 'bg-emerald-600' : 'bg-transparent'
                )}
              />
              {link.href === '/menu' && hydrated && count > 0 ? (
                <span className="absolute -top-1 right-3 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
