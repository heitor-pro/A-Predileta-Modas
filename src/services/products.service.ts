import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import type { Product, ProductFilters, ProductFormInput } from '@/types/product';

// Todas as consultas de leitura usam a tabela "products" com join em categorias e imagens.
// A tabela é protegida por RLS: qualquer pessoa pode LER produtos ativos,
// mas apenas o admin autenticado pode INSERIR/ATUALIZAR/EXCLUIR (ver supabase/migrations).

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  images:product_images(*)
`;

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let query = supabase.from('products').select(PRODUCT_SELECT).eq('is_active', true);

  if (filters.categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filters.categorySlug)
      .single();
    if (category) query = query.eq('category_id', category.id);
  }

  if (filters.onlyPromo) query = query.eq('is_promo', true);
  if (filters.onlyFeatured) query = query.eq('is_featured', true);
  if (filters.onlyNew) query = query.eq('is_new', true);

  if (filters.search) {
    const term = `%${filters.search}%`;
    query = query.or(`name.ilike.${term},description.ilike.${term}`);
  }

  switch (filters.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'promo':
      query = query.order('is_promo', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error) return null;
  return data as unknown as Product;
}

// --- Funções administrativas (exigem sessão autenticada + política RLS de admin) ---

export async function listAllProductsAdmin(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Product[];
}

export async function createProduct(input: ProductFormInput): Promise<Product> {
  const slug = `${slugify(input.name)}-${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from('products')
    .insert({ ...input, slug })
    .select(PRODUCT_SELECT)
    .single();
  if (error) throw error;
  return data as unknown as Product;
}

export async function updateProduct(id: string, input: Partial<ProductFormInput>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(input)
    .eq('id', id)
    .select(PRODUCT_SELECT)
    .single();
  if (error) throw error;
  return data as unknown as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function duplicateProduct(product: Product): Promise<Product> {
  const copy = await createProduct({
    name: `${product.name} (cópia)`,
    description: product.description,
    price: product.price,
    promo_price: product.promo_price,
    category_id: product.category_id,
    sizes: product.sizes,
    colors: product.colors,
    stock: product.stock,
    is_promo: product.is_promo,
    is_featured: product.is_featured,
    is_new: product.is_new,
    is_active: false, // cópia começa inativa até revisão
    shipping_available: product.shipping_available,
  });

  // Duplica as referências de imagem (mesma URL, sem novo upload)
  if (product.images.length > 0) {
    const rows = product.images.map((img) => ({
      product_id: copy.id,
      url: img.url,
      storage_path: img.storage_path,
      is_primary: img.is_primary,
      sort_order: img.sort_order,
    }));
    await supabase.from('product_images').insert(rows);
  }

  return copy;
}

export async function reorderProducts(orderedIds: string[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, index) => supabase.from('products').update({ sort_order: index }).eq('id', id))
  );
}
