"""FastAPI application entrypoint for earthquakes-api."""
from typing import Dict

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.core.config import (
    getProjectTitle,
    getHealthEndpointPath,
    getApiPrefix,
)
from api.controllers.earthquakes_controller import router as earthquakes_router
from api.middleware.api_key_middleware import APIKeyMiddleware


load_dotenv()

application: FastAPI = FastAPI(title=getProjectTitle())

# Add CORS middleware
application.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

application.add_middleware(APIKeyMiddleware)


@application.get(getHealthEndpointPath())
def health() -> Dict[str, str]:
    """Return a simple health status response."""
    return {"status": "ok"}


application.include_router(earthquakes_router, prefix=getApiPrefix())


