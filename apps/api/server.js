import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import { users, sessions } from "./users.db.js";


const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const token = nanoid();
  sessions.set(token, user.id);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});


function auth(req, res, next) {
  const auth = req.headers["authorization"] || ""; // "Bearer <token>"
  const token = auth.split(" ")[1];
  if (token && sessions.has(token)) return next();
  return res.status(401).json({ error: "Unauthorized" });
}


app.get("/me", auth, (req, res) => {
  const token = (req.headers["authorization"] || "").split(" ")[1];
  const userId = sessions.get(token);
  const user = users.find(u => u.id === userId);
  res.json({ id: user.id, email: user.email, name: user.name });
});


app.get("/products", auth, (req, res) => {
  res.json([
    { id: "p1", title: "Laptop", price: 1299_00 },
    { id: "p2", title: "Headphones", price: 199_00 },
    { id: "p3", title: "Monitor", price: 299_00 }
  ]);
});


const PORT = process.env.PORT || 5179;
app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));