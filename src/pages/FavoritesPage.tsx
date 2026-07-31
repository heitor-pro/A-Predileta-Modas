import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { listProducts } from '@/services/products.service';
import { useFavorites } from '@/contexts/FavoritesContext';
import { ProductGrid } from '@/components/product/ProductGrid';
import type { Product } from '@/types/product';

export function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProducts({})
      .then((all) => setProducts(all.filter((p) => favoriteIds.includes(p.id))))
      .finally(() => setLoading(false));
  }, [favoriteIds]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 flex items-center gap-2 font-display text-4xl italic">
        <Heart size={28} /> Favoritos
      </h1>
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
