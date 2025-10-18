import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { products, restaurantInfo } from '@/data/mockData';
const bestSellers = products.slice(0, 3);

const heroHighlights = [
  { value: '20+', label: 'Ricette signature' },
  { value: '15k', label: 'Clienti soddisfatti' },
  { value: '4.9', label: 'Valutazione media' }
];

const aboutHighlights = [
  'Pane brioche artigianale e salse homemade',
  'Ingredienti locali selezionati ogni mattina',
  'Cucina aperta tutto il giorno, anche per takeaway'
];

const whyChoose = [
  {
    title: 'Ingredienti freschi',
    description: 'Collaboriamo con produttori locali per portare in tavola solo materie prime di stagione.',
    icon: '🥬'
  },
  {
    title: 'Super gusto',
    description: 'Ricette ideate dal nostro chef con mix di salse e topping esclusivi.',
    icon: '🔥'
  },
  {
    title: 'Consegna smart',
    description: 'Ordini pronti in 15 minuti e ritiro veloce senza code alla cassa.',
    icon: '⚡️'
  }
];

const testimonial = {
  name: 'Mary Lukach',
  role: 'Food Blogger',
  quote:
    '“Trovare burger così curati non è scontato: pane croccante, salse equilibrate e personale gentilissimo. GreenBurger è la mia scelta fissa!”'
};

