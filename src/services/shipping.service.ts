// Cálculo de frete simplificado, sem integração com Correios.
// A lojista pode ajustar as faixas de CEP e valores em src/utils/shipping-rules.ts.
import { SHIPPING_RULES, DEFAULT_SHIPPING } from '@/utils/shipping-rules';
import { onlyDigits } from '@/lib/utils';

export function calculateShipping(cep: string): number {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) return DEFAULT_SHIPPING;

  const prefix = Number(digits.slice(0, 5));
  const rule = SHIPPING_RULES.find((r) => prefix >= r.from && prefix <= r.to);
  return rule ? rule.price : DEFAULT_SHIPPING;
}
