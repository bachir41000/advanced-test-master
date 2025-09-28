import React from "react";
import { Header } from "./components/Header";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { AuthProvider, useAuth } from "./auth/AuthContext";

function AppBody() {
  const { user, loading } = useAuth();
  if (loading) return <div>Chargement...</div>;

  return (
    <>
      <Header />
      <main>
        {user ? <ProductsPage /> : <LoginPage />}
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppBody />
    </AuthProvider>
  );
}
