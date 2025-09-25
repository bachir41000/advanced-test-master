import React, { useEffect, useState } from "react";
import { api } from "../apiClient";
import type { Product } from "../types";
import { ProductCard } from "../components/ProductCard";


export function ProductsPage({ user }: { user: { name: string } }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.products();
        if (!cancelled) setItems(data);
      } catch (e) {
        setError("Impossible de charger les produits (401 ?)");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);


  if (loading) return <div>Chargement…</div>;
  if (error) return <div style={{ color: "crimson" }}>{error}</div>;


  return (
    <>
      <h2>Produits</h2>
      <div className="grid">
        {items.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </>
  );
}