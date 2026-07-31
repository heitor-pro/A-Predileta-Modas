import { useNavigate } from 'react-router-dom';
import { ProductForm } from '@/components/admin/ProductForm';
import { createProduct } from '@/services/products.service';
import { supabase } from '@/lib/supabase';
import type { ProductImage } from '@/types/product';

export function ProductNew() {
  const navigate = useNavigate();

  const handleSubmit = async (input: Parameters<typeof createProduct>[0], images: ProductImage[]) => {
    const product = await createProduct(input);

    if (images.length > 0) {
      const rows = images.map((img, i) => ({
        product_id: product.id,
        url: img.url,
        storage_path: img.storage_path,
        is_primary: img.is_primary,
        sort_order: i,
      }));
      await supabase.from('product_images').insert(rows);
    }

    navigate('/admin/produtos');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-3xl italic">Novo produto</h1>
      <ProductForm onSubmit={handleSubmit} submitLabel="Cadastrar produto" />
    </div>
  );
}
