import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/layout/AppProviders';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingCart } from '@/components/FloatingCart';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'GreenBurger Delivery',
  description: 'Ordina e ritira i tuoi burger preferiti pagando in contanti al ritiro.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${inter.variable} bg-background text-text`}>
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-32 pt-4">
              {children}
            </main>
            <FloatingCart />
            <BottomNav />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
