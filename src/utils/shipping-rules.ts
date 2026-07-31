// Regras de frete por faixa de CEP (editável pela lojista/desenvolvedor).
// "from" e "to" usam os 5 primeiros dígitos do CEP.
// Para alterar valores de frete, edite os números abaixo — não é necessário mexer em outro arquivo.

export interface ShippingRule {
  label: string;
  from: number;
  to: number;
  price: number;
}

export const SHIPPING_RULES: ShippingRule[] = [
  { label: 'Capital / Região Metropolitana', from: 49000, to: 49099, price: 12 },
  { label: 'Interior do estado', from: 49100, to: 49999, price: 22 },
  { label: 'Outros estados', from: 0, to: 99999, price: 35 },
];

export const DEFAULT_SHIPPING = 35;
