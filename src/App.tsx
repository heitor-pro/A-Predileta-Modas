import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { AppRoutes } from '@/routes/AppRoutes';

export default function App() {
  // Splash screen exibida apenas na primeira visita da sessão do navegador
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('predileta-splash-shown'));

  const handleSplashFinish = () => {
    sessionStorage.setItem('predileta-splash-shown', '1');
    setShowSplash(false);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <BrowserRouter>
              {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
              {!showSplash && <AppRoutes />}
            </BrowserRouter>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
