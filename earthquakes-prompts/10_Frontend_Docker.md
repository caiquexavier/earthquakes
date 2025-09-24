Here’s the updated CursorAI prompt with your new fix included:

---

**Role:** You are a **Frontend DevOps + Nuxt specialist** and clean-code guardian.

**Project:** `earthquakes-app` (Nuxt.js, minimal configuration).

**Goal:**

1. Install and configure Nuxt.js (if not present).
2. Add **Docker support** so the frontend runs in a container and is reachable from the host on **port 4000**.
3. Include a **docker compose** service.
4. Fix the navigation bug in the **goToDetails function** by using Nuxt’s router correctly.

---

### Constraints

* Keep changes **minimal** and **clean**.
* Do not add any unrelated features.
* Follow clean code practices: small files, descriptive naming, no dead configs.
* Use a **multi-stage Docker build** for small images.
* The app must bind to **0.0.0.0:4000**.
* `docker-compose.yml` must **not** use the deprecated `version` key.
* Do **not** alter business logic except for the router fix.

---

### Tasks

#### 1) Nuxt.js Minimal Setup

* Initialize a **Nuxt 3 minimal app structure** inside `earthquakes-app` root if it’s missing.
* Keep `nuxt.config` minimal, use defaults (no extra plugins).
* Ensure `package.json` scripts contain: `dev`, `build`, `preview`.
* Build must produce the standard `.output` Nitro server for runtime.

#### 2) Router Bug Fix

* The issue is in `goToDetails` (lines 80–84).
* It incorrectly uses **`useRouter` from vue-router** and navigates to a **non-existent named route** `'earthquake-detail'`.
* Update the component to:

  * Use **Nuxt’s built-in router** (`useRouter` from Nuxt).
  * Navigate via **file-based routing** (e.g., `router.push('/earthquakes/[id]')` or equivalent based on Nuxt pages).
* Confirm that navigation to the earthquake details page works correctly in Nuxt’s routing system.

#### 3) Docker Setup

* Create a **`.dockerignore`** that excludes node\_modules, caches, build outputs, VCS metadata, logs, and `.env`.
* Create a **multi-stage Dockerfile**:

  * **Builder stage:** install dependencies with a deterministic method (`npm ci`), copy source, run `npm run build`.
  * **Runner stage:** copy only `.output` and required runtime files, set `NODE_ENV=production`.
  * Configure environment: `NITRO_PORT=4000`, `NITRO_HOST=0.0.0.0`, `PORT=4000`.
  * Expose **4000**.
  * Run using `node .output/server/index.mjs`.

#### 4) docker compose

* Single service: `web`.
* Build from local Dockerfile.
* Map `4000:4000`.
* Pass same environment vars (`NITRO_PORT`, `NITRO_HOST`, `PORT`).
* Add lightweight healthcheck if feasible.

#### 5) Developer Experience

* Optimize Docker layers (dependencies → source → build).
* Keep image lean (multi-stage).
* Exclude unnecessary files via `.dockerignore`.
* No extra services in compose.

---

### Acceptance Criteria

* `docker compose up` runs the app at **[http://localhost:4000](http://localhost:4000)**.
* Container logs show **bound to 0.0.0.0:4000**.
* Router bug is fixed: clicking details navigates to the correct Nuxt file-based route.
* Final Docker image contains only runtime files.
* No extra features added; only Nuxt setup, Docker support, and the router fix.

---

Do you want me to also explicitly **specify the corrected Nuxt router navigation pattern** (e.g., `/earthquakes/[id]`) inside the prompt so Cursor updates the component automatically, or should I leave it as a general “fix router to Nuxt style” instruction?
