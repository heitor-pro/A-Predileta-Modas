import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({ email: z.string().email('Informe um e-mail válido') });
type FormValues = z.infer<typeof schema>;

export function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const submit = handleSubmit(async (values) => {
    await sendPasswordReset(values.email);
    setSent(true); // sempre mostra sucesso, por segurança (não revela se o e-mail existe)
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
      <div className="w-full max-w-sm rounded-2xl border border-silver-800 bg-ink-card p-6">
        <h1 className="mb-1 font-display text-2xl italic">Recuperar senha</h1>
        <p className="mb-6 text-sm text-silver-400">
          Enviaremos um link para redefinir sua senha por e-mail.
        </p>

        {sent ? (
          <p className="text-sm text-silver-300">
            Se o e-mail informado estiver cadastrado, você receberá as instruções em instantes.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Input label="E-mail" type="email" {...register('email')} error={errors.email?.message} />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Enviando…' : 'Enviar link de recuperação'}
            </Button>
          </form>
        )}

        <Link to="/admin/login" className="mt-4 block text-center text-xs text-silver-400 hover:text-paper">
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}
