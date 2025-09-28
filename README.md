# Advanced Test Master Bachir

## Lancement

À la racine du dépôt :
```bash
npm install
```

Dans un premier terminal :
```bash
npm run -w apps/api dev
# API: http://localhost:5179
```

Dans un second terminal :
```bash
npm run -w apps/web dev
# Web: http://localhost:5173
```

Variable d’environnement côté web :
- `VITE_API_URL` (optionnelle), par défaut `http://localhost:5179`.

---

## Scripts

Web :
```bash
npm run -w apps/web test       # exécute les tests Vitest
npm run -w apps/web coverage   # couverture
```

---

## Correction du bug 401

**Symptôme**  
- Login 401 sur `/me` tant que la page n’est pas rafraîchie.

**Cause**  
- Le token n’était pas toujours disponible au moment des appels API, d’où l’erreur 401.

**Fix**  
- Suppression de `apps/web/src/apiClient.ts`.  
- Le token est désormais centralisé dans `AuthContext` et toujours lu en temps réel via `useApi()`.

---


**AuthContext**  
- Stocke `token` et `user`.  
- Restaure la session au montage via `GET /me`.  
- Expose `login(email, password)` et `logout()`.

**useApi**  
- `get<T>(path)` / `post<T>(path, body)` sur `fetch`.  
- Injecte `Authorization: Bearer <token>` si présent.  
- Mappe les erreurs HTTP vers `ApiError(status, message)`.  
- Mémoïsé par token.

**useQuery**  
- Évite le boilerplate `loading/error/data`.  
- `refetch()` / `invalidate()` via un compteur interne.  
- Annule proprement à l’unmount.

**ProductsPage**  
- Utilise `useQuery<Product[]>("products", () => api.get('/products'))`.  
- États: `role="status"` en chargement, `role="alert"` en erreur, bouton “Réessayer”.

**LoginPage**  
- Labels accessibles, `aria-live` pour l’erreur, gestion du `busy`.

---

## Tests

Stack : Vitest + Testing Library + MSW. Aucun appel réseau réel.

Ils vérifient :  
- **useApi** : ajout de l’en-tête d’authentification et gestion des erreurs.  
- **useQuery** : cycle de vie (chargement, succès, erreur), possibilité de `refetch()` et sécurité après un unmount.  
- **Flux d’authentification** : connexion puis affichage des produits sans avoir besoin de rafraîchir la page (correction du bug 401).  
- **Scénarios d’intégration** :  
  - mauvais mot de passe -> affichage d’un message d’erreur,  
  - erreur serveur sur `/products` -> affichage d’un message puis récupération correcte après clic sur “Réessayer”.

Commande :
```bash
npm run -w apps/web test
```

---

## Choix et limites

- On a gardé une architecture simple : pas de Redux, ni de librairies externes pour les requêtes.
- `AuthContext` suffit pour centraliser la session et éviter les problèmes de 401.
- `useApi` gère l’ajout du header d’authentification de manière basique sans interceptor avancé.
- `useQuery` reste volontairement minimal, pas de cache global ni de refetch automatique.
- Les tests couvrent les cas principaux (login, erreurs, chargement de produits).
- L’accessibilité a été améliorée (labels, messages d’erreur lisibles).

