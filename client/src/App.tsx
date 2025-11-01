import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./lib/auth";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ShopPage from "@/pages/ShopPage";
import AdminPage from "@/pages/AdminPage";

type Page = 'login' | 'register' | 'shop' | 'admin';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {currentPage === 'login' && (
          <LoginPage 
            onNavigateRegister={() => setCurrentPage('register')}
          />
        )}
        {currentPage === 'register' && (
          <RegisterPage 
            onNavigateLogin={() => setCurrentPage('login')}
          />
        )}
      </>
    );
  }

  return (
    <>
      {currentPage === 'shop' && (
        <ShopPage 
          user={user}
          onLogout={handleLogout}
          onNavigateAdmin={() => setCurrentPage('admin')}
        />
      )}
      {currentPage === 'admin' && (
        <AdminPage 
          user={user}
          onLogout={handleLogout}
          onNavigateShop={() => setCurrentPage('shop')}
        />
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;