export default function Home() {
  const mapsEmbedUrl = `${restaurantInfo.mapsUrl}${
    restaurantInfo.mapsUrl.includes('?') ? '&' : '?'
  }output=embed`;

  return (
    <>
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-b from-gleam/90 via-pearl to-white pb-28 sm:pb-32">
        <span className="pointer-events-none absolute -left-24 top-10 hidden h-80 w-80 rounded-full bg-accent/30 blur-3xl lg:block" />
        <span className="pointer-events-none absolute -right-28 top-1/3 hidden h-72 w-72 rounded-full bg-primary/25 blur-3xl lg:block" />

        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-24 px-6 pt-12 sm:gap-28 md:px-10 lg:px-16 lg:pt-20">
          <section className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="space-y-6 lg:max-w-4xl">
          
              <h1 className="text-4xl font-bold leading-tight text-text sm:text-5xl">
                Serviamo cibo <span className="text-accent">squisito</span> ogni giorno
              </h1>
              <p className="max-w-xl text-sm text-text/70 sm:text-base">
                Smash burger, sides croccanti e drink artigianali. Che tu voglia fermarti o prendere da asporto, sei nel posto giusto per gustare street food di qualità.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/menu">Vai al menù</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/pickup">Preferisci il pickup?</Link>
                </Button>
              </div>
              <div className="grid gap-4 pt-6 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-primary/15 bg-pearl/80 px-4 py-3 text-center shadow-sm backdrop-blur-sm"
                  >
                    <p className="text-2xl font-semibold text-text">{item.value}</p>
                    <p className="text-xs font-medium uppercase tracking-widest text-text/50">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-10 aspect-square w-full max-w-lg justify-self-end rounded-full bg-gleam/50 p-6 sm:p-10 lg:mt-0">
              <span className="absolute -left-6 top-10 hidden h-20 w-20 rounded-full bg-white/60 shadow-soft lg:block" />
              <div className="relative h-full w-full overflow-hidden rounded-full border-[6px] border-pearl shadow-[0_25px_45px_rgba(237,122,19,0.35)]">
                <img
                  src="/hamburger-1.jpg"
                  alt="Burger GreenBurger"
                  className="h-full w-full object-cover"
                />
              </div>
              <img
                src="/fries1.jpg"
                alt="Patate rustiche"
                className="absolute -bottom-6 -left-10 hidden w-36 rotate-[-10deg] rounded-3xl border-4 border-pearl shadow-xl sm:block"
              />
              <img
                src="/coca.jpg"
                alt="Drink rinfrescante"
                className="absolute -right-6 top-6 hidden w-24 rounded-3xl border-4 border-pearl shadow-lg sm:block"
              />
            </div>
          </section>

          <section className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="space-y-5 lg:max-w-3xl">
              <span className="inline-flex w-max items-center gap-2 rounded-full bg-accent/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
                — Chi siamo
              </span>
              <h2 className="text-3xl font-semibold text-text sm:text-4xl">Il burger bar dal mood brooklynese</h2>
              <p className="text-sm text-text/70 sm:text-base">
                Siamo un team di chef e bartender che ama sperimentare. Prepariamo pane brioche in laboratorio,
                affumichiamo le carni in casa e firmiamo ogni burger con salse studiate per esaltare gli ingredienti.
                Ogni ordine viene rifinito espesso davanti a te.
              </p>
              <ul className="space-y-3 text-sm text-text/80 sm:text-base">
                {aboutHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-[2px] text-accent">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-4 w-max">
                <Link href="/menu">Scopri il menù completo</Link>
              </Button>
            </div>
            <div className="relative flex items-center justify-center">
              <span className="absolute -bottom-10 -left-6 hidden h-36 w-36 rounded-full bg-primary/20 blur-xl lg:block" />
              <div className="relative z-[1] overflow-hidden rounded-[28px] border-[6px] border-pearl shadow-[0_25px_45px_rgba(106,128,66,0.35)]">
                <img
                  src="/hamburger-2.jpg"
                  alt="Chef al lavoro in cucina"
                  className="h-full w-full max-h-[360px] object-cover"
                />
              </div>
              <img
                src="https://images.unsplash.com/photo-1604908176997-12518821b355?auto=format&fit=crop&w=320&q=80"
                alt="Bottiglia di salsa artigianale"
                className="absolute -right-8 bottom-6 hidden w-32 rotate-12 rounded-3xl border-[6px] border-pearl shadow-xl sm:block"
              />
            </div>
          </section>

          <section className="space-y-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex w-max items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                  — Best seller
                </span>
                <h2 className="mt-3 text-3xl font-semibold text-text sm:text-4xl">I piatti più amati</h2>
                <p className="text-sm text-text/70 sm:text-base">
                  Una selezione dei nostri burger e sides più richiesti dalla community GreenBurger.
                </p>
              </div>
              <Link
                href="/menu"
                className="text-sm font-semibold text-primary transition hover:text-primary/80"
              >
                Vedi tutto →
              </Link>
            </div>
            <div className="space-y-6">
              {bestSellers.map((product) => {
                return (
                  <article
                    key={product.id}
                    className="flex items-start gap-6 sm:gap-8"
                  >
                    <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-[28px] sm:h-48 sm:w-48">
                      <img
                        src={`${product.image}?auto=format&fit=crop&w=800&q=80`}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                      {product.badges?.length ? (
                        <span className="absolute left-4 top-4 rounded-full bg-gleam px-3 py-1 text-xs font-semibold text-moss shadow">
                          {product.badges[0]}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-3">
                      <h3 className="text-xl font-semibold text-text sm:text-2xl">{product.name}</h3>
                      <p className="text-sm text-text/70 sm:text-base">{product.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="space-y-4 lg:max-w-2xl">
              <span className="inline-flex w-max items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                — Perché sceglierci
              </span>
              <h2 className="text-3xl font-semibold text-text sm:text-4xl">Qualità da mordere</h2>
              <p className="text-sm text-text/70 sm:text-base">
                Dietro ogni burger c&apos;è un processo studiato. Dalla selezione dei fornitori alle marinature a lunga cottura, tutto è pensato per darti il massimo del gusto in ogni morso.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {whyChoose.map((feature) => (
                <div
                  key={feature.title}
                  className="flex h-full flex-col gap-3 rounded-[24px] border border-primary/15 bg-pearl/80 p-5 shadow-sm backdrop-blur-sm"
                >
                  <span aria-hidden="true" className="text-2xl">
                    {feature.icon}
                  </span>
                  <h3 className="text-base font-semibold text-text">{feature.title}</h3>
                  <p className="text-sm text-text/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="order-2 space-y-6 lg:order-1 lg:max-w-2xl">
              <span className="inline-flex w-max items-center gap-2 rounded-full bg-accent/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
                — Cosa dicono di noi
              </span>
              <blockquote className="text-lg font-medium text-text sm:text-xl">
                {testimonial.quote}
              </blockquote>
              <div>
                <p className="text-sm font-semibold text-text">{testimonial.name}</p>
                <p className="text-xs uppercase tracking-widest text-text/60">{testimonial.role}</p>
              </div>
              <div className="flex gap-4">
                <span aria-label="Valutazione 5 su 5" className="text-accent">
                  ★★★★★
                </span>
                <p className="text-xs text-text/50">+500 recensioni online</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-[28px] border-[6px] border-pearl shadow-[0_25px_45px_rgba(237,122,19,0.25)]">
                <img
                  src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80"
                  alt="Clienti felici nel locale"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-primary shadow">
                  4.9 • Google Reviews
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-primary px-6 py-14 text-center text-white shadow-[0_25px_45px_rgba(30,48,6,0.35)] sm:px-12 lg:px-16">
            <div className="mx-auto max-w-3xl space-y-6">
              <h2 className="text-3xl font-bold sm:text-4xl">Pronto per ordinare qualcosa di memorabile?</h2>
              <p className="text-sm text-white/80 sm:text-base">
                Sfoglia il menù, personalizza il tuo burger e passa a ritirare. Ti aspettiamo con il grill già caldo.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/menu"
                  className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
                >
                  Vai al menù
                </Link>
                <Link
                  href="/menu#combo"
                  className="inline-flex items-center rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Guarda le combo
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="space-y-5">
              <span className="inline-flex w-max items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                — Vieni a trovarci
              </span>
              <h2 className="text-3xl font-semibold text-text sm:text-4xl">Ti aspettiamo a {restaurantInfo.address.split(',')[0]}</h2>
              <p className="text-sm text-text/70 sm:text-base">
                Siamo aperti tutti i giorni con cucina sempre attiva. Prenota con una chiamata o raggiungici: ti accoglieremo con il profumo di burger appena piastrati.
              </p>
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-text">Indirizzo</dt>
                  <dd className="mt-1 text-text/70">{restaurantInfo.address}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-text">Telefono</dt>
                  <dd className="mt-1 text-text/70">{restaurantInfo.phone}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-text">Email</dt>
                  <dd className="mt-1 text-text/70">{restaurantInfo.email}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-text">Orari</dt>
                  <dd className="mt-1 text-text/70">
                    {restaurantInfo.hours[0].day}: {restaurantInfo.hours[0].open}-{restaurantInfo.hours[0].close}
                    <br />
                    {restaurantInfo.hours[6].day}: {restaurantInfo.hours[6].open}-{restaurantInfo.hours[6].close}
                  </dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="gap-2">
                  <Link href={`tel:${restaurantInfo.phone.replace(/\s+/g, '')}`}>
                    <img src="/phone.png" width={32} alt="" /> Chiama
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="gap-2">
                  <Link href={restaurantInfo.mapsUrl} target="_blank" rel="noopener noreferrer">
                    <img src='/map.png' width={32}></img> Indicazioni
                  </Link>
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-[28px] border border-black/5 bg-pearl/80 shadow-inner">
              <iframe
                title="GreenBurger su Google Maps"
                src={mapsEmbedUrl}
                className="h-72 w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </section>


        </div>
      </div>
    </>
  );
}
