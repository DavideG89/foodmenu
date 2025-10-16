import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { products, restaurantInfo } from '@/data/mockData';
import { formatCurrency } from '@/lib/format';

const bestSellers = products.slice(0, 3);

const features = [
  {
    title: 'Ingredienti freschi',
    description: 'Selezioniamo solo produttori locali per garantire freschezza e qualità.'
  },
  {
    title: 'Cucina veloce',
    description: 'Ordini pronti in 15 minuti: perfetto per la pausa pranzo o la serata con amici.'
  },
  {
    title: 'Sapore autentico',
    description: 'Ricette firmate dal nostro chef con salse artigianali e pane brioche.'
  }
];

export default function Home() {
  const mapsEmbedUrl = `${restaurantInfo.mapsUrl}${
    restaurantInfo.mapsUrl.includes('?') ? '&' : '?'
  }output=embed`;

  return (
    <>
      <div className="space-y-10 pb-24 sm:pb-0">
        <section className="overflow-hidden rounded-3xl bg-white shadow-soft">
          <div className="relative h-72 w-full lg:h-96">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
              alt="GreenBurger counter"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-6 text-white lg:p-10">
              <span className="inline-flex w-max rounded-full bg-accent px-4 py-1 text-xs font-semibold text-text">
                Scegli come ordinare
              </span>
              <h1 className="text-3xl font-bold lg:text-4xl">GreenBurger</h1>
              <p className="max-w-xl text-sm text-white/80 lg:text-base">
                Decidi se ritirare in sede o ricevere il tuo ordine a domicilio. Il gusto GreenBurger
                è sempre con te.
              </p>
              <div className="hidden sm:flex gap-3">
                <Button asChild>
                  <Link href="/menu">Vai al menù</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/pickup">Preferisci il pickup?</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-soft lg:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-text">I nostri best seller</h2>
              <p className="text-sm text-text/70">Guarda cosa ordinano più spesso i nostri clienti.</p>
            </div>
            <Link href="/menu" className="text-sm font-semibold text-primary hover:text-primary/80">
              Vedi tutto →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bestSellers.map((product) => {
              const finalPrice = product.promoPrice ?? product.price;

              return (
                <article
                  key={product.id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-emerald-100/40 transition hover:-translate-y-1"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={`${product.image}?auto=format&fit=crop&w=800&q=80`}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div>
                      <h3 className="text-lg font-semibold text-text">{product.name}</h3>
                      <p className="mt-1 text-sm text-text/70 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="mt-auto flex items-center gap-2">
                      <span className="text-lg font-bold text-text">{formatCurrency(finalPrice)}</span>
                      {product.promoPrice ? (
                        <span className="text-sm text-text/50 line-through">
                          {formatCurrency(product.price)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-soft lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-text">Chi siamo</h2>
              <p className="text-sm text-text/70">
                Siamo un team di appassionati di street food che porta in città il burger bar stile
                Brooklyn, con prodotti locali e ricette signature dello chef.
              </p>
            </div>
            <div className="grid gap-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-primary">{feature.title}</p>
                  <p className="mt-1 text-xs text-text/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-soft lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-text">Visita il nostro locale</h2>
              <p className="text-sm text-text/70">
                {restaurantInfo.address}. Ci trovi aperti tutti i giorni dalle {restaurantInfo.hours[0].open}{' '}
                alle {restaurantInfo.hours[6].close}. Paghi in contanti al momento del ritiro.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="gap-2">
                  <Link href={`tel:${restaurantInfo.phone.replace(/\s+/g, '')}`}>
                    <span aria-hidden="true">📞</span> Chiama
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="gap-2"
                >
                  <Link href={restaurantInfo.mapsUrl} target="_blank" rel="noopener noreferrer">
                    <span aria-hidden="true">🗺️</span> Indicazioni
                  </Link>
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-black/5">
              <iframe
                title="GreenBurger su Google Maps"
                src={mapsEmbedUrl}
                className="h-64 w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-primary px-6 py-10 text-center text-white shadow-soft lg:px-12">
          <h2 className="text-3xl font-bold">Pronto per ordinare?</h2>
          <p className="mt-2 text-sm text-white/80">
            Scegli i tuoi preferiti e ritira in sede. Pagamento rapido, gusto incredibile.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
            >
              Vai al menù
            </Link>
          </div>
        </section>
      </div>

      <a
        href="/menu"
        className="sm:hidden fixed inset-x-4 bottom-4 z-50 rounded-full border border-emerald-700/10 bg-emerald-600 px-6 py-4 text-center font-semibold text-white shadow-lg"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        🍔 Ordina ora
      </a>
    </>
  );
}
