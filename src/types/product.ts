export type ProductCategory =
  | 'vestidos'
  | 'blusas'
  | 'calcas'
  | 'conjuntos'
  | 'moda-fitness'
  | 'moda-intima'
  | 'infantil'
  | 'acessorios'
  | 'outros';

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  storage_path: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  promo_price: number | null;
  category_id: string;
  category?: Category;
  sizes: string[];
  colors: string[];
  stock: number;
  is_promo: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;
  shipping_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
}

export type ProductSortOption =
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'promo'
  | 'name';

export interface ProductFilters {
  search?: string;
  categorySlug?: string;
  onlyPromo?: boolean;
  onlyFeatured?: boolean;
  onlyNew?: boolean;
  sort?: ProductSortOption;
}

export interface ProductFormInput {
  name: string;
  description: string;
  price: number;
  promo_price: number | null;
  category_id: string;
  sizes: string[];
  colors: string[];
  stock: number;
  is_promo: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;
  shipping_available: boolean;
}
