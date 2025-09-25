import React, { useState } from "react";
import { api, setToken } from "../apiClient";


export function LoginPage({ onLogged }: { onLogged: (user: { name: string; email: string }) => void }) {
  const [email, setEmail] = useState("alice@example.com");
  const [password, setPassword] = useState("alice");
  const [error, setError] = useState<string | null>(null);


  const doLogin = async () => {
    setError(null);
    try {
      const r = await api.login(email, password);
      onLogged(r.user);
    } catch (e) {
      setToken(null); // side effect non nécessaire ici
      setError("Login failed");
    }
  };


  return (
    <div style={{ maxWidth: 360 }}>
      <h2>Connexion</h2>
      <div style={{ display: "grid", gap: 8 }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />
        <button onClick={doLogin}>Se connecter</button>
        {error && <div className="small" style={{ color: "crimson" }}>{error}</div>}
      </div>
    </div>
  );
}