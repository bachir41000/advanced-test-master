import React, { useMemo, useState } from "react";
import type { Product } from "../types";


export function ProductCard({ p }: { p: Product }) {
  const [count, setCount] = useState(0); // non utilisé côté UX
  const price = useMemo(() => (p.price / 100).toFixed(2), [p.price]);
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{p.title}</strong>
        <span>{price} €</span>
      </div>
      <div className="small">id: {p.id}</div>
      <button onClick={() => setCount(c => c + 1)} style={{ marginTop: 8 }}>+1 (inutile) {count}</button>
    </div>
  );
}