'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          {!isHome ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-primary/10 text-lg text-primary transition hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Torna indietro"
            >
              ←
            </button>
          ) : null}
          <Link href="/" className="text-lg font-bold text-text">
            GreenBurger
          </Link>
        </div>
        <p className={cn('hidden text-sm font-medium text-text/80 sm:block')}>
          Ritiro in sede • Contanti
        </p>
      </div>
    </header>
  );
};
