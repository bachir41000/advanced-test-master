import React from "react";
import { useAuth } from "../auth/AuthContext";

export function Header() {
  const { user, logout } = useAuth();
  return (
    <header>
      <strong>Web Mal Designé</strong>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 8 }}>Bonjour {user.name}</span>
            <button onClick={logout}>Se déconnecter</button>
          </>
        ) : (
          <span className="small">non connecté</span>
        )}
      </div>
    </header>
  );
}