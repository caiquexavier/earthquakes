**CursorAI Prompt — Backend: Add USGS Public Feed Integration (no extra features)**

> **Role:** You are a Python FastAPI backend specialist working inside the existing `earthquake-api` repository.
> **Goal:** Implement a minimal, production-safe integration with the USGS public GeoJSON feeds so that our API can return **GeoJSON** earthquake data filtered by **timebox** and **magnitude**.
> **Rules:**
>
> * **Do not** add unrelated features or refactors.
> * **Do not** change public routes beyond what’s specified.
> * **No frontend changes.**
> * Prefer stdlib HTTP; only add a dependency if absolutely necessary.
> * Keep Docker, DB, and existing services untouched.

---

### Reference

USGS feeds documentation: [https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)
USGS summary feed pattern:
`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/{magnitude}_{time}.geojson`

---

## 1) Create a new service (fetches USGS GeoJSON)

**Path:** `api/services/public_usgs_service.py`
**Contract (keep names exact):**

* Function: `fetch_public_earthquakes(timebox: str, magnitude: str) -> dict`
* Behavior:

  * Accepts `timebox` in `{ "H", "D", "W", "M" }`

  * Accepts `magnitude` in `{ "4.5+", "2.5+", "1.0+", "all" }`

  * Maps inputs to USGS feed path segments:

    **Timebox map**

    * `H` → `hour`
    * `D` → `day`
    * `W` → `week`
    * `M` → `month`

    **Magnitude map**

    * `"4.5+"` → `4.5`
    * `"2.5+"` → `2.5`
    * `"1.0+"` → `1.0`
    * `"all"` → `all`

  * Build URL: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/{MAG}_{TIME}.geojson`

    * Example: `summary/2.5_day.geojson`, `summary/all_week.geojson`, `summary/4.5_hour.geojson`

  * Perform an HTTP GET, parse JSON, **return the GeoJSON dict as-is** (no transformation).

  * On invalid filters: raise an HTTP 400 with a concise message (`"invalid timebox"` or `"invalid magnitude"`).

  * On upstream/network failure: raise HTTP 502 with a concise message (`"usgs upstream error"`).
* Implementation notes:

  * Prefer Python stdlib (`urllib.request`) to avoid new deps.

    * Set a short, sane timeout (e.g., 10s).
    * Set a basic User-Agent header (e.g., `earthquake-api/1.0`).
  * Do **not** log sensitive details or spam logs.

---

## 2) Controller: new function + wire-in service

**File to edit:** `api/controllers/earthquakes_controller.py`
**Add a new FastAPI route** that directly exposes the filtered USGS data:

* **Method/Path:** `GET /api/public/earthquakes`
* **Query params:**

  * `timebox: str` (required; one of `H,D,W,M`)
  * `magnitude: str` (required; one of `4.5+,2.5+,1.0+,all`)
* **Behavior:**

  * Call `fetch_public_earthquakes(timebox, magnitude)` from the new service.
  * Return the **GeoJSON** response as-is.
  * Response media type should be `application/json` (default FastAPI JSON response is fine).

**Update existing function:**

* `get_earthquakes()` **must now delegate to the new service** (keep its route/path exactly as it is today).

  * If `get_earthquakes` currently has no filters, call the new service with sensible defaults:

    * Default `timebox="D"` (day)
    * Default `magnitude="all"`
  * Return the **GeoJSON** unmodified.

**Do not change** any other controller behavior, imports, or routes beyond what’s necessary to support the above.

---

## 3) Validation & Errors (minimal, explicit)

* If `timebox` not in `{H,D,W,M}` → HTTP 400 JSON: `{"detail":"invalid timebox"}`
* If `magnitude` not in `{4.5+,2.5+,1.0+,all}` → HTTP 400 JSON: `{"detail":"invalid magnitude"}`
* Upstream/HTTP errors (non-200, timeouts, parse errors) → HTTP 502 JSON: `{"detail":"usgs upstream error"}`

Keep messages short and consistent.

---

## 4) Testing Notes (no framework additions)

* Basic sanity check (manual):

  * `GET /api/public/earthquakes?timebox=D&magnitude=all` returns a GeoJSON with `type="FeatureCollection"` and a `features` array.
  * Try combinations like:

    * `H` + `4.5+` → `summary/4.5_hour.geojson`
    * `W` + `2.5+` → `summary/2.5_week.geojson`
    * `M` + `1.0+` → `summary/1.0_month.geojson`
* Ensure `get_earthquakes()` now returns GeoJSON from USGS using defaults (`D`, `all`).

---

## 5) Constraints Recap

* **No extra dependencies** unless essential. If you must add one (e.g., `httpx`), justify it in a short inline comment and add **only** that dependency to `requirements.txt`.
* **No schema/models changes**, **no DB** changes, **no middleware** changes.
* **No additional endpoints** beyond the one specified.
* **No data transformations**: return USGS GeoJSON verbatim.

---

### Deliverables checklist

* [ ] `api/services/public_usgs_service.py` with `fetch_public_earthquakes(timebox, magnitude) -> dict`
* [ ] `api/controllers/earthquakes_controller.py`:

  * [ ] New `GET /api/public/earthquakes` endpoint (reads `timebox`, `magnitude` from query)
  * [ ] `get_earthquakes()` updated to call the new service with defaults
* [ ] Error handling per section 3
* [ ] No unrelated changes, no feature creep

**Make the smallest possible set of edits to meet the above.**
