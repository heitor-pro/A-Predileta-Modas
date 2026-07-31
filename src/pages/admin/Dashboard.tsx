import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, PackageX, Percent, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { listAllProductsAdmin } from '@/services/products.service';
import type { Product } from '@/types/product';

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAllProductsAdmin().then(setProducts).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Produtos cadastrados', value: products.length, icon: Package },
    { label: 'Sem estoque', value: products.filter((p) => p.stock <= 0).length, icon: PackageX },
    { label: 'Em promoção', value: products.filter((p) => p.is_promo).length, icon: Percent },
    { label: 'Destaques', value: products.filter((p) => p.is_featured).length, icon: Star },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl italic">Visão geral</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-5">
            <Icon size={20} className="text-silver-400" />
            <p className="mt-3 text-2xl font-semibold">{loading ? '—' : value}</p>
            <p className="text-xs text-silver-500">{label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Link
          to="/admin/produtos/novo"
          className="inline-block rounded-full bg-ink px-6 py-3 text-sm text-paper dark:bg-paper dark:text-ink"
        >
          + Adicionar novo produto
        </Link>
      </div>
    </div>
  );
}
