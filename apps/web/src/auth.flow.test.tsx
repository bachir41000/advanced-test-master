import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { server } from "./test/msw/server";
import { http, HttpResponse } from "msw";

const API = import.meta.env.VITE_API_URL;

it("logs in and shows products without manual refresh", async () => {
    server.use(
    http.post(`${API}/login`, async ({ request }) => {
        await request.json();
        return HttpResponse.json({ token: "t123", user: { name: "Alice" } });
    }),
    http.get(`${API}/me`, ({ request }) => {
        const auth = request.headers.get("authorization");
        if (auth === "Bearer t123") {
        return HttpResponse.json({ name: "Alice" });
        }
        return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }),
    http.get(`${API}/products`, ({ request }) => {
        const auth = request.headers.get("authorization");
        if (auth === "Bearer t123") {
        return HttpResponse.json([{ id: 1, name: "Apple", price: 1 }]);
        }
        return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    })
    );

    render(<App />);

    const email = await screen.findByRole("textbox", { name: /email/i });
    const password = screen.getByLabelText(/password|mot de passe/i);
    const submit = screen.getByRole("button", { name: /se connecter/i });

    await userEvent.type(email, "alice@example.com");
    await userEvent.type(password, "password");
    await userEvent.click(submit);

    await screen.findByRole("heading", { name: /produits/i });
    await screen.findByText(/id:\s*1/i);
});
