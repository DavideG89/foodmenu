'use client';

import { useMemo, useState } from 'react';
import { categories, products, type Product } from '@/data/mockData';
import { CategoryTabs } from '@/components/CategoryTabs';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { useCartStore } from '@/lib/store/cart-store';
import { useToast } from '@/components/ui/toast-provider';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.slug ?? '');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isModalOpen, setModalOpen] = useState(false);
  const add = useCartStore((state) => state.add);
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.categorySlug === activeCategory);
  }, [activeCategory]);

  const handleAdd = (product: Product, quantity = 1) => {
    add(product, quantity);
    toast({ title: 'Aggiunto al carrello', description: product.name });
  };

  return (
    <div className="space-y-6">
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
