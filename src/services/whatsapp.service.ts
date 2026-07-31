import { formatCurrencyBRL } from '@/lib/utils';
import type { CartItem, CheckoutInfo } from '@/types/cart';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string;

interface BuildMessageArgs {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  checkout: CheckoutInfo;
}

export function buildWhatsAppMessage({ items, subtotal, shipping, checkout }: BuildMessageArgs): string {
  const total = subtotal + shipping;

  const productLines = items
    .map((item) => {
      const unitPrice = item.promoPrice ?? item.price;
      const lineTotal = unitPrice * item.quantity;
      return [
        `Produto: ${item.name}`,
        `Tamanho: ${item.size} | Cor: ${item.color}`,
        `Quantidade: ${item.quantity}`,
        `Valor unitário: ${formatCurrencyBRL(unitPrice)}`,
        `Subtotal do item: ${formatCurrencyBRL(lineTotal)}`,
      ].join('\n');
    })
    .join('\n\n');

  const deliveryLabel = checkout.deliveryMethod === 'entrega' ? 'Entrega' : 'Retirada na loja';

  const lines = [
    'Olá! Gostaria de fazer este pedido na A Predileta Modas:',
    '',
    productLines,
    '',
    `Subtotal: ${formatCurrencyBRL(subtotal)}`,
    `Frete: ${formatCurrencyBRL(shipping)}`,
    `Total: ${formatCurrencyBRL(total)}`,
    '',
    `Nome: ${checkout.name}`,
    `Telefone: ${checkout.phone}`,
    `Cidade: ${checkout.city}`,
    `CEP: ${checkout.cep}`,
  ];

  if (checkout.address) lines.push(`Endereço: ${checkout.address}`);
  lines.push(`Forma de entrega: ${deliveryLabel}`);
  if (checkout.notes) lines.push(`Observações: ${checkout.notes}`);
  lines.push('', 'Obrigado(a)!');

  return lines.join('\n');
}

export function openWhatsAppCheckout(args: BuildMessageArgs): void {
  const message = buildWhatsAppMessage(args);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
