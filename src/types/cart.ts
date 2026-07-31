import type { Product } from './product';

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  promoPrice: number | null;
  size: string;
  color: string;
  quantity: number;
}

export interface CheckoutInfo {
  name: string;
  phone: string;

  city?: string;
  cep?: string;
  address?: string;

  deliveryMethod: 'entrega' | 'retirada';
  notes?: string;
}


export type { Product };
