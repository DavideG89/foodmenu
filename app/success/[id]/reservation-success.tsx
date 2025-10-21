'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useReservationStore } from '@/lib/store/reservation-store';
import type { ReservationRecord } from '@/lib/types/reservation';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { restaurantInfo } from '@/data/mockData';

type ReservationSuccessProps = {
  reservationId: string;
};

const timeFormatter = new Intl.DateTimeFormat('it-IT', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit'
});

export const ReservationSuccess = ({ reservationId }: ReservationSuccessProps) => {
  const lastReservation = useReservationStore((state) => state.lastReservation);
  const setLastReservation = useReservationStore((state) => state.setLastReservation);
  const [reservation, setReservation] = useState<ReservationRecord | null>(() => {
    if (lastReservation?.id === reservationId) {
      return lastReservation;
    }
    return null;
  });
  const [loading, setLoading] = useState(!reservation);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reservation) {
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reservations/${reservationId}`, {
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error('Prenotazione non trovata');
        }
        const data = (await response.json()) as ReservationRecord;
        if (!cancelled) {
          setReservation(data);
          setLastReservation(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          console.error(fetchError);
          setError('Non riusciamo a trovare i dettagli della prenotazione.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [reservation, reservationId, setLastReservation]);

  const pickupLabel = useMemo(() => {
    if (!reservation) {
      return '';
    }
    return timeFormatter.format(new Date(reservation.pickupSlot));
  }, [reservation]);

  const sanitizedPhone = useMemo(
    () => restaurantInfo.phone.replace(/[^+\d]/g, ''),
    []
  );

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <p className="text-base font-medium text-text/70">Recupero della prenotazione...</p>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-text">Ops!</p>
          <p className="max-w-sm text-sm text-text/60">{error}</p>
        </div>
        <Button asChild>
          <Link href="/menu">Torna al menù</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-text">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="space-y-2 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Prenotazione confermata
          </span>
          <h1 className="text-2xl font-semibold text-text">Grazie {reservation.customer.name}!</h1>
          <p className="text-sm text-text/60">
            L&apos;ordine sarà pronto per il ritiro{' '}
            <span className="font-semibold text-primary">{pickupLabel}</span>.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-primary/5 p-4">
            <p className="text-xs uppercase tracking-widest text-primary/70">Ritiro</p>
            <p className="mt-1 text-sm font-semibold text-text">{pickupLabel}</p>
            <p className="mt-1 text-xs text-text/60">
              {restaurantInfo.address} · Telefono{' '}
              <a href={`tel:${sanitizedPhone}`} className="font-medium text-primary underline">
                {restaurantInfo.phone}
              </a>
            </p>
          </div>
          <div className="rounded-2xl bg-primary/5 p-4">
            <p className="text-xs uppercase tracking-widest text-primary/70">Stato</p>
            <p className="mt-1 text-sm font-semibold text-text">{reservation.status}</p>
            <p className="mt-1 text-xs text-text/60">
              Ti avviseremo via {reservation.customer.email ? 'email' : 'WhatsApp'} per ogni aggiornamento.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Riepilogo ordine</h2>
        <ul className="mt-4 space-y-3 text-sm text-text/80">
          {reservation.items.map((item) => {
            const unitPrice = item.promoPriceSnapshot ?? item.priceSnapshot;
            return (
              <li key={item.id} className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-medium text-text">{item.nameSnapshot}</span>
                  <span className="text-xs text-text/60">
                    {item.qty} × {formatCurrency(unitPrice)}
                  </span>
                </div>
                <span className="font-semibold text-text">
                  {formatCurrency(unitPrice * item.qty)}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-center justify-between text-base font-semibold text-text">
          <span>Totale</span>
          <span>{formatCurrency(reservation.subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-text/60">
          Pagherai in contanti al ritiro. Mostra questo riepilogo allo staff.
        </p>
      </section>

      <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/menu">Aggiungi altri piatti</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full sm:w-auto">
          <a
            href={`https://wa.me/${sanitizedPhone}`}
            target="_blank"
            rel="noreferrer"
          >
            Scrivici su WhatsApp
          </a>
        </Button>
        <Button asChild variant="ghost" className="w-full sm:w-auto">
          <a href={`tel:${sanitizedPhone}`}>Chiama il locale</a>
        </Button>
      </div>
    </div>
  );
};
