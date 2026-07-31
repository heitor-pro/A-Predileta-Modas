import { useEffect, useState } from 'react';
import { listCategories } from '@/services/categories.service';
import type { Category } from '@/types/product';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
