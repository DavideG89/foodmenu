'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export const Header = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
        <Link href="/" className="text-lg font-bold text-text">
          GreenBurger
        </Link>
        <p className={cn('text-sm font-medium text-text/80')}>
          Ritiro in sede • Contanti
        </p>
      </div>
    </header>
  );
};
