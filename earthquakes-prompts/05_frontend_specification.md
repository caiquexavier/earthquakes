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
