import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutGrid, LogOut, Package, Settings, Tags } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', label: 'Visão geral', icon: LayoutGrid, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/categorias', label: 'Categorias', icon: Tags },
  { to: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];

export function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <div className="flex">
        <aside className="hidden w-64 flex-shrink-0 border-r border-silver-200 dark:border-silver-800 p-6 md:block">
          <Link to="/" className="font-display text-xl italic">A Predileta</Link>
          <p className="mb-8 text-xs text-silver-500">Painel administrativo</p>

          <nav className="space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
                      : 'text-silver-600 dark:text-silver-300 hover:bg-silver-100 dark:hover:bg-silver-900'
                  )
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-silver-500 hover:text-red-500"
          >
            <LogOut size={16} /> Sair
          </button>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-silver-200 dark:border-silver-800 px-4 py-3 sm:px-6">
            <span className="text-sm text-silver-500">{user?.email}</span>
            <ThemeToggle />
          </header>
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
