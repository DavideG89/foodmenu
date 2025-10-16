import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { offers, restaurantInfo } from '@/data/mockData';

export default function PickupPage() {
  const offer = offers[0];
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="relative h-56 w-full">
          <Image
            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80"
            alt="Burger hero"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
            <span className="mb-2 inline-flex w-max rounded-full bg-accent px-4 py-1 text-xs font-semibold text-text">
              Pickup-only
            </span>
            <h1 className="text-3xl font-bold">GreenBurger</h1>
            <p className="mt-2 text-base text-white/80">Ordina online e ritira caldo in sede.</p>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <Button asChild fullWidth>
            <Link href="/menu">Inizia l’ordine</Link>
          </Button>
          <p className="text-center text-sm text-text/70">Pagamento in contanti al ritiro</p>
        </div>
      </section>

      {offer ? (
        <section className="rounded-2xl bg-primary/10 p-5">
          <p className="text-xs font-semibold uppercase text-primary">{offer.title}</p>
          <h2 className="mt-2 text-xl font-semibold text-text">{offer.highlight}</h2>
          <p className="text-sm text-text/70">{offer.description}</p>
        </section>
      ) : null}

      <section className="rounded-2xl bg-white p-5 shadow-soft">
        <h2 className="text-xl font-semibold text-text">Ritiro veloce</h2>
        <p className="mt-2 text-sm text-text/70">
          Prepara l&apos;ordine, paghi in contanti quando arrivi in {restaurantInfo.address}.
        </p>
      </section>
    </div>
  );
}
