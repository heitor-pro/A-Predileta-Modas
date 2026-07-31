import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { useFavorites } from '@/contexts/FavoritesContext';
import { formatCurrencyBRL, cn } from '@/lib/utils';
import type { Product } from '@/types/product';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);
  const primaryImage = product.images.find((i) => i.is_primary) ?? product.images[0];
  const hasPromo = product.is_promo && product.promo_price != null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className="group relative"
    >
      <Link to={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-silver-100 dark:bg-ink-card">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-silver-400">Sem imagem</div>
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.is_new && <Badge tone="new">Novo</Badge>}
            {hasPromo && <Badge tone="promo">Promoção</Badge>}
            {product.is_featured && <Badge tone="featured">Destaque</Badge>}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(product.id);
            }}
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-black/50 backdrop-blur transition-transform hover:scale-110"
          >
            <Heart size={16} className={cn(favorite && 'fill-ink dark:fill-paper')} />
          </button>
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="line-clamp-1 font-display text-lg">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            {hasPromo ? (
              <>
                <span className="text-sm text-silver-400 line-through">
                  {formatCurrencyBRL(product.price)}
                </span>
                <span className="font-semibold">{formatCurrencyBRL(product.promo_price!)}</span>
              </>
            ) : (
              <span className="font-semibold">{formatCurrencyBRL(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
