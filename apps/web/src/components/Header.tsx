import React from "react";


export function Header({ user, onLogout }: { user: { name: string } | null; onLogout: () => void }) {
  return (
    <header>
      <strong>Web Mal Designé</strong>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 8 }}>Bonjour {user.name}</span>
            <button onClick={onLogout}>Se déconnecter</button>
          </>
        ) : (
          <span className="small">non connecté</span>
        )}
      </div>
    </header>
  );
}