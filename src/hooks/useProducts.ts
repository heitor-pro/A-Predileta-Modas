import { useEffect, useState } from 'react';
import { listProducts } from '@/services/products.service';
import type { Product, ProductFilters } from '@/types/product';

export function useProducts(filters: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    listProducts(filters)
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Erro ao carregar produtos.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { products, loading, error };
}
