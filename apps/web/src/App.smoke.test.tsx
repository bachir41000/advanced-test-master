import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

it("renders login screen without hitting real network", async () => {
  render(<App />);
  
  const btn = await screen.findByRole("button", { name: /se connecter/i });
  expect(btn).toBeInTheDocument();
});
