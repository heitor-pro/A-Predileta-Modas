import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatCurrencyBRL } from '@/lib/utils';
import type { CartItem } from '@/types/cart';

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const unitPrice = item.promoPrice ?? item.price;

  return (
    <div className="flex gap-4 border-b border-silver-200 dark:border-silver-800 py-4">
      <img src={item.image} alt={item.name} className="h-24 w-20 rounded-lg object-cover" />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="font-display text-lg leading-tight">{item.name}</h4>
          <p className="text-xs text-silver-500">
            Tamanho: {item.size} · Cor: {item.color}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-silver-300 dark:border-silver-700 px-2 py-1">
            <button
              onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
              aria-label="Diminuir quantidade"
            >
              <Minus size={14} />
            </button>
            <span className="w-5 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
              aria-label="Aumentar quantidade"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="font-semibold">{formatCurrencyBRL(unitPrice * item.quantity)}</span>
        </div>
      </div>
      <button
        onClick={() => removeItem(item.productId, item.size, item.color)}
        aria-label="Remover produto"
        className="self-start text-silver-400 hover:text-red-500"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
