'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart-store';
import { useReservationStore } from '@/lib/store/reservation-store';
import { SlotPicker } from '@/components/SlotPicker';
import type {
  CreateReservationRequest,
  CreateReservationResponse,
  SlotSummary,
  SlotsResponse
} from '@/lib/types/reservation';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { useToast } from '@/components/ui/toast-provider';

const getToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

type FieldErrors = Partial<Record<'name' | 'phone' | 'pickupSlot', string>>;

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);

  const { draft, updateDraft, resetDraft, snapshotCartItems, setLastReservation } =
    useReservationStore();

  const [slots, setSlots] = useState<SlotSummary[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotError, setSlotError] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!cartItems.length) {
      router.replace('/menu');
    }
  }, [cartItems.length, router]);

  const fetchSlots = useCallback(
    async (date: string) => {
      try {
        setSlotsLoading(true);
        setSlotError(undefined);

        const response = await fetch(`/api/slots?date=${date}`);
        if (!response.ok) {
          throw new Error('Impossibile caricare gli slot');
        }

        const data = (await response.json()) as SlotsResponse;
        setSlots(data.slots);
        if (draft.pickupSlot && !data.slots.some((slot) => slot.id === draft.pickupSlot)) {
          updateDraft({ pickupSlot: undefined });
        }
      } catch (error) {
        console.error(error);
        setSlotError('Non riusciamo a mostrare gli slot disponibili. Riprova più tardi.');
      } finally {
        setSlotsLoading(false);
      }
    },
    [draft.pickupSlot, updateDraft]
  );

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  const itemsTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        (item.product.promoPrice ?? item.product.price) * item.quantity,
      0
    );
  }, [cartItems]);

  const handleFieldChange = useCallback(
    (key: keyof typeof draft, value: string | undefined) => {
      updateDraft({ [key]: value } as Partial<typeof draft>);
      if (errors[key as keyof FieldErrors]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[key as keyof FieldErrors];
          return next;
        });
      }
    },
    [draft, errors, updateDraft]
  );

  const validate = useCallback(() => {
    const nextErrors: FieldErrors = {};
    if (!draft.name?.trim()) {
      nextErrors.name = 'Inserisci il tuo nome.';
    }
    if (!draft.phone?.trim()) {
      nextErrors.phone = 'Inserisci un numero di telefono.';
    }
    if (!draft.pickupSlot) {
      nextErrors.pickupSlot = 'Seleziona uno slot di ritiro.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [draft]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!cartItems.length) {
        toast({
          title: 'Carrello vuoto',
          description: 'Aggiungi almeno un articolo prima di prenotare.',
          duration: 3000
        });
        return;
      }

      if (!validate()) {
        return;
      }

      try {
        setSubmitting(true);

        const itemsSnapshot = snapshotCartItems(cartItems);

        const payload: CreateReservationRequest = {
          customer: {
            name: draft.name.trim(),
            phone: draft.phone.trim(),
            email: draft.email?.trim() || undefined
          },
          pickupSlot: draft.pickupSlot!,
          notes: draft.notes?.trim() || undefined,
          items: itemsSnapshot,
          payment: 'CASH'
        };

        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Richiesta non riuscita');
        }

        const data = (await response.json()) as CreateReservationResponse;
        setLastReservation(data);
        clearCart();
        resetDraft();

        toast({
          title: 'Prenotazione inviata',
          description: 'Ti aspettiamo al bancone per il ritiro.',
          duration: 3000
        });

        router.push(`/success/${data.id}`);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Errore',
          description: 'Non siamo riusciti a creare la prenotazione. Riprova.',
          duration: 4000
        });
      } finally {
        setSubmitting(false);
      }
    },
    [
      cartItems,
      clearCart,
      draft.email,
      draft.name,
      draft.notes,
      draft.phone,
      draft.pickupSlot,
      resetDraft,
      router,
      setLastReservation,
      snapshotCartItems,
      toast,
      validate
    ]
  );

  if (!cartItems.length) {
    return null;
  }

  return (
    <div className="grid gap-6 pb-16 lg:grid-cols-[2fr_1fr]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
          <header>
            <h1 className="text-2xl font-semibold text-text">Prenotazione pickup</h1>
            <p className="mt-1 text-sm text-text/60">
              Compila i dati per ritirare l&apos;ordine in contanti.
            </p>
          </header>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-medium text-text">
                Nome e cognome*
                <input
                  type="text"
                  value={draft.name ?? ''}
                  onChange={(event) => handleFieldChange('name', event.target.value)}
                  placeholder="Es. Luca Rossi"
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  required
                />
                {errors.name ? <span className="text-xs text-red-500">{errors.name}</span> : null}
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-text">
                Telefono*
                <input
                  type="tel"
                  value={draft.phone ?? ''}
                  onChange={(event) => handleFieldChange('phone', event.target.value)}
                  placeholder="+39 ..."
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  required
                />
                {errors.phone ? <span className="text-xs text-red-500">{errors.phone}</span> : null}
              </label>
            </div>

            <label className="flex flex-col gap-1 text-sm font-medium text-text">
              Email (opzionale)
              <input
                type="email"
                value={draft.email ?? ''}
                onChange={(event) => handleFieldChange('email', event.target.value)}
                placeholder="Per ricevere aggiornamenti via email"
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-text">
              Note per la cucina (opzionale)
              <textarea
                value={draft.notes ?? ''}
                onChange={(event) => handleFieldChange('notes', event.target.value)}
                rows={3}
                placeholder="Es. Allergie, preferenze sul ritiro..."
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
          <header>
            <h2 className="text-xl font-semibold text-text">Scegli orario di ritiro</h2>
            <p className="mt-1 text-sm text-text/60">
              Gli slot sono aggiornati in tempo reale in base alla capacità della cucina.
            </p>
          </header>

          <div className="flex flex-col gap-4">
            <label className="flex w-full flex-col gap-2 text-sm font-medium text-text">
              Data
              <input
                type="date"
                min={getToday()}
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <div className="space-y-2">
              <SlotPicker
                slots={slots}
                value={draft.pickupSlot}
                onChange={(slotId) => handleFieldChange('pickupSlot', slotId)}
                isLoading={slotsLoading}
                error={slotError}
              />
              {errors.pickupSlot ? (
                <span className="text-xs text-red-500">{errors.pickupSlot}</span>
              ) : null}
            </div>
          </div>
        </section>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Invio in corso...' : 'Conferma prenotazione'}
        </Button>
      </form>

      <aside className="space-y-4">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-text">Riepilogo ordine</h2>
          <ul className="mt-4 space-y-3 text-sm text-text">
            {cartItems.map(({ product, quantity }) => {
              const unitPrice = product.promoPrice ?? product.price;
              return (
                <li key={product.id} className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-text/60">
                      {quantity} × {formatCurrency(unitPrice)}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(unitPrice * quantity)}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex items-center justify-between text-base font-semibold text-text">
            <span>Totale</span>
            <span>{formatCurrency(itemsTotal)}</span>
          </div>
          <p className="mt-2 text-xs text-text/60">
            Pagamento in contanti al ritiro. Riceverai conferma via email o WhatsApp.
          </p>
        </div>

        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4 text-sm text-text/80">
          <p className="font-semibold text-primary">Come funziona</p>
          <ol className="mt-2 space-y-1 text-xs text-text/70">
            <li>1. Conferma la prenotazione con i tuoi dati.</li>
            <li>2. Ti contattiamo se servono dettagli extra.</li>
            <li>3. Ritira e paga in contanti allo sportello dedicato.</li>
          </ol>
        </div>
      </aside>
    </div>
  );
}
