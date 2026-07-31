import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFiltersBar } from '@/components/product/ProductFiltersBar';
import type { ProductFilters, ProductSortOption } from '@/types/product';

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductFilters = useMemo(
    () => ({
      search: searchParams.get('busca') ?? undefined,
      categorySlug: searchParams.get('categoria') ?? undefined,
      onlyPromo: searchParams.get('promo') === '1',
      onlyNew: searchParams.get('novo') === '1',
      sort: (searchParams.get('ordenar') as ProductSortOption) ?? 'newest',
    }),
    [searchParams]
  );

  const { products, loading } = useProducts(filters);

  const handleFiltersChange = (next: ProductFilters) => {
    const params = new URLSearchParams();
    if (next.search) params.set('busca', next.search);
    if (next.categorySlug) params.set('categoria', next.categorySlug);
    if (next.onlyPromo) params.set('promo', '1');
    if (next.onlyNew) params.set('novo', '1');
    if (next.sort) params.set('ordenar', next.sort);
    setSearchParams(params);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-display text-4xl italic">
        {filters.search ? `Resultados para "${filters.search}"` : 'Todos os produtos'}
      </h1>
      <div className="mb-8">
        <ProductFiltersBar filters={filters} onChange={handleFiltersChange} />
      </div>
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
