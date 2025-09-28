import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { server } from "./test/msw/server";
import { http, HttpResponse } from "msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5179";

it("shows an error on bad credentials", async () => {
    server.use(
    http.post(`${API}/login`, async () => {
        return HttpResponse.json({ error: "bad credentials" }, { status: 401 });
    })
    );

    render(<App />);

    await userEvent.type(screen.getByLabelText(/email/i), "alice@example.com");
    await userEvent.type(screen.getByLabelText(/mot de passe|password/i), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    await screen.findByText(/login failed/i, {}, { timeout: 2000 });
});

it("shows products after a server error when clicking Retry", async () => {
    localStorage.setItem("token", "t123");
    let attempt = 0;
    server.use(
    http.get(`${API}/me`, () => HttpResponse.json({ name: "Alice" })),
    http.get(`${API}/products`, () => {
        attempt += 1;
        if (attempt === 1) {
        return HttpResponse.json({ error: "boom" }, { status: 500 });
        }
        return HttpResponse.json([{ id: 1, name: "Apple", price: 0.01 }]);
    })
    );

    render(<App />);

    await screen.findByText(/boom/i);
    await userEvent.click(screen.getByRole("button", { name: /réessayer/i }));
    await screen.findByRole("heading", { name: /produits/i });
    await screen.findByText(/id:\s*1/i);
});
