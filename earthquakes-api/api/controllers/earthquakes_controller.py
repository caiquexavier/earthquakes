"""Earthquakes controller defining API routes."""
from typing import List, Dict, Any

from fastapi import APIRouter, Query

from api.services.earthquake_service import get_earthquakes as service_get_earthquakes
from api.services.public_usgs_service import fetch_public_earthquakes


router: APIRouter = APIRouter()


@router.get("/public/earthquakes")
def get_public_earthquakes(
    timebox: str = Query(..., description="Time period: H, D, W, M"),
    magnitude: str = Query(..., description="Magnitude filter: 4.5+, 2.5+, 1.0+, all")
) -> Dict[str, Any]:
    """Return GeoJSON earthquake data from USGS public feeds."""
    return fetch_public_earthquakes(timebox, magnitude)


@router.get("/getEarthquakes")
def get_earthquakes() -> Dict[str, Any]:
    """Return the list of earthquakes by delegating to the USGS service with defaults."""
    return fetch_public_earthquakes("D", "all")


