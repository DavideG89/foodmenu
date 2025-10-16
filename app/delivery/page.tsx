import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function DeliveryPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="relative h-56 w-full">
          <Image
            src="https://images.unsplash.com/photo-1514516345957-556ca7d90a4c?auto=format&fit=crop&w=1200&q=80"
            alt="Consegna a domicilio"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-6 text-white">
            <span className="inline-flex w-max rounded-full bg-accent px-4 py-1 text-xs font-semibold text-text">
              Delivery
            </span>
            <h1 className="text-3xl font-bold">Consegna a domicilio</h1>
            <p className="text-sm text-white/80">
              Stiamo completando gli ultimi dettagli per portare GreenBurger direttamente da te.
            </p>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <p className="text-sm text-text/70">
            Lascia la tua email o torna tra poco per conoscere la data ufficiale di lancio.
          </p>
          <Button asChild fullWidth>
            <Link href="/pickup">Nel frattempo ordina con pickup</Link>
          </Button>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-soft">
        <h2 className="text-xl font-semibold text-text">Cosa aspettarsi</h2>
        <ul className="mt-3 space-y-3 text-sm text-text/70">
          <li>• Consegna rapida nei quartieri vicini al nostro locale.</li>
          <li>• Stesso menù premium del ritiro in sede.</li>
          <li>• Pagamento in contanti alla consegna, carte in arrivo.</li>
        </ul>
      </section>
    </div>
  );
}
