import * as React from "react";
import { useAuth } from "../auth/AuthContext";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5179";

type Api = {
  get<T>(path: string, init?: RequestInit): Promise<T>;
  post<T>(path: string, body: unknown, init?: RequestInit): Promise<T>;
};

export function useApi(): Api {
  const { token } = useAuth();

  return React.useMemo<Api>(() => {
    async function call<T>(path: string, init?: RequestInit): Promise<T> {
      const headers = new Headers(init?.headers);
      if (token) headers.set("Authorization", `Bearer ${token}`);
      const hasBody = init && "body" in init && (init as any).body != null;
      if (hasBody && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      const res = await fetch(API + path, { credentials: "include", ...init, headers });
      const text = await res.text();
      const isJson = res.headers.get("content-type")?.includes("application/json");
      const data = isJson && text ? JSON.parse(text) : text;

      if (!res.ok) {
        const msg = (data && (data.error || data.message)) || res.statusText || "API error";
        throw new ApiError(res.status, String(msg));
      }
      return data as T;
    }

    return {
      get<T>(path: string, init?: RequestInit) {
        return call<T>(path, { ...init, method: "GET" });
      },
      post<T>(path: string, body: unknown, init?: RequestInit) {
        return call<T>(path, { ...init, method: "POST", body: JSON.stringify(body) });
      },
    };
  }, [token]);
}
