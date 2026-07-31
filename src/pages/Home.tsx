import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductGrid } from '@/components/product/ProductGrid';

export function Home() {
  const { products: featured, loading: loadingFeatured } = useProducts({ onlyFeatured: true, sort: 'newest' });
  const { products: promos, loading: loadingPromos } = useProducts({ onlyPromo: true, sort: 'newest' });
  const { products: news, loading: loadingNews } = useProducts({ onlyNew: true, sort: 'newest' });
  const { categories } = useCategories();

  return (
    <div>
      {/* Banner / Hero */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-start justify-center gap-6 px-4 py-24 sm:px-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.4em] text-silver-400"
          >
            Nova coleção
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-xl font-display text-5xl italic leading-[1.05] sm:text-6xl"
          >
            Seu estilo, <span className="text-shimmer animate-shimmer bg-silver-shimmer">sua predileta</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-md text-silver-300"
          >
            Peças selecionadas com elegância e simplicidade, pensadas para quem tem estilo próprio.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3 text-sm font-medium text-ink transition-transform hover:scale-105"
            >
              Ver catálogo completo <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6">
        {/* Categorias */}
        {categories.length > 0 && (
          <section>
            <h2 className="mb-6 font-display text-3xl italic">Categorias</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/produtos?categoria=${cat.slug}`}
                  className="flex-shrink-0 rounded-full border border-silver-300 dark:border-silver-700 px-5 py-2 text-sm text-silver-600 dark:text-silver-300 transition-colors hover:border-ink dark:hover:border-paper hover:text-ink dark:hover:text-paper"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Destaques */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-3xl italic">Destaques</h2>
            <Link to="/produtos" className="text-sm text-silver-500 hover:text-ink dark:hover:text-paper">Ver tudo</Link>
          </div>
          <ProductGrid products={featured.slice(0, 8)} loading={loadingFeatured} />
        </section>

        {/* Promoções */}
        {(loadingPromos || promos.length > 0) && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-3xl italic">Promoções</h2>
              <Link to="/produtos?promo=1" className="text-sm text-silver-500 hover:text-ink dark:hover:text-paper">Ver tudo</Link>
            </div>
            <ProductGrid products={promos.slice(0, 8)} loading={loadingPromos} />
          </section>
        )}

        {/* Novidades */}
        {(loadingNews || news.length > 0) && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-3xl italic">Novidades</h2>
              <Link to="/produtos?novo=1" className="text-sm text-silver-500 hover:text-ink dark:hover:text-paper">Ver tudo</Link>
            </div>
            <ProductGrid products={news.slice(0, 8)} loading={loadingNews} />
          </section>
        )}
      </div>
    </div>
  );
}
