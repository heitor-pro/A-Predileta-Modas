import { useRef, useState } from 'react';
import { ImagePlus, Star, Trash2 } from 'lucide-react';
import { ImageCropperModal } from './ImageCropperModal';
import { uploadProductImage, deleteProductImage } from '@/services/storage.service';
import type { ProductImage } from '@/types/product';

interface ProductImageUploaderProps {
  productSlug: string;
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

// Permite adicionar múltiplas fotos, cada uma passando pelo editor de recorte antes do upload,
// escolher a foto principal e remover imagens. Todas ficam com o mesmo formato visual (3:4).
export function ProductImageUploader({ productSlug, images, onChange }: ProductImageUploaderProps) {
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropConfirm = async (blob: Blob) => {
    setPendingSrc(null);
    setUploading(true);
    try {
      const { url, path } = await uploadProductImage(blob, productSlug);
      const newImage: ProductImage = {
        id: crypto.randomUUID(),
        product_id: '',
        url,
        storage_path: path,
        is_primary: images.length === 0,
        sort_order: images.length,
      };
      onChange([...images, newImage]);
    } finally {
      setUploading(false);
    }
  };

  const setPrimary = (id: string) => {
    onChange(images.map((img) => ({ ...img, is_primary: img.id === id })));
  };

  const removeImage = async (img: ProductImage) => {
    try {
      await deleteProductImage(img.storage_path);
    } catch {
      // se a imagem já não existir no storage, apenas remove da lista
    }
    const remaining = images.filter((i) => i.id !== img.id);
    if (img.is_primary && remaining.length > 0) remaining[0].is_primary = true;
    onChange(remaining);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-silver-200 dark:border-silver-800">
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setPrimary(img.id)}
                className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs text-ink"
                title="Definir como principal"
              >
                <Star size={12} className={img.is_primary ? 'fill-ink' : ''} />
                {img.is_primary ? 'Principal' : 'Tornar principal'}
              </button>
              <button
                type="button"
                onClick={() => removeImage(img)}
                className="flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-1 text-xs text-white"
              >
                <Trash2 size={12} /> Remover
              </button>
            </div>
            {img.is_primary && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] text-white">
                Principal
              </span>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-silver-300 dark:border-silver-700 text-silver-500 transition-colors hover:border-silver-500"
        >
          <ImagePlus size={22} />
          <span className="text-xs">{uploading ? 'Enviando...' : 'Adicionar foto'}</span>
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

      {pendingSrc && (
        <ImageCropperModal
          imageSrc={pendingSrc}
          onCancel={() => setPendingSrc(null)}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
}
