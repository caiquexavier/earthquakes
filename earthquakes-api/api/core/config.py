"""Application configuration and constants accessors.

Each function returns a specific constant or configuration value.
"""
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/earthquakes")


def getProjectTitle() -> str:
    """Return the FastAPI project title."""
    return "earthquakes-api"


def getHealthEndpointPath() -> str:
    """Return the health endpoint path."""
    return "/health"


def getApiPrefix() -> str:
    """Return the API prefix used for routers."""
    return "/api"


def getXApiKeyHeader() -> str:
    """Return the HTTP header name for the API key."""
    return "X-API-Key"


def getApiKey() -> Optional[str]:
    """Return the API key from environment variables (API_KEY)."""
    return os.getenv("API_KEY")


def getDATABASE_URL() -> str:
    """Return the database URL from environment variables."""
    return _DATABASE_URL

