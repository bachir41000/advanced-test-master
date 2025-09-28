import React, { useEffect, useState } from "react";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../auth/AuthContext";
import { useApi } from "./useApi";
import { server } from "../test/msw/server";
import { http, HttpResponse } from "msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5179";

function Probe() {
  const api = useApi();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    api.get<{ ok: boolean }>("/check").then((r) => setOk(r.ok)).catch(() => {});
  }, [api]);
  return <div>{ok ? "ok" : "wait"}</div>;
}

it("adds authorization header from current token", async () => {
  localStorage.setItem("token", "t123");
  server.use(
    http.get(`${API}/check`, ({ request }) => {
      const auth = request.headers.get("authorization");
      if (auth === "Bearer t123") return HttpResponse.json({ ok: true });
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    })
  );
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );
  expect(await screen.findByText(/ok/i)).toBeInTheDocument();
});
