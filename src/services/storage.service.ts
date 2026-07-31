import { supabase } from '@/lib/supabase';

const BUCKET = 'product-images';

// Faz upload de um Blob (já cortado pelo editor de crop) para o Storage do Supabase
// e retorna a URL pública + o caminho interno (usado depois para excluir o arquivo).
export async function uploadProductImage(
  blob: Blob,
  productSlug: string
): Promise<{ url: string; path: string }> {
  const fileName = `${productSlug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, blob, {
    contentType: 'image/jpeg',
    cacheControl: '31536000', // 1 ano — imagens são reenviadas com nome novo quando alteradas
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return { url: data.publicUrl, path: fileName };
}

export async function deleteProductImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
