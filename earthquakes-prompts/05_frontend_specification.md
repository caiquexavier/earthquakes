Here’s a single **CursorAI prompt** (no code) that adds your requested fixes on top of the existing Vue 3 + Vite + TypeScript + Vuetify setup.

---

**Role:** You are a senior Vue 3 front-end engineer and clean-code guardian.
**Goal:** In **`earthquakes-app`**, ensure Vuetify components are properly registered and TypeScript/Vite are configured so all Material components render without errors. Do **not** add features beyond what’s already specified (header, list, details page). Apply only the fixes below.

### ✅ Scope: “Vuetify Components Registration Fixed!”

Implement the following corrections and config hygiene. Do not include any sample or boilerplate code in the output—only create/update files with correct content.

---

## 1) Main bootstrap fix

**File:** `src/main.ts`
**Action:** Configure Vuetify with **explicit global component/directive registration**.

* Import Vuetify, then import `* as components` and `* as directives` from `vuetify/components` and `vuetify/directives`.
* Create and use the Vuetify instance so all components like `v-col`, `v-row`, `v-card`, `v-btn` are globally recognized.
* Mount the app.
* Keep existing imports (App, router, styles) intact.

**Result:** The runtime error **“Failed to resolve component: v-col”** is eliminated.

---

## 2) Vite configuration hygiene

**File:** `vite.config.ts`
**Actions:**

* Ensure `@` alias resolves to `src/` for clean imports.
* Confirm Vue plugin is set up for Vuetify 3 compatibility.
* Keep dev tools behavior standard; do not add extra plugins.
* (If present) keep SSR/build settings minimal and compatible with Vuetify 3.

**Result:** Clean imports (`@/…`) and stable dev build for Vuetify.

---

## 3) TypeScript configuration

**File:** `tsconfig.json`
**Actions:**

* Ensure `"baseUrl": "."`.
* Ensure path mapping so `@/*` → `src/*`.
* Keep strict defaults (no loosening of strictness).
* Do not introduce additional compilerOptions beyond what’s needed for path aliasing and baseUrl.

**Result:** Editor/TS server correctly resolves `@/…` paths across the app.

---

## 4) Type declarations for Vuetify

**File:** `src/shims-vuetify.d.ts` (or `src/types/vuetify.d.ts`)
**Actions:**

* Add **module declarations** so TS recognizes Vuetify components/directives and avoids “cannot find module” or JSX/TS errors.
* Keep the declaration file minimal and specific to Vuetify; do not include unrelated globals.

**Result:** TS no longer throws errors related to Vuetify type resolution.

---

## 5) SCSS deprecation warnings (keep fixed)

**File:** `src/styles/main.scss`
**Actions:**

* Use **`@use`** syntax for Vuetify styles.
* Remove all `@import` usages.
* Keep any token overrides with the modern API only.

**Result:**

* **Legacy JS API warning**: resolved.
* **`@import` deprecation**: resolved.
* No style-related warnings in the console.

---

## 6) Sanity checks across app shell & pages

**Files:** `src/App.vue`, `src/pages/HomePage.vue`, `src/pages/EarthquakeDetailsPage.vue`, `src/components/...`
**Actions:**

* Ensure these files **use Vuetify components** (e.g., `v-app`, `v-app-bar`, `v-main`, `v-container`, `v-row`, `v-col`, `v-card`, `v-btn`) without local registration (should work globally after fix).
* Keep existing minimal functionality (header with user info, list component, details page).
* Do not add new features or libraries.

---

## 7) Acceptance criteria

* Running `npm run dev` **renders all Vuetify components** (e.g., `v-col`, `v-row`, `v-card`, `v-btn`) without “Failed to resolve component” errors.
* No SCSS deprecation warnings appear in the terminal or browser console.
* TS shows **no type errors** related to Vuetify or path aliases.
* Existing pages/components continue to function unchanged (header, earthquake list with the sample item, details page).
* No extraneous packages or config added beyond what’s necessary for Vuetify global registration, Vite aliasing, TS path mapping, and Vuetify typings.

