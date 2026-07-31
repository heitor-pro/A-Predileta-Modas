import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
});

type FormValues = z.infer<typeof schema>;

export function AdminLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    const { error } = await signIn(values.email, values.password);
    if (error) {
      setServerError(error);
      return;
    }
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/admin';
    navigate(from, { replace: true });
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl italic">A Predileta Modas</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-silver-400">Painel administrativo</p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-silver-800 bg-ink-card p-6">
          <Input
            label="E-mail"
            type="email"
            autoComplete="username"
            {...register('email')}
            error={errors.email?.message}
            className="text-paper"
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
            className="text-paper"
          />

          {serverError && <p className="text-sm text-red-400">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>

          <div className="text-center">
            <Link to="/admin/esqueci-senha" className="text-xs text-silver-400 hover:text-paper">
              Esqueci minha senha
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
