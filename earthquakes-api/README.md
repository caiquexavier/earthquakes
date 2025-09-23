# earthquakes-api

Minimal FastAPI service with a single endpoint.

## Requirements
- Python 3.10+

## Setup (manual virtual environment)
```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Create an `.env` file (see `.env.example`) with:
```bash
API_KEY=your_dev_key
```

## Quick start with install.sh
```bash
chmod +x install.sh
./install.sh
```

## Docker
Build and run using Docker Compose:
```bash
docker compose up --build
```

The API will be available at `http://localhost:8080`.

## Endpoints
- Health (no auth): `GET /health`
- Get earthquakes (requires API key): `GET /api/getEarthquakes`

Example request:
```bash
curl -s \
  -H "X-API-Key: your_dev_key" \
  http://localhost:8000/api/getEarthquakes
```

Example successful JSON response:
```json
[
  {
    "title": "Coastal Tremor",
    "image": "https://example.com/placeholder.png",
    "description": "A mild offshore earthquake with minimal impact."
  },
  {
    "title": "Valley Quake",
    "image": "https://example.com/placeholder.png",
    "description": "Shallow quake felt across nearby towns."
  },
  {
    "title": "Mountain Rumble",
    "image": "https://example.com/placeholder.png",
    "description": "Deep seismic activity under mountain range."
  }
]
```
