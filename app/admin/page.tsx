'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/store/admin-store';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';
import type { Category, Product } from '@/data/mockData';
import type {
  ReservationRecord,
  ReservationStatus,
  SlotSummary
} from '@/lib/types/reservation';

type MenuResponse = {
  categories: Category[];
  items: Product[];
};

type SlotConfigResponse = {
  startHour: string;
  endHour: string;
  slotSize: number;
  capacity: number;
  daysOfWeek: number[];
};

const statusFlow: ReservationStatus[] = ['NEW', 'PREPARING', 'READY', 'DELIVERED'];

type AdminTab = 'menu' | 'slots' | 'reservations';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const logout = useAdminStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState<AdminTab>('menu');

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-6 pb-16">
      <header className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Dashboard GreenBurger</h1>
          <p className="text-sm text-text/60">Gestisci menu, slot di ritiro e prenotazioni.</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            logout();
            toast({
              title: 'Disconnessione effettuata',
              duration: 2500
            });
            router.push('/');
          }}
        >
          Esci
        </Button>
      </header>

      <nav className="flex flex-wrap gap-3 rounded-3xl bg-white p-3 shadow-soft">
        <TabButton label="Menu" target="menu" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton label="Slot pickup" target="slots" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton
          label="Prenotazioni"
          target="reservations"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </nav>

      {activeTab === 'menu' ? <MenuTab /> : null}
      {activeTab === 'slots' ? <SlotsTab /> : null}
      {activeTab === 'reservations' ? <ReservationsTab /> : null}
    </div>
  );
}

type TabButtonProps = {
  label: string;
  target: AdminTab;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
};

