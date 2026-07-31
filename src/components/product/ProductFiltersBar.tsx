import { useCategories } from '@/hooks/useCategories';
import type { ProductFilters, ProductSortOption } from '@/types/product';
import { cn } from '@/lib/utils';

interface Props {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
}

const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: 'newest', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'promo', label: 'Promoções' },
  { value: 'name', label: 'Nome' },
];

export function ProductFiltersBar({ filters, onChange }: Props) {
  const { categories } = useCategories();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange({ ...filters, categorySlug: undefined })}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            !filters.categorySlug
              ? 'border-ink bg-ink text-paper dark:border-paper dark:bg-paper dark:text-ink'
              : 'border-silver-300 dark:border-silver-700 text-silver-600 dark:text-silver-300'
          )}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange({ ...filters, categorySlug: cat.slug })}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm transition-colors',
              filters.categorySlug === cat.slug
                ? 'border-ink bg-ink text-paper dark:border-paper dark:bg-paper dark:text-ink'
                : 'border-silver-300 dark:border-silver-700 text-silver-600 dark:text-silver-300'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <select
        value={filters.sort ?? 'newest'}
        onChange={(e) => onChange({ ...filters, sort: e.target.value as ProductSortOption })}
        className=" text-black rounded-full border border-silver-300 dark:border-silver-700 dark:bg-black dark:text-white bg-transparent px-4 py-1.5 text-sm outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
