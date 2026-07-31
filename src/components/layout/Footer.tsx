import { Link } from 'react-router-dom';
import { Heart, Instagram, MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-silver-200/60 dark:border-silver-800/60 bg-paper dark:bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-2xl italic">A Predileta Modas</h3>
            <p className="mt-3 flex items-center gap-2 text-sm text-silver-500 dark:text-silver-400">
              Seu estilo, sua predileta <Heart size={13} />
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-silver-500">Navegação</h4>
            <ul className="space-y-2 text-sm text-silver-600 dark:text-silver-300">
              <li><Link to="/produtos">Todos os produtos</Link></li>
              <li><Link to="/produtos?promo=1">Promoções</Link></li>
              <li><Link to="/favoritos">Favoritos</Link></li>
              <li><Link to="/admin/login">Área administrativa</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-silver-500">Fale conosco</h4>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-silver-600 dark:text-silver-300 hover:text-ink dark:hover:text-paper"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 text-sm text-silver-600 dark:text-silver-300 hover:text-ink dark:hover:text-paper"
            >
              <Instagram size={16} /> Instagram
            </a>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-silver-400">
          © {new Date().getFullYear()} A Predileta Modas. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
