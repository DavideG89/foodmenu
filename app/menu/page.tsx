'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { restaurantInfo, offers, type Product, type Category } from '@/data/mockData';
import { CategoryTabs } from '@/components/CategoryTabs';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { useCartStore } from '@/lib/store/cart-store';
import { useToast } from '@/components/ui/toast-provider';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SectionRefMap = Record<string, HTMLElement | null>;

type MenuResponse = {
  categories: Category[];
  items: Product[];
};

const ratingValue = '4.8';
const ratingLabel = '120+ recensioni';

export default function MenuPage() {
  const [menuData, setMenuData] = useState<MenuResponse | null>(null);
  const [isMenuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);
  const menuCategories = useMemo<Category[]>(() => {
    const baseCategories = menuData?.categories ?? [];
    if (!baseCategories.length) {
      return [];
    }
    return [{ name: 'I più venduti', slug: 'best-sellers', image: '/Piuvenduti.png' }, ...baseCategories];
  }, [menuData]);
  const [activeCategory, setActiveCategory] = useState('');
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isModalOpen, setModalOpen] = useState(false);
  const dealSliderRef = useRef<HTMLDivElement | null>(null);
  const [dealCanScrollPrev, setDealCanScrollPrev] = useState(false);
  const [dealCanScrollNext, setDealCanScrollNext] = useState(false);

  const sectionRefs = useRef<SectionRefMap>({});

  const items = useCartStore((state) => state.items);
  const add = useCartStore((state) => state.add);
  const inc = useCartStore((state) => state.inc);
  const dec = useCartStore((state) => state.dec);
  const remove = useCartStore((state) => state.remove);
  const subtotal = useCartStore((state) => state.subtotal());

  const { toast } = useToast();
  const promo = offers[0];

  const loadMenu = useCallback(async () => {
    try {
      setMenuLoading(true);
      setMenuError(null);
      const response = await fetch('/api/menu');
      if (!response.ok) {
        throw new Error('Impossibile caricare il menù');
      }
      const data = (await response.json()) as MenuResponse;
      setMenuData(data);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Errore inatteso';
      setMenuError(message);
      toast({
        title: 'Errore caricamento menù',
        description: message,
        duration: 4000
      });
    } finally {
      setMenuLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  useEffect(() => {
    if (!menuCategories.length) {
      return;
    }
    setActiveCategory((current) => {
      if (!current || !menuCategories.some((category) => category.slug === current)) {
        return menuCategories[0].slug;
      }
      return current;
    });
  }, [menuCategories]);

  const availableItems = useMemo(
    () => (menuData?.items ?? []).filter((item) => item.available !== false),
    [menuData?.items]
  );
  const hasAnyProduct = availableItems.length > 0;

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const bestSellerProducts = useMemo(() => {
    if (!availableItems.length) {
      return [];
    }
    const flagged = availableItems.filter((product) =>
      product.badges?.some((badge) => badge.toLowerCase().includes('best'))
    );
    if (flagged.length > 0) {
      return flagged;
    }
    return availableItems.slice(0, 6);
  }, [availableItems]);

  const dealProducts = useMemo(() => {
    return availableItems.filter((product) => Boolean(product.promoPrice)).slice(0, 3);
  }, [availableItems]);

  const matchesQuery = useCallback(
    (product: Product) => {
      if (!normalizedQuery) {
        return true;
      }
      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery)
      );
    },
    [normalizedQuery]
  );

  const productsByCategory = useMemo(() => {
    const map: Record<string, Product[]> = { 'best-sellers': bestSellerProducts };
    (menuData?.categories ?? []).forEach((category) => {
      map[category.slug] = availableItems.filter(
        (product) => product.categorySlug === category.slug
      );
    });
    return map;
  }, [menuData, availableItems, bestSellerProducts]);

  const filteredProducts = useMemo(() => {
    const byCategory = productsByCategory[activeCategory] ?? [];
    return byCategory.filter(matchesQuery);
  }, [productsByCategory, activeCategory, matchesQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleAdd = useCallback(
    (product: Product, quantity = 1) => {
      if (product.available === false) {
        toast({
          title: 'Non disponibile',
          description: 'Questo piatto non è al momento disponibile.',
          duration: 3000
        });
        return;
      }
      add(product, quantity);
      toast({
        title: 'Aggiunto al carrello',
        description: product.name,
        duration: 3000
      });
    },
    [add, toast]
  );

  const updateDealNav = useCallback(() => {
    const container = dealSliderRef.current;
    if (!container) {
      setDealCanScrollPrev(false);
      setDealCanScrollNext(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setDealCanScrollPrev(scrollLeft > 8);
    setDealCanScrollNext(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  const scrollDeals = useCallback(
    (direction: 'prev' | 'next') => {
      const container = dealSliderRef.current;
      if (!container) {
        return;
      }
      const distance = direction === 'next' ? container.clientWidth : -container.clientWidth;
      container.scrollBy({ left: distance, behavior: 'smooth' });
      if (typeof window !== 'undefined') {
        window.setTimeout(updateDealNav, 360);
      }
    },
    [updateDealNav]
  );

  const handleCategoryClick = useCallback((slug: string) => {
    setActiveCategory(slug);

    if (typeof window === 'undefined') {
      return;
    }

    const target = document.getElementById(slug);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!window.matchMedia('(min-width: 1024px)').matches) {
          return;
        }

        if (entries.length === 0) {
          return;
        }

        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        let slug: string | null = null;

        if (visibleEntries.length > 0) {
          slug = visibleEntries[0].target.getAttribute('data-category-slug');
        } else {
          const closest = entries
            .slice()
            .sort(
              (a, b) =>
                Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
            )[0];
          slug = closest?.target.getAttribute('data-category-slug') ?? null;
        }

        if (slug) {
          setActiveCategory((current) => (current === slug ? current : slug));
        }
      },
      {
        rootMargin: '-120px 0px -55%',
        threshold: [0.2, 0.4, 0.6]
      }
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [menuCategories, productsByCategory]);

  useEffect(() => {
    const container = dealSliderRef.current;
    if (typeof window === 'undefined' || !container) {
      return;
    }

    updateDealNav();

    const handleResize = () => {
      updateDealNav();
    };

    container.addEventListener('scroll', updateDealNav, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', updateDealNav);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateDealNav, dealProducts.length]);

  useEffect(() => {
    updateDealNav();
  }, [updateDealNav, dealProducts.length]);

  const todayIndex = useMemo(() => {
    const now = new Date();
    return (now.getDay() + 6) % 7;
  }, []);

  const todayHours = restaurantInfo.hours[todayIndex];
  const phoneHref = `tel:${restaurantInfo.phone.replace(/\s+/g, '')}`;

  const showPromo = Boolean(promo) && !normalizedQuery;

  const promoBanner = showPromo ? (
    <div className="rounded-3xl border border-gleam/60 bg-gleam p-5 text-moss shadow-[0_24px_48px_rgba(255,231,135,0.45)]">
      <span className="text-xs font-semibold uppercase tracking-wide text-moss/80">
        {promo?.title}
      </span>
      {promo?.highlight ? (
        <p className="mt-1 text-lg font-semibold text-moss">{promo.highlight}</p>
      ) : null}
      <p className="mt-2 text-sm text-moss/75">{promo?.description}</p>
    </div>
  ) : null;

  const desktopSections = menuCategories.map((category) => {
    const categoryProducts = (productsByCategory[category.slug] ?? []).filter(matchesQuery);
    if (categoryProducts.length === 0) {
      sectionRefs.current[category.slug] = null;
      return null;
    }

    return (
      <section
        key={category.slug}
        id={category.slug}
        data-category-slug={category.slug}
        ref={(element) => {
          sectionRefs.current[category.slug] = element;
        }}
        className="scroll-mt-32 space-y-4"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-2xl font-semibold text-text">{category.name}</h2>
          <span className="text-sm text-text/50">{categoryProducts.length} prodotti</span>
        </div>
        <div className="grid grid-cols-1 gap-5">
          {categoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={(p) => handleAdd(p)}
              onOpen={(p) => {
                setSelectedProduct(p);
                setModalOpen(true);
              }}
            />
          ))}
        </div>
      </section>
    );
  });

  const hasDesktopResults = desktopSections.some(Boolean);

  if (isMenuLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-text/60">
        Caricamento del menù…
      </div>
    );
  }

  if (menuError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-text">
        <div className="space-y-1">
          <p className="text-lg font-semibold">Impossibile caricare il menù</p>
          <p className="text-sm text-text/60">{menuError}</p>
        </div>
        <Button onClick={loadMenu}>Riprova</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-10">
      <div className="lg:hidden space-y-6">
        {promoBanner}
        <CategoryTabs
          categories={menuCategories}
          active={activeCategory}
          onSelect={(slug) => setActiveCategory(slug)}
          searchValue={query}
          onSearchChange={handleSearchChange}
        />
        <div className="grid grid-cols-1 gap-5 pb-8">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white/80 px-4 py-8 text-center text-sm text-text/60">
              {normalizedQuery
                ? 'Nessun prodotto trovato. Prova a cercare un altro piatto.'
                : 'Il menù è in aggiornamento. Torna più tardi per nuove proposte.'}
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={(p) => handleAdd(p)}
                onOpen={(p) => {
                  setSelectedProduct(p);
                  setModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-8 pb-6">
            <div className="space-y-12">
              <div className="sticky top-[4.5rem] z-20 bg-transparent pb-2 pt-2">
                <div className="rounded-3xl border border-white/60 bg-white/95 p-5 shadow-soft backdrop-blur">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      🔍
                    </span>
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => handleSearchChange(event.target.value)}
                      placeholder="Cerca nel menù..."
                      className="w-full rounded-2xl border border-black/5 bg-white px-12 py-3 text-sm text-text placeholder:text-text/50 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
                      autoComplete="off"
                    />
                    {query ? (
                      <button
                        type="button"
                        onClick={() => handleSearchChange('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-text/5 px-2 py-1 text-xs font-semibold text-text/60 transition hover:bg-text/10"
                        aria-label="Cancella ricerca"
                      >
                        ✕
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {menuCategories.map((category) => {
                      const isActive = activeCategory === category.slug;
                      return (
                        <button
                          key={category.slug}
                          onClick={() => handleCategoryClick(category.slug)}
                          className={cn(
                            'group flex min-w-[100px] flex-col items-center  rounded-2xl border border-transparent bg-transparent px-3 py-2 text-xs font-semibold text-text/70 transition-all duration-300',
                            isActive
                              ? 'border-primary/40 text-primary'
                              : 'hover:border-primary/20 hover:text-text'
                          )}
                        >
                          {category.image ? (
                            <span className="relative flex h-20 w-24 items-center justify-center overflow-hidden">
                              <Image
                                src={category.image}
                                alt={category.name}
                                width={64}
                                height={64}
                                className="object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                            </span>
                          ) : (
                            <span className="flex h-16 w-16 items-center justify-center text-2xl text-primary">
                              ★
                            </span>
                          )}
                          <span className="text-center text-sm">{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {dealProducts.length ? (
                <section className="space-y-5 rounded-3xl border border-white/60 bg-white/95 p-6 shadow-soft backdrop-blur">
                  <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                        Special Deals
                      </p>
                      <h2 className="text-2xl font-semibold text-text">Combo da non perdere</h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text/50">
                      <button
                        type="button"
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full border text-lg transition',
                          dealCanScrollPrev
                            ? 'border-text/10 text-text/60 hover:border-primary/40 hover:text-primary'
                            : 'border-text/5 text-text/30 cursor-not-allowed'
                        )}
                        onClick={() => scrollDeals('prev')}
                        aria-label="Mostra offerte precedenti"
                        disabled={!dealCanScrollPrev}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full border text-lg transition',
                          dealCanScrollNext
                            ? 'border-text/10 text-text/60 hover:border-primary/40 hover:text-primary'
                            : 'border-text/5 text-text/30 cursor-not-allowed'
                        )}
                        onClick={() => scrollDeals('next')}
                        aria-label="Mostra offerte successive"
                        disabled={!dealCanScrollNext}
                      >
                        ›
                      </button>
                    </div>
                  </header>
                  <div className="relative">
                    <div
                      ref={dealSliderRef}
                      className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3 no-scrollbar"
                    >
                      {dealProducts.map((product) => {
                        const finalPrice = product.promoPrice ?? product.price;
                        const isAvailable = product.available !== false;
                        return (
                          <div
                            key={product.id}
                            className="flex w-full flex-shrink-0 snap-start md:flex-[0_0_calc(50%-12px)] xl:flex-[0_0_520px]"
                          >
                            <article
                              className="group flex h-full min-h-[280px] w-full flex-col overflow-hidden rounded-[32px] border border-primary/10 bg-white text-left  transition hover:-translate-y-1 hover:shadow-lg md:flex-row"
                              onClick={() => {
                                setSelectedProduct(product);
                                setModalOpen(true);
                              }}
                            >
                              <div className="relative order-first h-48 w-full overflow-hidden bg-pearl/80 shadow-inner md:order-last md:h-auto md:min-h-[180px] md:w-52">
                                <Image
                                  src={`${product.image}?auto=format&fit=crop&w=560&q=80`}
                                  alt={product.name}
                                  fill
                                  className="object-cover transition duration-300 group-hover:scale-105"
                                  sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 16rem, 100vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent" />
                              </div>
                              <div className="order-last flex h-full min-w-0 flex-1 flex-col gap-5 p-6 md:order-first md:p-8">
                                <div className="flex flex-col gap-3">
                                  <div className="flex flex-wrap items-center gap-3 text-text">
                                    <h3 className="text-xl font-semibold text-text">{product.name}</h3>
                                    {product.badges?.length ? (
                                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                        {product.badges[0]}
                                      </span>
                                    ) : null}
                                  </div>
                                  <p className="max-w-xl text-sm text-text/70">{product.description}</p>
                                  <div className="flex flex-col gap-1">
                                    {product.promoPrice ? (
                                      <span className="text-xs uppercase tracking-wide text-text/40 line-through">
                                        {formatCurrency(product.price)}
                                      </span>
                                    ) : null}
                                    <span className="text-2xl font-semibold text-primary">
                                      {formatCurrency(finalPrice)}
                                    </span>
                                    {product.promoPrice ? (
                                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                                        Risparmi {formatCurrency(product.price - finalPrice)}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="mt-auto flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                  
                                  <Button
                                    className="w-full rounded-full px-6 py-2 text-sm sm:w-auto"
                                    disabled={!isAvailable}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      if (isAvailable) {
                                        handleAdd(product);
                                      }
                                    }}
                                  >
                                    {isAvailable ? 'Ordina ora' : 'Non disponibile'}
                                  </Button>
                                </div>
                              </div>
                            </article>
                          </div>
                        );
                      })}
                    </div>
                    
                    
                  </div>
                </section>
              ) : null}

              {promoBanner}

              {hasDesktopResults ? (
                desktopSections
              ) : (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-sm text-text/60">
                  {normalizedQuery || hasAnyProduct
                    ? 'Nessun prodotto corrisponde alla ricerca. Prova a cambiare termini o categoria.'
                    : 'Il menù è in aggiornamento. Torna più tardi per nuove proposte.'}
                </div>
              )}
            </div>

            <aside className="sticky top-[5.5rem] h-max">
              <div className="space-y-4">
                <div className="rounded-3xl bg-white p-6 shadow-md shadow-emerald-100/40">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                        GB
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-text">GreenBurger</p>
                        <p className="text-sm text-text/60">{restaurantInfo.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text/70">
                      <span className="flex items-center gap-1 text-primary">
                        <span aria-hidden="true">⭐️</span>
                        {ratingValue}
                      </span>
                      <span>{ratingLabel}</span>
                    </div>
                    {todayHours ? (
                      <p className="text-sm text-text/70">
                        Oggi: {todayHours.open} - {todayHours.close}
                      </p>
                    ) : null}
                    <div className="flex flex-col gap-3">
                      <Button asChild fullWidth className="gap-2">
                        <Link href={phoneHref}>
                          <span aria-hidden="true">📞</span> Chiama
                        </Link>
                      </Button>
                      <Button
                        asChild
                        fullWidth
                        variant="secondary"
                        className="gap-2"
                      >
                        <Link
                          href={restaurantInfo.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span aria-hidden="true">🗺️</span> Indicazioni
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-md shadow-emerald-100/40">
                <h2 className="text-xl font-semibold text-text">Il tuo carrello</h2>
                {items.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-background px-4 py-8 text-center text-sm text-text/60">
                    Il carrello è vuoto. Aggiungi qualcosa dal menù.
                  </div>
                ) : (
                  <>
                    <ul className="mt-4 space-y-4">
                      {items.map((item) => {
                        const unitPrice = item.product.promoPrice ?? item.product.price;
                        const lineTotal = unitPrice * item.quantity;
                        return (
                          <li key={item.product.id} className="flex gap-3">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                              <Image
                                src={`${item.product.image}?auto=format&fit=crop&w=200&q=80`}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-1 flex-col gap-2">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-text">
                                    {item.product.name}
                                  </p>
                                  <p className="text-xs text-text/60">
                                    {formatCurrency(unitPrice)} x {item.quantity}
                                  </p>
                                </div>
                                <button
                                  onClick={() => remove(item.product.id)}
                                  className="text-xs text-text/40 transition hover:text-text/70"
                                  aria-label={`Rimuovi ${item.product.name} dal carrello`}
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-background px-3 py-1">
                                  <button
                                    onClick={() => dec(item.product.id)}
                                    className="text-sm font-semibold text-text/70 transition hover:text-text"
                                    aria-label={`Diminuisci ${item.product.name}`}
                                  >
                                    −
                                  </button>
                                  <span className="text-sm font-semibold text-text">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => inc(item.product.id)}
                                    className="text-sm font-semibold text-text/70 transition hover:text-text"
                                    aria-label={`Aumenta ${item.product.name}`}
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="text-sm font-semibold text-text">
                                  {formatCurrency(lineTotal)}
                                </span>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-6 flex items-center justify-between text-sm text-text/70">
                      <span>Subtotale</span>
                      <span className="text-base font-semibold text-text">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <Button asChild fullWidth className="mt-4">
                      <Link href="/cart">Checkout (contanti)</Link>
                    </Button>
                  </>
                )}
              </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={(open) => setModalOpen(open)}
        onAdd={(product, quantity) => {
          handleAdd(product, quantity);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
