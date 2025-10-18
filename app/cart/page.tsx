'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { useToast } from '@/components/ui/toast-provider';

type DiscountRule =
  | { type: 'percent'; value: number }
  | { type: 'amount'; value: number };

const DISCOUNT_CODES: Record<string, DiscountRule> = {
  GREEN10: { type: 'percent', value: 0.1 },
  BURGER5: { type: 'amount', value: 5 }
};

export default function CartPage() {
  const { items, inc, dec, remove, clear, subtotal } = useCartStore();
  const [hydrated, setHydrated] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const rawTotal = useMemo(() => (hydrated ? subtotal() : 0), [hydrated, subtotal]);
  const discountRule = appliedCode ? DISCOUNT_CODES[appliedCode] : undefined;
  const discountAmount = useMemo(() => {
    if (!discountRule) {
      return 0;
    }
    if (discountRule.type === 'percent') {
      return rawTotal * discountRule.value;
    }
    return Math.min(discountRule.value, rawTotal);
  }, [discountRule, rawTotal]);
  const total = Math.max(rawTotal - discountAmount, 0);

  const handleApplyCode = () => {
    const normalized = codeInput.trim().toUpperCase();
    if (!normalized) {
      toast({
        title: 'Codice vuoto',
        description: 'Inserisci un codice sconto per applicarlo.',
        duration: 3000
      });
      return;
    }
    const rule = DISCOUNT_CODES[normalized];
    if (!rule) {
      toast({
        title: 'Codice non valido',
        description: 'Verifica di avere un codice corretto.',
        duration: 3000
      });
      return;
    }
    setAppliedCode(normalized);
    setCodeInput('');
    toast({
      title: 'Codice applicato',
      description:
        rule.type === 'percent'
          ? `Sconto del ${Math.round(rule.value * 100)}% attivato.`
          : `Sconto di ${formatCurrency(rule.value)} attivato.`,
      duration: 3000
    });
  };

  const handleRemoveCode = () => {
    setAppliedCode(null);
    toast({
      title: 'Codice rimosso',
      description: 'Il codice sconto non è più attivo.',
      duration: 3000
    });
  };

  if (!hydrated || items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-text">Il carrello è vuoto</p>
        <Button asChild>
          <Link href="/menu">Scopri il menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-4">
        {items.map(({ product, quantity }) => {
          const lineTotal = (product.promoPrice ?? product.price) * quantity;
          return (
            <div key={product.id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-soft">
              <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                <Image
                  src={`${product.image}?auto=format&fit=crop&w=400&q=80`}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-text">{product.name}</h3>
                  <p className="text-sm text-text/60">{formatCurrency(product.promoPrice ?? product.price)} cad.</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-base font-semibold"
                      onClick={() => dec(product.id)}
                      aria-label="Diminuisci"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-base font-semibold"
                      onClick={() => inc(product.id)}
                      aria-label="Aumenta"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text">{formatCurrency(lineTotal)}</p>
                    <button
                      className="text-xs font-medium text-text/50 underline"
                      onClick={() => remove(product.id)}
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-soft">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-text">Codice sconto</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={codeInput}
              onChange={(event) => setCodeInput(event.target.value)}
              placeholder="Inserisci il codice"
              className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              autoCapitalize="characters"
            />
            {appliedCode ? (
              <Button variant="ghost" onClick={handleRemoveCode} className="sm:w-auto">
                Rimuovi
              </Button>
            ) : (
              <Button onClick={handleApplyCode} className="sm:w-auto">
                Applica
              </Button>
            )}
          </div>
          {appliedCode ? (
            <p className="text-xs text-primary">
              Codice <span className="font-semibold">{appliedCode}</span>{' '}
              {discountRule?.type === 'percent'
                ? `- ${Math.round((discountRule?.value ?? 0) * 100)}%`
                : `- ${formatCurrency(discountRule?.value ?? 0)}`}
            </p>
          ) : null}
        </div>
        <div className="mt-6 space-y-2 text-sm text-text/70">
          <div className="flex items-center justify-between">
            <span>Subtotale</span>
            <span>{formatCurrency(rawTotal)}</span>
          </div>
          {discountAmount > 0 ? (
            <div className="flex items-center justify-between text-primary">
              <span>Sconto</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-between text-base font-semibold text-text">
          <span>Totale</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <p className="mt-2 text-sm text-text/60">Pagamento in contanti al ritiro.</p>
        <div className="mt-4 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={clear}>
            Svuota
          </Button>
          <Button asChild className="flex-1">
            <Link href="/cart/success">Conferma ordine (contanti)</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
