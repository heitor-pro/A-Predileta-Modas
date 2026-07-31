import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { getProductBySlug } from '@/services/products.service';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { formatCurrencyBRL, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/types/product';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!slug) return;
    getProductBySlug(slug).then((p) => {
      setProduct(p);
      if (p) {
        setSize(p.sizes[0] ?? '');
        setColor(p.colors[0] ?? '');
      }
    });
  }, [slug]);

  if (product === undefined) {
    return <div className="mx-auto max-w-7xl px-4 py-24 text-center text-silver-400">Carregando…</div>;
  }

  if (product === null) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Produto não encontrado</h1>
        <Link to="/produtos" className="mt-4 inline-block text-silver-500 underline">Voltar ao catálogo</Link>
      </div>
    );
  }

  const hasPromo = product.is_promo && product.promo_price != null;
  const favorite = isFavorite(product.id);
  const images = product.images.length > 0 ? product.images : [{ id: '0', url: '', product_id: '', is_primary: true, sort_order: 0, storage_path: '' }];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: images[0].url,
      price: product.price,
      promoPrice: hasPromo ? product.promo_price : null,
      size,
      color,
      quantity: 1,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-silver-100 dark:bg-ink-card">
            {images[activeImage]?.url ? (
              <img src={images[activeImage].url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-silver-400">Sem imagem</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2',
                    i === activeImage ? 'border-ink dark:border-paper' : 'border-transparent'
                  )}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex gap-2">
            {product.is_new && <Badge tone="new">Novo</Badge>}
            {hasPromo && <Badge tone="promo">Promoção</Badge>}
            {product.is_featured && <Badge tone="featured">Destaque</Badge>}
          </div>
          <h1 className="font-display text-4xl italic">{product.name}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            {hasPromo ? (
              <>
                <span className="text-lg text-silver-400 line-through">{formatCurrencyBRL(product.price)}</span>
                <span className="text-3xl font-semibold">{formatCurrencyBRL(product.promo_price!)}</span>
              </>
            ) : (
              <span className="text-3xl font-semibold">{formatCurrencyBRL(product.price)}</span>
            )}
          </div>

          <p className="mt-6 text-silver-600 dark:text-silver-300">{product.description}</p>

          {product.category && (
            <p className="mt-4 text-sm text-silver-500">Categoria: {product.category.name}</p>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Tamanho</p>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      'rounded-full border px-4 py-1.5 text-sm',
                      size === s ? 'border-ink bg-ink text-paper dark:border-paper dark:bg-paper dark:text-ink' : 'border-silver-300 dark:border-silver-700'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium">Cor</p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      'rounded-full border px-4 py-1.5 text-sm',
                      color === c ? 'border-ink bg-ink text-paper dark:border-paper dark:bg-paper dark:text-ink' : 'border-silver-300 dark:border-silver-700'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Button size="lg" onClick={handleAddToCart} className="flex-1" disabled={product.stock <= 0}>
              <ShoppingBag size={18} /> {product.stock > 0 ? 'Adicionar ao carrinho' : 'Fora de estoque'}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => toggleFavorite(product.id)} aria-label="Favoritar">
              <Heart size={18} className={cn(favorite && 'fill-ink dark:fill-paper')} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
