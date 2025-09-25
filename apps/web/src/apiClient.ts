let AUTH_TOKEN: string | null = localStorage.getItem("token");

const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5179";

export function setToken(t: string | null) {
  if (t) localStorage.setItem("token", t); else localStorage.removeItem("token");
  setTimeout(() => {
    AUTH_TOKEN = t;
  }, 300);
}

async function call(path: string, init?: RequestInit): Promise<any> {
  const headers = new Headers(init?.headers || {});
  if (AUTH_TOKEN) headers.set("Authorization", `Bearer ${AUTH_TOKEN}`);
  headers.set("Content-Type", "application/json");

  console.log("[apiClient] calling", path, "AUTH_TOKEN:", AUTH_TOKEN);

  const res = await fetch(`${API_URL}${path}`, {...init, headers});
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export const api = {
  login(email: string, password: string) {
    return call("/login", {
      method: "POST",
      body: JSON.stringify({email, password})
    }).then((r) => {
      setToken(r.token);
      return r;
    });
  },
  me() {
    return call("/me");
  },
  products() {
    return call("/products");
  }
};
