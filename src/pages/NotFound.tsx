import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl italic">404</h1>
      <p className="mt-3 text-silver-500">Página não encontrada.</p>
      <Link to="/" className="mt-6">
        <Button>Voltar ao início</Button>
      </Link>
    </div>
  );
}
