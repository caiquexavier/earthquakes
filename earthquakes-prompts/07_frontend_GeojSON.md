Here’s a **single CursorAI prompt** (no code) you can paste and run to update the **frontend only**. It keeps clean code, matches NASA’s visual style, consumes the **new GeoJSON FeatureCollection**, renders **cards with critical info**, and adds a **Details page** that fetches the supplied `properties.detail` URL and shows a **Google Map** pinned to the event location.

---

**Role:** You are a **frontend Vue specialist and clean code guardian**.
**Goal:** In `earthquakes-app` (Vue 3 + Vite + TypeScript + Vuetify), align UI with **nasa.gov** style (typography, heading color/sizing), show a **list** of earthquakes from the **new GeoJSON FeatureCollection** returned by the backend, and add a **Details** page that fetches the **`properties.detail`** GeoJSON and displays full info plus a **Google Map** with a marker at the event location. **Do not add unrelated features.**

---

## 1) Environment & dependencies (frontend)

* Ensure `.env` (and `.env.example`) include:

  * `VITE_API_BASE=http://127.0.0.1:8080`
  * `VITE_API_KEY=your_dev_key`
  * `VITE_GOOGLE_MAPS_API_KEY=REPLACE_WITH_YOUR_KEY`
* Add dev/runtime deps needed for maps typing & loader:

  * `@googlemaps/js-api-loader` (runtime)
  * `@types/google.maps` (dev)
* Keep existing Vuetify setup, SCSS `@use` migration, Vuetify global component registration, `vite-env.d.ts` with `declare module '*.vue'`, and Vuetify shim types intact.

---

## 2) Data contract (GeoJSON FeatureCollection)

Backend now returns:

```
{
  "type": "FeatureCollection",
  "metadata": { ... },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "mag": number,
        "place": string,
        "time": number,        // epoch ms
        "updated": number,     // epoch ms
        "url": string,         // USGS event page
        "detail": string,      // USGS detail GeoJSON URL (use for Details page)
        "magType": string,
        "type": "earthquake",
        "...": "other USGS fields"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [lon: number, lat: number, depthKm: number]
      },
      "id": string            // event id
    }
  ]
}
```

---

## 3) Types (minimal, typed, reusable)

* Update `src/types/earthquake.ts` to include:

  * `GeoJsonFeatureCollection`, `GeoJsonFeature`, `GeoJsonProperties`, `GeoPointGeometry`.
  * A **view-friendly** `Earthquake` type derived from GeoJSON for the UI list:

    * `id: string`
    * `title: string` (e.g., `properties.title` or `M ${mag} - ${place}`)
    * `magnitude?: number`
    * `place?: string`
    * `time?: number`
    * `updated?: number`
    * `coordinates?: { lat: number; lon: number; depthKm?: number }`
    * `usgsUrl?: string` (from `properties.url`)
    * `detailUrl?: string` (from `properties.detail`)

> Keep types small and strictly what’s needed for the list/details; no extra fields.

---

## 4) Service layer (pure, defensive)

**File:** `src/services/earthquakes.ts`

