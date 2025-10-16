'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { categories, products, restaurantInfo, offers, type Product } from '@/data/mockData';
import { CategoryTabs } from '@/components/CategoryTabs';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { useCartStore } from '@/lib/store/cart-store';
import { useToast } from '@/components/ui/toast-provider';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SectionRefMap = Record<string, HTMLElement | null>;

const ratingValue = '4.8';
const ratingLabel = '120+ recensioni';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.slug ?? '');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isModalOpen, setModalOpen] = useState(false);

  const sectionRefs = useRef<SectionRefMap>({});

  const items = useCartStore((state) => state.items);
  const add = useCartStore((state) => state.add);
  const inc = useCartStore((state) => state.inc);
  const dec = useCartStore((state) => state.dec);
  const remove = useCartStore((state) => state.remove);
  const subtotal = useCartStore((state) => state.subtotal());

  const { toast } = useToast();
  const promo = offers[0];

  const productsByCategory = useMemo(() => {
    return categories.reduce<Record<string, Product[]>>((acc, category) => {
      acc[category.slug] = products.filter((product) => product.categorySlug === category.slug);
      return acc;
    }, {});
  }, [categories, products]);

  const filteredProducts = productsByCategory[activeCategory] ?? [];

  const handleAdd = useCallback(
    (product: Product, quantity = 1) => {
      add(product, quantity);
      toast({ title: 'Aggiunto al carrello', description: product.name });
    },
    [add, toast]
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
  }, []);

  const todayIndex = useMemo(() => {
    const now = new Date();
    return (now.getDay() + 6) % 7;
  }, []);

  const todayHours = restaurantInfo.hours[todayIndex];
  const phoneHref = `tel:${restaurantInfo.phone.replace(/\s+/g, '')}`;

  const renderPromo = () =>
    promo ? (
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-5 text-white shadow-md shadow-emerald-200/40">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
          {promo.title}
        </span>
        {promo.highlight ? (
          <p className="mt-1 text-lg font-semibold text-white">{promo.highlight}</p>
        ) : null}
        <p className="mt-2 text-sm text-white/80">{promo.description}</p>
      </div>
    ) : null;

  return (
    <div className="space-y-6 lg:space-y-10">
      <div className="lg:hidden space-y-6">
        {renderPromo()}
        <CategoryTabs
          categories={categories}
          active={activeCategory}
          onSelect={(slug) => setActiveCategory(slug)}
        />
        <div className="grid grid-cols-1 gap-5 pb-8">
          {filteredProducts.map((product) => (
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
      </div>

      <div className="hidden lg:block">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-[280px_minmax(0,1fr)_320px] gap-6 pb-12">
            <aside className="sticky top-4 h-max space-y-4">
              <div className="rounded-3xl bg-white p-6 shadow-md shadow-emerald-100/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    GB
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-text">GreenBurger</p>
                    <p className="text-sm text-text/60">{restaurantInfo.address}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 text-sm text-text/70">
                  <span className="flex items-center gap-1 text-primary">
                    <span aria-hidden="true">⭐️</span>
                    {ratingValue}
                  </span>
                  <span>{ratingLabel}</span>
                </div>
                {todayHours ? (
                  <p className="mt-3 text-sm text-text/70">
                    Oggi: {todayHours.open} - {todayHours.close}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3 rounded-3xl bg-white p-6 shadow-md shadow-emerald-100/40">
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
                  <Link href={restaurantInfo.mapsUrl} target="_blank" rel="noopener noreferrer">
                    <span aria-hidden="true">🗺️</span> Indicazioni
                  </Link>
                </Button>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-md shadow-emerald-100/40">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-text/60">
                  Categorie
                </h3>
                <div className="mt-4 flex flex-col gap-1">
                  {categories.map((category) => {
                    const isActive = activeCategory === category.slug;
                    return (
                      <button
                        key={category.slug}
                        onClick={() => handleCategoryClick(category.slug)}
                        className={cn(
                          'flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-text/60 hover:text-text'
                        )}
                      >
                        <span>{category.name}</span>
                        <span
                          className={cn(
                            'h-2 w-2 rounded-full transition-colors',
                            isActive ? 'bg-primary' : 'bg-transparent'
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <div className="space-y-10">
              {renderPromo()}
              {categories.map((category) => {
                const categoryProducts = productsByCategory[category.slug] ?? [];
                if (categoryProducts.length === 0) {
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
                      <span className="text-sm text-text/50">
                        {categoryProducts.length} prodotti
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
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
              })}
            </div>

            <aside className="sticky top-4 h-max space-y-4">
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
