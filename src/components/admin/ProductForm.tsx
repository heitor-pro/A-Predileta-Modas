import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ProductImageUploader } from './ProductImageUploader';
import { useCategories } from '@/hooks/useCategories';
import { useState } from 'react';
import { slugify } from '@/lib/utils';
import type { Product, ProductFormInput } from '@/types/product';
import type { ProductImage } from '@/types/product';

const schema = z.object({
  name: z.string().min(2, 'Informe o nome do produto'),
  description: z.string().min(5, 'Informe uma descrição'),
  price: z.coerce.number().positive('Informe um preço válido'),
  promo_price: z.coerce.number().nullable().optional(),
  category_id: z.string().min(1, 'Selecione uma categoria'),
  sizes: z.string().min(1, 'Informe ao menos um tamanho'),
  colors: z.string().min(1, 'Informe ao menos uma cor'),
  stock: z.coerce.number().int().min(0, 'Estoque inválido'),
  is_promo: z.boolean(),
  is_featured: z.boolean(),
  is_new: z.boolean(),
  is_active: z.boolean(),
  shipping_available: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface ProductFormProps {
  initial?: Product;
  onSubmit: (input: ProductFormInput, images: ProductImage[]) => Promise<void>;
  submitLabel?: string;
}

export function ProductForm({ initial, onSubmit, submitLabel = 'Salvar produto' }: ProductFormProps) {
  const { categories } = useCategories();
  const [images, setImages] = useState<ProductImage[]>(initial?.images ?? []);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          name: initial.name,
          description: initial.description,
          price: initial.price,
          promo_price: initial.promo_price,
          category_id: initial.category_id,
          sizes: initial.sizes.join(', '),
          colors: initial.colors.join(', '),
          stock: initial.stock,
          is_promo: initial.is_promo,
          is_featured: initial.is_featured,
          is_new: initial.is_new,
          is_active: initial.is_active,
          shipping_available: initial.shipping_available,
        }
      : {
          is_promo: false,
          is_featured: false,
          is_new: true,
          is_active: true,
          shipping_available: true,
          promo_price: null,
        },
  });

  const submit = handleSubmit(async (values) => {
    setSaving(true);
    try {
      await onSubmit(
        {
          name: values.name,
          description: values.description,
          price: values.price,
          promo_price: values.is_promo ? values.promo_price ?? null : null,
          category_id: values.category_id,
          sizes: values.sizes.split(',').map((s) => s.trim()).filter(Boolean),
          colors: values.colors.split(',').map((s) => s.trim()).filter(Boolean),
          stock: values.stock,
          is_promo: values.is_promo,
          is_featured: values.is_featured,
          is_new: values.is_new,
          is_active: values.is_active,
          shipping_available: values.shipping_available,
        },
        images
      );
    } finally {
      setSaving(false);
    }
  });

  const checkboxes: { name: keyof FormValues; label: string }[] = [
    { name: 'is_promo', label: 'Em promoção' },
    { name: 'is_featured', label: 'Destaque' },
    { name: 'is_new', label: 'Novo' },
    { name: 'is_active', label: 'Ativo (visível na loja)' },
    { name: 'shipping_available', label: 'Frete disponível' },
  ];

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-silver-600 dark:text-silver-300">
          Fotos do produto
        </label>
        <ProductImageUploader
          productSlug={initial?.slug ?? slugify('novo-produto')}
          images={images}
          onChange={setImages}
        />
      </div>

      <Input label="Nome do produto" {...register('name')} error={errors.name?.message} />
      <Textarea label="Descrição" {...register('description')} error={errors.description?.message} />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Preço (R$)" type="number" step="0.01" {...register('price')} error={errors.price?.message} />
        <Input label="Preço promocional (R$)" type="number" step="0.01" {...register('promo_price')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-silver-600 dark:text-silver-300">Categoria</label>
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="
                      rounded-xl
                      border
                      border-silver-300
                      dark:border-silver-700
                      bg-white
                      text-black
                      dark:bg-zinc-900
                      dark:text-white
                      px-4
                      py-2.5
                      text-sm
                      outline-none
                    ">
                <option value="">Selecione…</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.category_id && <span className="text-xs text-red-500">{errors.category_id.message}</span>}
        </div>
        <Input label="Estoque" type="number" {...register('stock')} error={errors.stock?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Tamanhos (separados por vírgula)" placeholder="P, M, G, GG" {...register('sizes')} error={errors.sizes?.message} />
        <Input label="Cores (separadas por vírgula)" placeholder="Preto, Branco, Prata" {...register('colors')} error={errors.colors?.message} />
      </div>

      <div className="flex flex-wrap gap-4">
        {checkboxes.map((cb) => (
          <label key={cb.name} className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register(cb.name)} className="h-4 w-4 accent-silver-600" />
            {cb.label}
          </label>
        ))}
      </div>

      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
        {saving ? 'Salvando…' : submitLabel}
      </Button>
    </form>
  );
}
