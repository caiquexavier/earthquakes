"""Earthquakes controller defining API routes."""
from typing import List, Dict, Any

from fastapi import APIRouter

from api.services.earthquake_service import get_earthquakes as service_get_earthquakes


router: APIRouter = APIRouter()


@router.get("/getEarthquakes")
def get_earthquakes() -> List[Dict[str, Any]]:
    """Return the list of earthquakes by delegating to the service layer."""
    return service_get_earthquakes()


