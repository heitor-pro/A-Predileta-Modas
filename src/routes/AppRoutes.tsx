import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Home } from '@/pages/Home';
import { ProductList } from '@/pages/ProductList';
import { ProductDetail } from '@/pages/ProductDetail';
import { CartPage } from '@/pages/CartPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { NotFound } from '@/pages/NotFound';

import { AdminLogin } from '@/pages/admin/Login';
import { ForgotPassword } from '@/pages/admin/ForgotPassword';
import { ResetPassword } from '@/pages/admin/ResetPassword';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { ProductsAdmin } from '@/pages/admin/ProductsAdmin';
import { ProductNew } from '@/pages/admin/ProductNew';
import { ProductEdit } from '@/pages/admin/ProductEdit';
import { CategoriesAdmin } from '@/pages/admin/CategoriesAdmin';
import { SettingsPage } from '@/pages/admin/Settings';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      {/* Loja (pública) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<ProductList />} />
        <Route path="/produto/:slug" element={<ProductDetail />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
      </Route>

      {/* Autenticação administrativa */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/esqueci-senha" element={<ForgotPassword />} />
      <Route
        path="/admin/redefinir-senha"
        element={
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        }
      />

      {/* Painel administrativo (protegido) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="produtos" element={<ProductsAdmin />} />
        <Route path="produtos/novo" element={<ProductNew />} />
        <Route path="produtos/:id" element={<ProductEdit />} />
        <Route path="categorias" element={<CategoriesAdmin />} />
        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
