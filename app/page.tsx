import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="relative h-56 w-full">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
            alt="GreenBurger counter"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-6 text-white">
            <span className="inline-flex w-max rounded-full bg-accent px-4 py-1 text-xs font-semibold text-text">
              Scegli come ordinare
            </span>
            <h1 className="text-3xl font-bold">GreenBurger</h1>
            <p className="text-sm text-white/80">
              Decidi se ritirare in sede o ricevere il tuo ordine a domicilio.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
        <div>
          <h2 className="text-xl font-semibold text-text">Modalità d&apos;ordine</h2>
          <p className="mt-1 text-sm text-text/70">
            Scegli la soluzione più comoda per te. Puoi modificare la scelta in qualsiasi momento.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-primary/5">
            <div className="space-y-3">
              <span className="inline-flex w-max items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                🚶‍♂️ Pickup
              </span>
              <h3 className="text-lg font-semibold text-text">Ritiro in sede</h3>
              <p className="text-sm text-text/70">
                Ordina online, paga in contanti quando arrivi al nostro locale. Prepariamo tutto
                prima del tuo arrivo.
              </p>
            </div>
            <Button asChild fullWidth className="mt-6">
              <Link href="/pickup">Scegli il pickup</Link>
            </Button>
          </div>

          <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-primary/5">
            <div className="space-y-3">
              <span className="inline-flex w-max items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                🛵 Delivery
              </span>
              <h3 className="text-lg font-semibold text-text">Consegna a domicilio</h3>
              <p className="text-sm text-text/70">
                Stiamo ultimando il servizio di consegna. Presto potrai ricevere GreenBurger dove
                vuoi tu.
              </p>
            </div>
            <Button fullWidth variant="secondary" className="mt-6" disabled>
              Presto disponibile
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-text/60">
          Selezionando una modalità potrai sempre tornare qui per cambiarla.
        </p>
      </section>
    </div>
  );
}
