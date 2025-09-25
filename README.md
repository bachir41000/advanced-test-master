# Test de compétence React 

## Lancement

* à la racine

```bash
npm install
```
* Dans un premier Terminal

```bash
npm run -w apps/api dev
`````
* Dans un deuxième Terminal

```bash
npm run -w apps/web dev
```

* Front: http://localhost:5173 | API: http://localhost:5179


## Exercice

### Correction du bug

Voici le bug :

* Je vais dans la page racine
* Je me connecte
* Je constate une erreur 401 dans la page
* Je refresh la page, je suis bien connecté

Attendu :

* Pas besoin de refresh

### Refactor : Introduire un AuthContext minimal

But : supprimer le module global et exposer token, user, login, logout via un contexte + hook useAuth().

Tâches :

Créer src/auth/AuthContext.tsx avec un provider qui stocke token dans localStorage et user en state.

Remplacer la restauration de session d’App.tsx par une logique dans le provider (/me si token présent).

Faire consommer useAuth() dans Header, LoginPage, ProductsPage (fin du prop‑drilling).

### Refactor : Créer un hook useApi() avec interceptor de headers

But : ne jamais capturer un token obsolète. Le hook doit lire le token courant via useAuth() et ajouter l’Authorization au moment de chaque requête.

Tâches :

Écrire useApi() qui retourne { get, post } basés sur fetch et injecte Authorization en lisant token.

Réécrire ProductsPage pour utiliser api.get("/products") provenant du hook.

### Refactor : Factoriser les écrans avec un hook useQuery maison

But : éviter le boilerplate loading/error/data en créant un petit hook générique.

Tâches :

Créer useQuery<T>(key, fn) qui gère loading/error/data + invalider via un version state.

Réécrire ProductsPage pour utiliser useQuery.