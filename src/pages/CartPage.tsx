import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartLineItem } from '@/components/cart/CartLineItem';
import { CheckoutForm } from '@/components/cart/CheckoutForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export function CartPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <EmptyState
          icon={<ShoppingBag size={40} />}
          title="Seu carrinho está vazio"
          description="Adicione produtos ao carrinho para montar seu pedido."
          action={<Link to="/produtos"><Button>Ver produtos</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-display text-4xl italic">Seu carrinho</h1>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          {items.map((item) => (
            <CartLineItem key={`${item.productId}-${item.size}-${item.color}`} item={item} />
          ))}
        </div>
        <div>
          <h2 className="mb-4 font-display text-2xl">Finalizar pedido</h2>
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}
