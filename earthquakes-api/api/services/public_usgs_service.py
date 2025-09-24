"""Service for fetching public USGS GeoJSON earthquake feeds.

Exposes a minimal function to retrieve GeoJSON from USGS based on
timebox and magnitude filters.
"""
from typing import Dict
import json
from urllib import request, error
from fastapi import HTTPException


_TIMEBOX_MAP: Dict[str, str] = {
    "H": "hour",
    "D": "day",
    "W": "week",
    "M": "month",
}

_MAGNITUDE_MAP: Dict[str, str] = {
    "4.5+": "4.5",
    "2.5+": "2.5",
    "1.0+": "1.0",
    "all": "all",
}


def fetch_public_earthquakes(timebox: str, magnitude: str) -> dict:
    """Fetch GeoJSON earthquakes feed from USGS using provided filters.

    Args:
        timebox: One of {"H", "D", "W", "M"}.
        magnitude: One of {"4.5+", "2.5+", "1.0+", "all"}.

    Returns:
        A dictionary parsed from the USGS GeoJSON response.

    Raises:
        HTTPException: 400 for invalid filters, 502 for upstream errors.
    """
    mapped_time = _TIMEBOX_MAP.get(timebox)
    if mapped_time is None:
        raise HTTPException(status_code=400, detail="invalid timebox")

    mapped_mag = _MAGNITUDE_MAP.get(magnitude)
    if mapped_mag is None:
        raise HTTPException(status_code=400, detail="invalid magnitude")

    url = (
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/"
        f"{mapped_mag}_{mapped_time}.geojson"
    )

    req = request.Request(url, headers={"User-Agent": "earthquake-api/1.0"})

    try:
        with request.urlopen(req, timeout=10) as resp:
            # urllib raises for non-200 codes via HTTPError
            data = resp.read()
            return json.loads(data.decode("utf-8"))
    except (error.HTTPError, error.URLError, TimeoutError, json.JSONDecodeError):
        # Keep upstream failure opaque and concise per spec
        raise HTTPException(status_code=502, detail="usgs upstream error")


