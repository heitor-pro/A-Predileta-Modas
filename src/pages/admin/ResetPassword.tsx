import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z
  .object({
    password: z.string().min(6, 'Mínimo de 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

// Acessada a partir do link enviado por e-mail (fluxo de recuperação),
// ou pelo próprio painel quando o admin quer trocar a senha voluntariamente.
export function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const submit = handleSubmit(async (values) => {
    setError(null);
    const { error: err } = await updatePassword(values.password);
    if (err) {
      setError(err);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate('/admin'), 1500);
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
      <div className="w-full max-w-sm rounded-2xl border border-silver-800 bg-ink-card p-6">
        <h1 className="mb-6 font-display text-2xl italic">Definir nova senha</h1>

        {success ? (
          <p className="text-sm text-silver-300">Senha alterada com sucesso! Redirecionando…</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Input label="Nova senha" type="password" {...register('password')} error={errors.password?.message} />
            <Input
              label="Confirmar nova senha"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Salvando…' : 'Salvar nova senha'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
