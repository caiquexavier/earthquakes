Here’s a single **CursorAI prompt** (no code) you can paste and run. It updates the frontend to add **filter buttons** on the earthquake list page, following your exact **Timebox** and **Magnitude** maps—while keeping NASA styling, GeoJSON parsing, CORS/API key usage, and the existing Details page with Google Maps. No unrelated features.

---

**Role:** You are a **frontend Vue specialist and clean code guardian**.
**Goal:** In `earthquakes-app` (Vue 3 + Vite + TypeScript + Vuetify), add **filter buttons** to the **List Earthquakes** page using the exact maps below, with client-side filtering over the GeoJSON data already fetched. Keep NASA typography/colors, magnitude badges (≥4.5 red, else green), existing CORS/API key usage, and the Details page.

### 0) Keep prior constraints as-is

* NASA design tokens (Helvetica/system sans, `--nasa-blue #0b3d91`, `--nasa-red #fc3d21`, `--severity-green #1f8a3b`) remain in `styles/main.scss` (using `@use`).
* Vuetify global registration in `main.ts` (components/directives).
* TypeScript path aliasing and `.vue` module declaration (`src/vite-env.d.ts`).
* Service uses `VITE_API_BASE` + `VITE_API_KEY` and returns **FeatureCollection** mapped to a UI-friendly `Earthquake`.
* Details page reads `detail` query param and shows a Google Map via `@googlemaps/js-api-loader`.

### 1) Files to add/update (minimal)

```
src/
  components/earthquakes/EarthquakeFilters.vue   // NEW: filter buttons (timebox + magnitude)
  pages/HomePage.vue                              // UPDATE: integrate filters + apply client-side filtering
  services/earthquakes.ts                         // NO endpoint changes; reuse existing list() result
  types/earthquake.ts                             // Ensure Earthquake has magnitude/time fields used for filters
```

### 2) Filter requirements (exact maps)

* **Timebox map** (single-select group; default **D**):

  * `H` → `hour`
  * `D` → `day`
  * `W` → `week`
  * `M` → `month`
* **Magnitude map** (single-select group; default **all**):

  * `"4.5+"` → threshold `4.5`
  * `"2.5+"` → threshold `2.5`
  * `"1.0+"` → threshold `1.0`
  * `"all"` → no magnitude filter

### 3) Implementation details

* Create `EarthquakeFilters.vue` (presentational, no fetch).

  * Props: `modelValueTimebox` (one of `H|D|W|M`), `modelValueMagnitude` (one of `"4.5+"|"2.5+"|"1.0+"|"all"`).
  * Emits: `update:modelValueTimebox`, `update:modelValueMagnitude`.
  * UI: two compact **Vuetify button groups** (or segmented controls) labeled “Time” and “Magnitude”, using NASA tokens for emphasis (titles in `--nasa-blue`).
  * No additional logic; purely selects values.

* In `HomePage.vue`:

  * Keep the initial fetch via `earthquakesService.list()` (unchanged).
  * Local reactive state:

    * `timebox = 'D'` (default day)
    * `magnitude = 'all'`
  * **Computed `filteredItems`:**

    * Start from the fetched `items`.
    * **Time filter:** compare each item’s `time` (epoch ms) to `Date.now()`:

      * `H`: now − 1 hour
      * `D`: now − 24 hours
      * `W`: now − 7 \* 24 hours
      * `M`: now − 30 \* 24 hours
    * **Magnitude filter:** apply threshold if magnitude option ≠ `all`.

      * Keep if `item.magnitude != null && item.magnitude >= threshold`.
    * Result feeds the existing `EarthquakeList` component.
  * **No refetching** on filter change (client-side only).
  * Preserve magnitude badge colors: **≥ 4.5 → `--nasa-red`**, otherwise `--severity-green`.

* **No changes** to endpoints or backend; **no new libraries** beyond those already in your setup.

### 4) UX / Styling notes (NASA match)

* Place the filters above the list in a simple toolbar area.
* Use concise labels (`H`, `D`, `W`, `M`) and (`4.5+`, `2.5+`, `1.0+`, `all`) exactly as provided.
* Keep headings/toolbar titles in `--nasa-blue`; keep spacing crisp; do not introduce extra components beyond `EarthquakeFilters.vue`.

### 5) Clean code constraints

* SRP: `EarthquakeFilters` manages selection UI; `HomePage` orchestrates data + computed filtering; `EarthquakeList` presents items.
* Typed props/returns; no hidden side effects; no global state.
* Keep code small and readable.

### 6) Acceptance criteria

* App runs (`npm run dev`) with **no TS/SCSS warnings**.
* **Home (list) page** displays the filter controls exactly as specified:

  * Time group: `H`, `D`, `W`, `M` (default **D**).
  * Magnitude group: `4.5+`, `2.5+`, `1.0+`, `all` (default **all**).
* Selecting filters updates the list immediately, **client-side**, combining both filters.
* Magnitude badges still follow two-color rule (≥4.5 red, else green).
* Details flow (via `detail` query param) and Google Map remain functional and unchanged.

**Deliverables:**

* New `src/components/earthquakes/EarthquakeFilters.vue` and updated `src/pages/HomePage.vue`, wired to filter **client-side** per the exact maps above. All other prior functionality remains intact.

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
