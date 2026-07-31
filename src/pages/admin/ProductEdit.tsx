import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductForm } from '@/components/admin/ProductForm';
import { updateProduct, listAllProductsAdmin } from '@/services/products.service';
import { supabase } from '@/lib/supabase';
import type { Product, ProductFormInput, ProductImage } from '@/types/product';

export function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;
    // Busca via lista admin (inclui inativos) e filtra pelo id
    listAllProductsAdmin().then((all) => {
      setProduct(all.find((p) => p.id === id) ?? null);
    });
  }, [id]);

  const handleSubmit = async (input: ProductFormInput, images: ProductImage[]) => {
    if (!product) return;
    await updateProduct(product.id, input);

    // sincroniza imagens: remove as que saíram da lista, insere as novas
    const existingIds = product.images.map((i) => i.id);
    const currentIds = images.filter((i) => existingIds.includes(i.id)).map((i) => i.id);
    const toRemove = existingIds.filter((eid) => !currentIds.includes(eid));
    if (toRemove.length > 0) {
      await supabase.from('product_images').delete().in('id', toRemove);
    }

    for (const img of images) {
      if (existingIds.includes(img.id)) {
        await supabase.from('product_images').update({ is_primary: img.is_primary }).eq('id', img.id);
      } else {
        await supabase.from('product_images').insert({
          product_id: product.id,
          url: img.url,
          storage_path: img.storage_path,
          is_primary: img.is_primary,
          sort_order: img.sort_order,
        });
      }
    }

    navigate('/admin/produtos');
  };

  if (!product) {
    return <p className="text-silver-400">Carregando produto…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-3xl italic">Editar produto</h1>
      <ProductForm initial={product} onSubmit={handleSubmit} submitLabel="Salvar alterações" />
    </div>
  );
}