const TabButton = ({ label, target, activeTab, setActiveTab }: TabButtonProps) => (
  <button
    type="button"
    onClick={() => setActiveTab(target)}
    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
      activeTab === target
        ? 'bg-primary text-white shadow-soft'
        : 'bg-primary/5 text-text/70 hover:bg-primary/10'
    }`}
  >
    {label}
  </button>
);

const emptyProductForm: Product = {
  id: '',
  name: '',
  description: '',
  price: 0,
  image: '',
  categorySlug: '',
  badges: [],
  available: true
};

const MenuTab = () => {
  const { toast } = useToast();
  const [menu, setMenu] = useState<MenuResponse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [form, setForm] = useState<Product>(emptyProductForm);
  const [isSaving, setSaving] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/menu');
      const data = (await response.json()) as MenuResponse;
      setMenu(data);
      if (!form.categorySlug && data.categories.length > 0) {
        setForm((prev) => ({ ...prev, categorySlug: data.categories[0].slug }));
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare il menu.',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (item: Product) => {
    setForm({ ...item });
  };

  const resetForm = () =>
    setForm((prev) => ({
      ...emptyProductForm,
      categorySlug: menu?.categories[0]?.slug ?? prev.categorySlug ?? ''
    }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast({
        title: 'Nome obbligatorio',
        description: 'Inserisci un nome per il piatto.',
        duration: 2500
      });
      return;
    }
    if (!form.categorySlug) {
      toast({
        title: 'Categoria obbligatoria',
        description: 'Seleziona una categoria.',
        duration: 2500
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        action: 'upsert' as const,
        item: {
          ...form,
          price: Number(form.price),
          promoPrice: form.promoPrice ? Number(form.promoPrice) : undefined
        }
      };
      const response = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message ?? 'Impossibile salvare');
      }
      const data = (await response.json()) as MenuResponse;
      setMenu(data);
      resetForm();
      toast({
        title: 'Menu aggiornato',
        description: 'Le modifiche sono state salvate.',
        duration: 2500
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Errore',
        description: error instanceof Error ? error.message : 'Salvataggio non riuscito.',
        duration: 3000
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Rimuovere il piatto dal menu?')) {
      return;
    }
    try {
      const response = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message ?? 'Impossibile eliminare');
      }
      const data = (await response.json()) as MenuResponse;
      setMenu(data);
      toast({
        title: 'Piatto eliminato',
        duration: 2500
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Errore',
        description: error instanceof Error ? error.message : 'Eliminazione non riuscita.',
        duration: 3000
      });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">Piatti in carta</h2>
            <p className="text-sm text-text/60">Modifica disponibilità e prezzi in tempo reale.</p>
          </div>
          <Button variant="ghost" onClick={fetchMenu} disabled={isLoading}>
            Aggiorna
          </Button>
        </header>

        <div className="space-y-3">
          {isLoading || !menu ? (
            <p className="text-sm text-text/60">Caricamento del menu…</p>
          ) : (
            menu.categories.map((category) => {
              const items = menu.items.filter(
                (item) => item.categorySlug === category.slug
              );
              if (!items.length) {
                return null;
              }
              return (
                <div key={category.slug} className="rounded-2xl border border-black/5 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-text">{category.name}</h3>
                    <span className="text-xs text-text/50">{items.length} piatti</span>
                  </div>
                  <ul className="mt-3 space-y-3">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex flex-col gap-2 rounded-2xl bg-primary/5 p-3 text-sm text-text/80 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold text-text">{item.name}</p>
                          <p className="text-xs text-text/60">
                            {item.available === false ? 'Non disponibile' : 'Disponibile'} ·{' '}
                            €{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            className="px-3 py-1.5 text-xs"
                            onClick={() => handleEdit(item)}
                          >
                            Modifica
                          </Button>
                          <Button
                            variant="ghost"
                            className="px-3 py-1.5 text-xs"
                            onClick={() => handleDelete(item.id)}
                          >
                            Elimina
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
        <header>
          <h2 className="text-lg font-semibold text-text">
            {form.id ? 'Modifica piatto' : 'Nuovo piatto'}
          </h2>
          <p className="text-sm text-text/60">
            Compila i campi e salva per aggiornare il menu pubblico.
          </p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium text-text">
            Nome
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-text">
            Descrizione
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={3}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-text">
              Prezzo (€)
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.price}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, price: Number(event.target.value) }))
                }
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-text">
              Prezzo promo (opzionale)
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.promoPrice ?? ''}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    promoPrice: event.target.value ? Number(event.target.value) : undefined
                  }))
                }
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-text">
              Categoria
              <select
                value={form.categorySlug}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, categorySlug: event.target.value }))
                }
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Seleziona</option>
                {menu?.categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-text">
              Immagine (URL)
              <input
                type="text"
                value={form.image}
                onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-text">
            <input
              type="checkbox"
              checked={form.available ?? true}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, available: event.target.checked }))
              }
              className="h-4 w-4 rounded border-black/25 text-primary focus:ring-primary"
            />
            Disponibile per l&apos;ordine
          </label>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? 'Salvataggio…' : 'Salva piatto'}
            </Button>
            <Button type="button" variant="ghost" className="flex-1" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

const weekdayOptions = [
  { label: 'Lun', value: 1 },
  { label: 'Mar', value: 2 },
  { label: 'Mer', value: 3 },
  { label: 'Gio', value: 4 },
  { label: 'Ven', value: 5 },
  { label: 'Sab', value: 6 },
  { label: 'Dom', value: 0 }
];

const SlotsTab = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<SlotConfigResponse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [previewDate, setPreviewDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<SlotSummary[]>([]);
  const [isSaving, setSaving] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/slots');
      const data = (await response.json()) as SlotConfigResponse;
      setConfig(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare la configurazione degli slot.',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (date: string) => {
    try {
      const response = await fetch(`/api/slots?date=${date}`);
      const data = await response.json();
      setSlots(data.slots ?? []);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare gli slot disponibili.',
        duration: 3000
      });
    }
  };

  useEffect(() => {
    fetchConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSlots(previewDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewDate]);

  const handleToggleDay = (dayIndex: number) => {
    if (!config) {
      return;
    }
    const days = config.daysOfWeek.includes(dayIndex)
      ? config.daysOfWeek.filter((day) => day !== dayIndex)
      : [...config.daysOfWeek, dayIndex].sort();
    setConfig({ ...config, daysOfWeek: days });
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!config) {
      return;
    }
    setSaving(true);
    try {
      const response = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message ?? 'Salvataggio non riuscito');
      }
      const data = (await response.json()) as SlotConfigResponse;
      setConfig(data);
      toast({
        title: 'Slot aggiornati',
        description: 'La disponibilità è stata aggiornata.',
        duration: 2500
      });
      fetchSlots(previewDate);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Errore',
        description: error instanceof Error ? error.message : 'Salvataggio non riuscito.',
        duration: 3000
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
        <header>
          <h2 className="text-lg font-semibold text-text">Configurazione base</h2>
          <p className="text-sm text-text/60">
            Definisci durata degli slot, orario di servizio e giorni attivi.
          </p>
        </header>
        {isLoading || !config ? (
          <p className="text-sm text-text/60">Caricamento configurazione…</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-text">
                Apertura
                <input
                  type="time"
                  value={config.startHour}
                  onChange={(event) =>
                    setConfig((prev) => prev && { ...prev, startHour: event.target.value })
                  }
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-text">
                Chiusura
                <input
                  type="time"
                  value={config.endHour}
                  onChange={(event) =>
                    setConfig((prev) => prev && { ...prev, endHour: event.target.value })
                  }
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-text">
                Durata slot (min)
                <input
                  type="number"
                  min="5"
                  value={config.slotSize}
                  onChange={(event) =>
                    setConfig((prev) => prev && { ...prev, slotSize: Number(event.target.value) })
                  }
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-text">
                Capienza per slot
                <input
                  type="number"
                  min="1"
                  value={config.capacity}
                  onChange={(event) =>
                    setConfig((prev) => prev && { ...prev, capacity: Number(event.target.value) })
                  }
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </label>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-text">Giorni attivi</p>
              <div className="flex flex-wrap gap-2">
                {weekdayOptions.map((option) => {
                  const active = config.daysOfWeek.includes(option.value);
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => handleToggleDay(option.value)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                        active
                          ? 'bg-primary text-white'
                          : 'bg-primary/5 text-text/60 hover:bg-primary/10'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? 'Salvataggio…' : 'Salva configurazione'}
            </Button>
          </form>
        )}
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">Anteprima slot</h2>
            <p className="text-sm text-text/60">
              Controlla la disponibilità per la data selezionata.
            </p>
          </div>
          <input
            type="date"
            value={previewDate}
            onChange={(event) => setPreviewDate(event.target.value)}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </header>

        <div className="space-y-2">
          {slots.length === 0 ? (
            <p className="text-sm text-text/60">Nessuno slot disponibile per questa data.</p>
          ) : (
            <ul className="space-y-2">
              {slots.map((slot) => {
                const formatter = new Intl.DateTimeFormat('it-IT', {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                const start = formatter.format(new Date(slot.start));
                const end = formatter.format(new Date(slot.end));
                const busy = slot.capacity - slot.remaining;
                return (
                  <li
                    key={slot.id}
                    className="flex items-center justify-between rounded-2xl bg-primary/5 px-4 py-3 text-sm text-text"
                  >
                    <div>
                      <p className="font-semibold">{start} - {end}</p>
                      <p className="text-xs text-text/60">
                        {busy} prenotazioni · {slot.remaining} posti liberi
                      </p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                      Capienza {slot.capacity}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

const ReservationsTab = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/reservations');
      const data = await response.json();
      setReservations(data.reservations ?? []);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare le prenotazioni.',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusLabel = (status: ReservationStatus) => {
    switch (status) {
      case 'NEW':
        return 'Nuovo';
      case 'PREPARING':
        return 'In preparazione';
      case 'READY':
        return 'Pronto';
      case 'DELIVERED':
        return 'Consegnato';
      default:
        return status;
    }
  };

  const advanceStatus = async (reservation: ReservationRecord) => {
    const currentIndex = statusFlow.indexOf(reservation.status);
    const nextStatus = statusFlow[currentIndex + 1];
    if (!nextStatus) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/reservations/${reservation.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message ?? 'Aggiornamento non riuscito');
      }
      const updated = (await response.json()) as ReservationRecord;
      setReservations((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      toast({
        title: 'Stato aggiornato',
        description: `Prenotazione ${reservation.id} → ${statusLabel(updated.status)}.`,
        duration: 2500
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Errore',
        description: error instanceof Error ? error.message : 'Aggiornamento non riuscito.',
        duration: 3000
      });
    }
  };

  return (
    <section className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">Prenotazioni attive</h2>
          <p className="text-sm text-text/60">Segui lo stato e aggiorna i clienti in tempo reale.</p>
        </div>
        <Button variant="ghost" onClick={fetchReservations} disabled={isLoading}>
          Aggiorna
        </Button>
      </header>

      {isLoading ? (
        <p className="text-sm text-text/60">Caricamento prenotazioni…</p>
      ) : reservations.length === 0 ? (
        <p className="text-sm text-text/60">Non ci sono prenotazioni al momento.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((reservation) => {
            const nextStatus =
              statusFlow[statusFlow.indexOf(reservation.status) + 1] ?? null;
            const formatter = new Intl.DateTimeFormat('it-IT', {
              weekday: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });
            const slotLabel = formatter.format(new Date(reservation.pickupSlot));
            return (
              <li
                key={reservation.id}
                className="rounded-3xl border border-black/5 bg-primary/5 p-4 text-sm text-text/80"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                      #{reservation.id.slice(0, 6)}
                    </p>
                    <p className="text-base font-semibold text-text">
                      {reservation.customer.name}{' '}
                      <span className="text-xs font-medium text-text/60">({slotLabel})</span>
                    </p>
                    <p className="text-xs text-text/60">
                      {reservation.items.length} articoli · €{reservation.subtotal.toFixed(2)} ·{' '}
                      {reservation.customer.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                      {statusLabel(reservation.status)}
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={!nextStatus}
                      onClick={() => advanceStatus(reservation)}
                    >
                      {nextStatus ? `→ ${statusLabel(nextStatus)}` : 'Completato'}
                    </Button>
                  </div>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2 text-xs text-text/60">
                  {reservation.items.map((item) => (
                    <li key={item.id} className="rounded-full bg-white px-3 py-1">
                      {item.qty}× {item.nameSnapshot}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
