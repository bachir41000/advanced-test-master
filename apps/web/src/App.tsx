import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { api, setToken } from "./apiClient";

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.me();
        setUser(me);
      } catch {}
      setReady(true);
    })();
  }, []);


  const onLogout = () => {
    setToken(null);
    setUser(null);
  };

  if (!ready) return <div>Boot…</div>;

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <main>
        {user ? (
          <ProductsPage user={user} />
        ) : (
          <LoginPage onLogged={(u) => setUser(u)} />
        )}
      </main>
    </>
  );
}