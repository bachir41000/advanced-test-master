import React from "react";
import type { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { useApi } from "../hooks/useApi";
import { useQuery } from "../hooks/useQuery";
import { useAuth } from "../auth/AuthContext";

export function ProductsPage() {
  const { user } = useAuth();
  if (!user) return null;
  const api = useApi();
  const { data: items, loading, error, refetch } = useQuery<Product[]>(
    "products",
    () => api.get<Product[]>("/products"),
    [api]
  );

  if (loading) return <div role="status" aria-live="polite">Chargement…</div>;
  if (error)
    return (
      <div role="alert" aria-live="polite" style={{ color: "crimson" }}>
        {error.message}{" "}
        <button onClick={refetch} aria-label="Réessayer le chargement des produits" style={{ marginLeft: 8 }}>
          Réessayer
        </button>
      </div>
    );

  const list = items || [];
  if (list.length === 0) {
    return <div>Aucun produit disponible.</div>;
  }

  return (
    <>
      <h2>Produits</h2>
      <div className="grid">
        {list.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </>
  );
}
