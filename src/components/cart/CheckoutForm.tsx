import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { formatCEP, formatPhoneBR } from '@/lib/utils';
import { calculateShipping } from '@/services/shipping.service';
import { openWhatsAppCheckout } from '@/services/whatsapp.service';
import { useCart } from '@/contexts/CartContext';
import { formatCurrencyBRL } from '@/lib/utils';

const schema = z
  .object({
    name: z.string().min(2, 'Informe seu nome'),
    phone: z.string().min(14, 'Informe um telefone válido'),

    city: z.string().optional(),
    cep: z.string().optional(),
    address: z.string().optional(),

    deliveryMethod: z.enum(['entrega', 'retirada']),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === 'entrega') {
      if (!data.city || data.city.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['city'],
          message: 'Informe sua cidade',
        });
      }

      if (!data.cep || data.cep.length < 9) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cep'],
          message: 'Informe um CEP válido',
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [shipping, setShipping] = useState(0);

  async function buscarCep(cep: string) {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) return;

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${cepLimpo}/json/`
    );

    const data = await response.json();

    if (data.erro) return;

    setValue("city", data.localidade);
    setValue("address", `${data.logradouro}, ${data.bairro}`);
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
  }
}

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { deliveryMethod: 'entrega' },
  });

  const deliveryMethod = watch('deliveryMethod');

 const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const formatted = formatCEP(e.target.value);

  setValue("cep", formatted);

  if (deliveryMethod === "entrega") {
    setShipping(calculateShipping(formatted));

    if (formatted.length === 9) {
      buscarCep(formatted);
    }
  }
};

  const submit = handleSubmit((values) => {
    const finalShipping = values.deliveryMethod === 'retirada' ? 0 : shipping;
    openWhatsAppCheckout({
      items,
      subtotal,
      shipping: finalShipping,
      checkout: values,
    });
    clearCart();
  });

  const total = subtotal + (deliveryMethod === 'retirada' ? 0 : shipping);

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Nome completo" {...register('name')} error={errors.name?.message} />
      <Input
        label="Telefone / WhatsApp"
        {...register('phone')}
        onChange={(e) => setValue('phone', formatPhoneBR(e.target.value))}
        error={errors.phone?.message}
      />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" value="entrega" {...register('deliveryMethod')} className="accent-silver-600" />
          Entrega
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" value="retirada" {...register('deliveryMethod')} className="accent-silver-600" />
          Retirada na loja
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Cidade" {...register('city')} error={errors.city?.message} />
        <Input
          label="CEP"
          {...register('cep')}
          onChange={handleCepChange}
          disabled={deliveryMethod === 'retirada'}
          error={errors.cep?.message}
        />
      </div>

      {deliveryMethod === 'entrega' && (
        <Input label="Endereço (opcional)" {...register('address')} />
      )}

      <Textarea label="Observações (opcional)" {...register('notes')} />

      <div className="space-y-1 rounded-xl border border-silver-200 dark:border-silver-800 p-4 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrencyBRL(subtotal)}</span></div>
        <div className="flex justify-between">
          <span>Frete</span>
          <span>{deliveryMethod === 'retirada' ? 'Grátis (retirada)' : formatCurrencyBRL(shipping)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-1 border-t border-silver-200 dark:border-silver-800 mt-1">
          <span>Total</span><span>{formatCurrencyBRL(total)}</span>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={items.length === 0}>
        Finalizar pedido pelo WhatsApp
      </Button>
    </form>
  );
}
