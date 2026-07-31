import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Pencil, Search, Trash2 } from 'lucide-react';
import { listAllProductsAdmin, deleteProduct, duplicateProduct } from '@/services/products.service';
import { formatCurrencyBRL, cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/types/product';

export function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    listAllProductsAdmin().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (product: Product) => {
    if (!confirm(`Excluir "${product.name}" permanentemente?`)) return;
    await deleteProduct(product.id);
    load();
  };

  const handleDuplicate = async (product: Product) => {
    await duplicateProduct(product);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl italic">Produtos</h1>
        <Link to="/admin/produtos/novo" className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper dark:bg-paper dark:text-ink">
          + Novo produto
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-full border border-silver-300 dark:border-silver-700 px-4 py-2 sm:w-80">
        <Search size={15} className="text-silver-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar produtos"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-silver-200 dark:border-silver-800">
        <table className="w-full text-sm">
          <thead className="bg-silver-50 dark:bg-silver-900 text-left text-xs uppercase tracking-wide text-silver-500">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-silver-400">Carregando…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-silver-400">Nenhum produto encontrado.</td></tr>
            ) : (
              filtered.map((product) => {
                const primary = product.images.find((i) => i.is_primary) ?? product.images[0];
                return (
                  <tr key={product.id} className="border-t border-silver-100 dark:border-silver-800">
                    <td className="flex items-center gap-3 px-4 py-3">
                      <div className="h-12 w-10 flex-shrink-0 overflow-hidden rounded-md bg-silver-100 dark:bg-silver-800">
                        {primary && <img src={primary.url} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex gap-1">
                          {product.is_promo && <Badge tone="promo">Promo</Badge>}
                          {product.is_featured && <Badge tone="featured">Destaque</Badge>}
                          {product.is_new && <Badge tone="new">Novo</Badge>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{formatCurrencyBRL(product.promo_price ?? product.price)}</td>
                    <td className={cn('px-4 py-3', product.stock <= 0 && 'text-red-500')}>{product.stock}</td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2 py-1 text-xs', product.is_active ? 'bg-green-100 text-green-700' : 'bg-silver-200 text-silver-600')}>
                        {product.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link to={`/admin/produtos/${product.id}`} aria-label="Editar" className="text-silver-500 hover:text-ink dark:hover:text-paper">
                          <Pencil size={16} />
                        </Link>
                        <button onClick={() => handleDuplicate(product)} aria-label="Duplicar" className="text-silver-500 hover:text-ink dark:hover:text-paper">
                          <Copy size={16} />
                        </button>
                        <button onClick={() => handleDelete(product)} aria-label="Excluir" className="text-silver-500 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