* Keep **X-API-Key** header for the backend call to `GET ${VITE_API_BASE}/api/getEarthquakes`.
* Implement:

  * `list(): Promise<Earthquake[]>`

    * Fetch the FeatureCollection.
    * Validate shape (`type === 'FeatureCollection'`, `Array.isArray(features)`).
    * Map each `Feature` → `Earthquake`:

      * `id = feature.id`
      * `magnitude = properties.mag`
      * `title = properties.title ?? \`M \${mag} - \${place}\`\`
      * `place = properties.place`
      * `time = properties.time`
      * `updated = properties.updated`
      * `coordinates = { lat: geometry.coordinates[1], lon: geometry.coordinates[0], depthKm: geometry.coordinates[2] }`
      * `usgsUrl = properties.url`
      * `detailUrl = properties.detail`
  * `fetchDetail(detailUrl: string): Promise<GeoJsonFeature | null>`

    * Fetch the **USGS detail GeoJSON** from `detailUrl` (no custom headers).
    * Return the feature or `null` on error (UI handles errors).
* No side effects beyond fetch. No global state.

---


## 6) List page (Home)

**Files:**

* `src/pages/HomePage.vue` (or your existing list page)
* `src/components/earthquakes/EarthquakeList.vue`
* `src/components/earthquakes/EarthquakeCard.vue`

**Behavior:**

* On mount, call `earthquakesService.list()`.
* Show **critical info** on each card:

  * **Magnitude badge** with two-color rule:

    * `mag >= 4.5` → **red** (`--nasa-red`)
    * `mag < 4.5` → **green** (`--severity-green`)
  * Title (or `place` if title missing)
  * Coordinates (lat, lon) with 2–3 decimals
  * Depth (km) if present
  * Local datetime derived from `time`
* **Details button**:

  * Navigates to a **new Details page** using the provided **`detailUrl`**.
  * Use a **route with a query param** to preserve sharable URLs:

    * Path: `/earthquakes/detail?detail={encodeURIComponent(detailUrl)}`
  * Do **not** add extra features (filters, sorting, maps in list, etc.).

---

## 7) Details page (new)

**File:** `src/pages/EarthquakeDetailsPage.vue` (add a route)

* On mount:

  * Read `detail` from **query string**.
  * Call `earthquakesService.fetchDetail(detail)` to get full GeoJSON Feature.
* Render **complete information**:

  * All major `properties` (mag, magType, place, time, updated, status, tsunami, sig, net, code, ids, types, url).
  * Coordinates and depth.
  * A link: “Open on USGS” → `properties.url`.
* **Google Map**:

  * Create a small `GoogleMap` component (e.g., `src/components/map/GoogleMap.vue`) that:

    * Uses `@googlemaps/js-api-loader` with `VITE_GOOGLE_MAPS_API_KEY`.
    * Initializes a map centered at `[lat, lon]`.
    * Adds one marker at the event location.
    * Minimal options (sane zoom \~6–8); no extra overlays or libraries.
  * Display the map within the Details page below the info card.
* Keep NASA styling (headings in `--nasa-blue`, clear hierarchy). No extra UI gadgets.

**Routing:**

* Add route:

  * Path: `/earthquakes/detail`
  * Name: `earthquake-detail`
  * Component: `EarthquakeDetailsPage`
* Ensure `router.push({ name: 'earthquake-detail', query: { detail: detailUrl } })` from the card’s “Details” button.

---

## 8) Clean code constraints

* **SRP & SoC:** Services fetch/parse; pages orchestrate; components present.
* **Typed props/returns** and narrow interfaces.
* **No hidden side effects**; components are presentational.
* **Keep it minimal:** Only what’s listed above. No pagination, no filters, no maps on the list page, no extra libraries beyond Google Maps loader & types.

---

## 9) Acceptance criteria

* `npm run dev` starts cleanly with **no TS errors** and **no SCSS deprecation warnings**.
* **Home (list)** renders cards with:

  * Title/place, **magnitude badge** (red if ≥ 4.5, green otherwise), coordinates, depth, and local time.
  * **Details** button routes to `/earthquakes/detail?detail=...`.
* **Details page**:

  * Fetches the **USGS detail GeoJSON** from the `detail` query param.
  * Displays **complete information** from `properties` and coordinates.
  * Shows a **Google Map** with a single marker at the event location.
  * Provides a link to “Open on USGS”.


---

**Deliverables**

* Updated: `src/types/earthquake.ts`, `src/services/earthquakes.ts`, `src/styles/main.scss`, list components (`EarthquakeList.vue`, `EarthquakeCard.vue`), `HomePage.vue`, `EarthquakeDetailsPage.vue`, router configuration, and a minimal `GoogleMap` component wired via `@googlemaps/js-api-loader`.
* Confirm the app shows live GeoJSON-based list, routes via the **`detail`** URL, and renders a Google Map on the details page.
