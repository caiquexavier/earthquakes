Create a minimal FastAPI project inside a folder named "earthquakes-api".

Strict project rules:
- Only one endpoint: GET /api/getEarthquakes
- Do not add any other endpoints, schemas, filters, query parameters, middleware, services, logging, monitoring, tests, or extra code beyond what is described here.
- Project root folder: earthquakes-api/
- Inside earthquakes-api/ the folder structure must be exactly:
  earthquakes-api/
    main.py
    requirements.txt
    .env.example
    .env   (developer fills real key)
    install.sh
    Dockerfile
    docker-compose.yml
    README.md
    api/
      controllers/
      models/
      valitations/
      services/
      middleware/
      core/

Clean code constraints:
- Explicit type hints everywhere
- No variable name abbreviations (use full words)
- Functions must be small, clear, and have docstrings
- Routes must only delegate to service functions (no inline business logic)
- All constants and configuration values live in /api/core/config.py as functions returning values

Application features:
- main.py:
  * Load .env with python-dotenv
  * Create FastAPI application with title "earthquakes-api" (variable name: application)
  * Register global API key middleware
  * Mount /api/controllers/earthquakes_controller.py at prefix /api
  * Add GET /health that returns {"status": "ok"} (not secured)

- /api/middleware/api_key_middleware.py:
  * ASGI middleware that checks X-API-Key header against API_KEY from .env
  * Deny all requests without a valid key, except GET /health
  * On failure, return 401 {"detail": "Invalid API Key"}

- /api/controllers/earthquakes_controller.py:
  * Define GET /getEarthquakes (path: /api/getEarthquakes)
  * Route must call service function get_earthquakes() from /api/services/earthquake_service.py
  * Return the result of that service

- /api/services/earthquake_service.py:
  * Implement function get_earthquakes() -> list[Earthquake]
  * Return a static list (3 items) of Earthquake objects with: geo_id (str), title (str), image (str), description (str)
  * Call fetch_placeholder_image_url() from /api/services/earthquake_client.py for the image field

- /api/services/earthquake_client.py:
  * Implement function fetch_placeholder_image_url() -> str
  * Return a fixed placeholder image URL string (no HTTP calls)

- /api/models/earthquake.py:
  * Pydantic model Earthquake(geo_id: str, title: str, image: str, description: str)

- /api/core/config.py:
  * Only define constants used in the application
  * Each constant must have its own function named getConstantName() that returns its value (no logic)
  * Required functions:
    - getProjectTitle() -> str                # "earthquakes-api"
    - getHealthEndpointPath() -> str          # "/health"
    - getApiPrefix() -> str                   # "/api"
    - getXApiKeyHeader() -> str               # "X-API-Key"
    - getPlaceholderImageUrl() -> str         # "https://example.com/placeholder.png"
    - getApiKey() -> str                      # loads API_KEY from environment
    - getServerPort() -> int                  # returns 8080

- /api/valitations:
  * Only __init__.py (no schemas, no extra code)

Bootstrap (local):
- requirements.txt: fastapi, uvicorn[standard], pydantic, python-dotenv
- .env.example:
    API_KEY=your_dev_key
- .env: developer fills real values
- install.sh (bash, executable):
  * create venv in .venv if missing
  * activate venv
  * install dependencies
  * load .env into shell
  * run: uvicorn main:application --host 0.0.0.0 --port 8080 --reload

Docker:
- Dockerfile (must set up Python and a virtual environment inside the image):
  * Base: python:3.11-slim
  * Create venv at /opt/venv and export PATH so it is used
  * Copy requirements.txt and install into the venv
  * Copy project files
  * Expose port 8080
  * Default CMD: uvicorn main:application --host 0.0.0.0 --port 8080
- docker-compose.yml:
  * Services:
    - api:
        build: .
        ports: ["8080:8080"]
        env_file: .env

README.md:
- Venv steps
- install.sh usage
- Docker build/run instructions (`docker compose up --build`)
- curl example for /api/getEarthquakes with X-API-Key header
- Sample response JSON (list of 3 items with geo_id, title, image, description)

Acceptance checklist:
- ./install.sh runs the API on port 8080
- Docker image builds; docker compose runs on port 8080
- /health works without API key
- /api/getEarthquakes returns 401 without key
- /api/getEarthquakes returns mocked list (geo_id, title, image, description) with valid key
- Variable names contain no abbreviations
- No additional features, endpoints, code, or files exist beyond what is explicitly required
- Folder structure exactly matches specification
- config.py contains only functions named getConstantName() returning values
- Controller delegates to service.get_earthquakes()
