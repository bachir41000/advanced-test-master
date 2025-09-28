import * as React from "react";

type User = { name: string };
type AuthCtx = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = React.createContext<AuthCtx | undefined>(undefined);
const API = import.meta.env.VITE_API_URL ?? "http://localhost:5179";
const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = safeGetToken();
    if (!t) {
      setLoading(false);
      return;
    }
    setToken(t);
    (async () => {
      try {
        const res = await fetch(`${API}/me`, {
          headers: { Authorization: `Bearer ${t}` },
          credentials: "include",
        });
        if (res.ok) {
          const me = (await res.json()) as User;
          setUser(me);
        } else {
          safeSetToken(null);
          setToken(null);
          setUser(null);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data?.token) throw new Error(data?.error || "Login failed");
    safeSetToken(data.token);
    setToken(data.token);
    setUser(data.user ?? null);
  }, []);

  const logout = React.useCallback(() => {
    safeSetToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const value = React.useMemo<AuthCtx>(
    () => ({ token, user, loading, login, logout }),
    [token, user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

function safeGetToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
function safeSetToken(t: string | null) {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}
