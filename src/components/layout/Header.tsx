import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { cn } from '@/lib/utils';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { totalItems } = useCart();
  const { favoriteIds } = useFavorites();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/produtos?busca=${encodeURIComponent(search)}`);
    setMenuOpen(false);
  };

  const links = [
    { to: '/', label: 'Início' },
    { to: '/produtos', label: 'Produtos' },
    { to: '/produtos?promo=1', label: 'Promoções' },
    { to: '/favoritos', label: 'Favoritos' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-silver-200/60 dark:border-silver-800/60 bg-paper/85 dark:bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="font-display text-xl italic tracking-wide sm:text-2xl">
          A Predileta <span className="not-italic text-xs tracking-[0.3em] text-silver-500">MODAS</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-silver-600 dark:text-silver-300 transition-colors hover:text-ink dark:hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="hidden items-center lg:flex">
            <div className="flex items-center gap-2 rounded-full border border-silver-300 dark:border-silver-700 px-3 py-1.5">
              <Search size={15} className="text-silver-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar produtos"
                className="w-40 bg-transparent text-sm outline-none placeholder:text-silver-400"
              />
            </div>
          </form>

          <ThemeToggle />

          <Link to="/favoritos" className="relative hidden sm:block" aria-label="Favoritos">
            <Heart size={20} />
            {favoriteIds.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink dark:bg-paper text-[10px] text-paper dark:text-ink">
                {favoriteIds.length}
              </span>
            )}
          </Link>

          <Link to="/carrinho" className="relative" aria-label="Carrinho">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink dark:bg-paper text-[10px] text-paper dark:text-ink">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-silver-200/60 dark:border-silver-800/60 transition-all duration-300 md:hidden',
          menuOpen ? 'max-h-96 py-4' : 'max-h-0'
        )}
      >
        <div className="flex flex-col gap-4 px-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-full border border-silver-300 dark:border-silver-700 px-3 py-2">
            <Search size={15} className="text-silver-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos"
              className="w-full bg-transparent text-sm outline-none placeholder:text-silver-400"
            />
          </form>
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-silver-600 dark:text-silver-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
