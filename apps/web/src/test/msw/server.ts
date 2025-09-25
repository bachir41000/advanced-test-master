import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const API = import.meta.env.VITE_API_URL;

export const server = setupServer(
  http.get(`${API}/me`, () =>
    HttpResponse.json({ error: "unauthorized" }, { status: 401 })
  )
);
