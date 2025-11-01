import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ShopPage from "@/pages/ShopPage";
import AdminPage from "@/pages/AdminPage";

type Page = 'login' | 'register' | 'shop' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null);

  const handleLogin = (username: string, isAdmin: boolean) => {
    setUser({ username, isAdmin });
    setCurrentPage('shop');
  };

  const handleRegister = (username: string, isAdmin: boolean) => {
    setUser({ username, isAdmin });
    setCurrentPage('shop');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {currentPage === 'login' && (
          <LoginPage 
            onLogin={handleLogin}
            onNavigateRegister={() => setCurrentPage('register')}
          />
        )}
        {currentPage === 'register' && (
          <RegisterPage 
            onRegister={handleRegister}
            onNavigateLogin={() => setCurrentPage('login')}
          />
        )}
        {currentPage === 'shop' && user && (
          <ShopPage 
            user={user}
            onLogout={handleLogout}
            onNavigateAdmin={() => setCurrentPage('admin')}
          />
        )}
        {currentPage === 'admin' && user && (
          <AdminPage 
            user={user}
            onLogout={handleLogout}
            onNavigateShop={() => setCurrentPage('shop')}
          />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;