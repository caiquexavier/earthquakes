"""Global API key authentication middleware."""
from typing import Awaitable, Callable, Optional

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response
from starlette.types import ASGIApp

from api.core.config import (
    getHealthEndpointPath,
    getXApiKeyHeader,
    getApiKey,
)


class APIKeyMiddleware(BaseHTTPMiddleware):
    """Middleware that enforces API key authentication globally."""

    def __init__(self, app: ASGIApp) -> None:
        """Initialize middleware with the expected API key value.

        Args:
            app: The downstream ASGI application.
        """
        super().__init__(app)
        self.expected_application_programming_interface_key: Optional[str]
        self.expected_application_programming_interface_key = getApiKey()

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        """Process the request and enforce API key checks.

        Allows the health endpoint and OPTIONS requests without an API key. All other paths require a
        valid key provided via the configured header.
        """
        if request.url.path == getHealthEndpointPath() or request.method == "OPTIONS":
            return await call_next(request)

        provided_key: Optional[str] = request.headers.get(getXApiKeyHeader())
        if not self._is_authorized(provided_key):
            return JSONResponse(status_code=401, content={"detail": "Invalid API Key"})

        return await call_next(request)

    def _is_authorized(self, provided_key: Optional[str]) -> bool:
        """Return True if the provided key matches the expected key."""
        return (
            self.expected_application_programming_interface_key is not None
            and provided_key == self.expected_application_programming_interface_key
        )


