import React, { useEffect, useState } from "react";
import type { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { useApi } from "../hooks/useApi";

export function ProductsPage({ user }: { user: { name: string } }) {
  const api = useApi();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await api.get<Product[]>("/products");
        if (!cancelled) setItems(r);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Erreur");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api]);

  if (loading) return <div>Chargement…</div>;
  if (error)
    return (
      <div role="alert" aria-live="polite" style={{ color: "crimson" }}>
        {error}
      </div>
    );

  return (
    <>
      <h2>Produits</h2>
      <div className="grid">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </>
  );
}
