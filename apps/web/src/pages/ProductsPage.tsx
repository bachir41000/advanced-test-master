import React from "react";
import type { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { useApi } from "../hooks/useApi";
import { useQuery } from "../hooks/useQuery";

export function ProductsPage({ user }: { user: { name: string } }) {
  const api = useApi();
  const { data: items, loading, error, refetch } = useQuery<Product[]>(
    "products",
    () => api.get<Product[]>("/products"),
    [api]
  );

  if (loading) return <div>Chargement…</div>;
  if (error)
    return (
      <div role="alert" aria-live="polite" style={{ color: "crimson" }}>
        {error.message}{" "}
        <button onClick={refetch} style={{ marginLeft: 8 }}>
          Réessayer
        </button>
      </div>
    );

  return (
    <>
      <h2>Produits</h2>
      <div className="grid">
        {(items || []).map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </>
  );
}
