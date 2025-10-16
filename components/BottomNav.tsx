'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart-store';
import { useEffect, useState } from 'react';

const links = [
  { href: '/pickup', label: 'Home' },
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-stretch justify-between px-2 py-2">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname?.startsWith(link.href) && link.href !== '/pickup');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative flex-1 rounded-xl px-3 py-2 text-center text-sm font-semibold transition',
                isActive ? 'text-primary' : 'text-text/70'
              )}
            >
              {link.label}
              {link.href === '/menu' && hydrated && count > 0 ? (
                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
