import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";


export function LoginPage() {
  const [email, setEmail] = useState("alice@example.com");
  const [password, setPassword] = useState("alice");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ maxWidth: 360 }} aria-busy={loading}>
      <h2>Connexion</h2>
      <div style={{ display: "grid", gap: 8 }}>
        <label htmlFor="email">Email</label>
        <input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
        <label htmlFor="password">Mot de passe</label>
        <input id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />
        <button onClick={doLogin} disabled={loading} aria-disabled={loading}>Se connecter</button>
        {error && <div role="alert" aria-live="assertive" className="small" style={{ color: "crimson" }}>{error}</div>}
      </div>
    </div>
  );
}