---

**Deliverables:**

* Updated `src/main.ts`, `vite.config.ts`, `tsconfig.json`, `src/shims-vuetify.d.ts` (or `src/types/vuetify.d.ts`), and `src/styles/main.scss`.
* A concise confirmation note that:

  * ✅ Vuetify components are globally available,
  * ✅ TS resolves Vuetify modules and `@/…` imports,
  * ✅ SCSS uses modern `@use` with no deprecation warnings,
  * ✅ App runs cleanly via `npm run dev`.


Awesome—switching the filters to **hit the backend**. Here’s a tight, ready-to-paste **CursorAI Frontend Prompt** that wires the List page to your new `earthquake-api` endpoint with query params, keeps your badge colors, and avoids scope creep.

---

### 🚀 Frontend CursorAI Prompt (Backend-Integrated Filters)

**Role:** You are a **frontend Vue 3 + Vite + TypeScript + Vuetify specialist**.
**Goal:** Update the **Earthquake List** page in `earthquakes-app` to fetch filtered data from the backend `earthquake-api` using query params, and render with existing UI.

---

### Requirements

1. **Preserve existing UI behavior**

   * Use Vuetify components.
   * Keep current layout and typography.
   * Preserve **magnitude badges with exact colors**:

     * `≥ 4.5` → `#f24949`
     * `> 2.5 and < 4.5` → `#edf249`
     * `≤ 2.5` → `#49a3f2`
   * Keep GeoJSON parsing and the Details page with Google Maps intact.

2. **Backend-integrated Filters**

   * Add **two filter button groups** on the List page: **Timebox** and **Magnitude**.
   * When a filter changes, **make a new request** to the backend (no client-side filtering of stale data).
   * **HTTP GET** to the new endpoint (base path example—adjust only the base URL if needed, not the param names):

     ```
     GET {API_BASE}/api/earthquakes?timebox={T}&magnitude={M}
     ```
   * **Query params (strings):**

     * `timebox` ∈ `H | D | W | M`
     * `magnitude` ∈ `"4.5+" | "2.5+" | "1.0+" | "all"`
   * **Response:** GeoJSON `FeatureCollection` (use existing parsing/rendering).

3. **Filter Maps & Labels**

   * **Timebox map (label → param):**

     * `H` → `hour`
     * `D` → `day`
     * `W` → `week`
     * `M` → `month`
     * **IMPORTANT:** UI labels show `H/D/W/M`, but the **request param** must be the single letter (`H|D|W|M`).
   * **Magnitude map (label → param):**

     * `"4.5+"` → `"4.5+"`
     * `"2.5+"` → `"2.5+"`
     * `"1.0+"` → `"1.0+"`
     * `"all"` → `"all"`

4. **UI/UX behavior**

   * Use **Vuetify button groups**; highlight the active selection.
   * **Default selection:** `timebox=D` (Day) and `magnitude=all`.
   * On change: show a loading state, fetch, handle errors with a simple inline alert/snackbar, then render the new list.
   * Do **not** add extra features (no pagination, no search, no URL sync) unless already present.

5. **Integration details**

   * Read `API_BASE` from existing config/env the app already uses (do **not** introduce new config patterns).
   * Respect existing CORS behavior (assume backend allows it).
   * Keep typing strict (TypeScript): define minimal types only if needed to satisfy the fetch handler; do not refactor unrelated code.

---

### Out of Scope (do not change)

* No backend code changes.
* No design restyle beyond the badge colors rule above.
* No new routes/pages/components beyond what’s needed to place the two button groups and wire the fetch.

---

**Deliverable:** Updated List page with **backend-driven filtering** via `timebox` and `magnitude` query params, correct badge colors, loading/error handling, and unchanged existing features.
