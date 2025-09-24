# Earthquakes Project

A full-stack earthquake monitoring application consisting of a FastAPI backend service and a Nuxt.js frontend application. The system provides real-time earthquake data from USGS feeds with filtering capabilities and interactive mapping features.

## 🏗️ Project Architecture

```
earthquakes/
├── earthquakes-api/          # FastAPI Backend Service
├── earthquakes-app/          # Nuxt.js Frontend Application
└── earthquakes-prompts/      # Development Documentation & Prompts
```

### System Overview

- **Backend**: FastAPI service with PostgreSQL database integration
- **Frontend**: Nuxt.js 3 SPA with Vuetify UI components
- **Data Source**: USGS Earthquake API (public feeds)
- **Deployment**: Docker containerized applications
- **Authentication**: API key-based authentication

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Running with Docker

1. **Start the API service:**
   ```bash
   cd earthquakes-api
   docker compose up --build
   ```
   API available at: `http://localhost:8080`

2. **Start the frontend application:**
   ```bash
   cd earthquakes-app
   docker compose up --build
   ```
   App available at: `http://localhost:4000`

### Local Development

#### Backend (earthquakes-api)
```bash
cd earthquakes-api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:application --host 0.0.0.0 --port 8080
```

#### Frontend (earthquakes-app)
```bash
cd earthquakes-app
npm install
npm run dev
```

## 📁 Project Structure & Features

### Backend (earthquakes-api)

**Technology Stack:**
- FastAPI (Python web framework)
- PostgreSQL (Database)
- SQLAlchemy (ORM)
- Alembic (Database migrations)
- Pydantic (Data validation)

**Key Features:**
- RESTful API endpoints
- USGS earthquake data integration
- API key authentication middleware
- CORS support for frontend integration
- Database models for earthquake storage
- Health check endpoint

**API Endpoints:**
- `GET /health` - Health check (no auth required)
- `GET /api/getEarthquakes` - Get earthquake data (requires API key)
- `GET /api/public/earthquakes?timebox={H|D|W|M}&magnitude={4.5+|2.5+|1.0+|all}` - Filtered earthquake data

**Project Structure:**
```
earthquakes-api/
├── api/
│   ├── controllers/          # API route handlers
│   ├── core/                # Configuration and constants
│   ├── middleware/          # Authentication middleware
│   ├── models/              # SQLAlchemy & Pydantic models
│   ├── services/            # Business logic services
│   └── validations/         # Input validation schemas
├── db/                      # Database configuration & migrations
├── main.py                  # FastAPI application entry point
├── requirements.txt         # Python dependencies
├── Dockerfile              # Container configuration
└── docker-compose.yml      # Multi-service orchestration
```

### Frontend (earthquakes-app)

**Technology Stack:**
- Nuxt.js 3 (Vue.js framework)
- Vuetify 3 (Material Design components)
- TypeScript (Type safety)
- Leaflet (Interactive maps)
- Google Maps API integration
- Vitest (Testing framework)

**Key Features:**
- Responsive Material Design UI
- Real-time earthquake data visualization
- Interactive filtering (time period & magnitude)
- Earthquake detail views with maps
- Loading states and error handling
- Client-side data filtering
- GeoJSON data processing

**Project Structure:**
```
earthquakes-app/
├── components/
│   ├── earthquakes/         # Earthquake-specific components
│   ├── layout/             # Layout components
│   └── map/                # Map-related components
├── pages/                  # Vue.js pages/routes
├── assets/                 # Static assets
├── public/                 # Public static files
├── earthquake.ts           # TypeScript type definitions
├── earthquakes.ts          # API service layer
├── nuxt.config.ts         # Nuxt.js configuration
├── package.json           # Node.js dependencies
├── Dockerfile             # Container configuration
└── docker-compose.yml     # Service orchestration
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```bash
API_KEY=your_dev_key
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/earthquakes
POSTGRES_DB=earthquakes
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

**Frontend (.env):**
```bash
VITE_API_BASE=http://127.0.0.1:8080
VITE_API_KEY=your_dev_key
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main table:

**earthquakes**
- `id` (Primary Key, Auto-increment)
- `geo_id` (String, Indexed, USGS identifier)
- `title` (String, Earthquake title)
- `image` (String, Optional image URL)
- `description` (Text, Optional description)

## 🎯 Core Functionality

### Data Flow
1. Frontend requests earthquake data from backend API
2. Backend fetches real-time data from USGS public feeds
3. Data is processed and returned as GeoJSON format
4. Frontend displays earthquakes with filtering capabilities
5. Users can filter by time period (H/D/W/M) and magnitude thresholds
6. Interactive maps show earthquake locations

### Filtering System
- **Time Periods**: Hour (H), Day (D), Week (W), Month (M)
- **Magnitude Thresholds**: 4.5+, 2.5+, 1.0+, All
- **Client-side filtering** for responsive user experience

### Map Integration
- Leaflet.js for interactive maps
- Google Maps API support
- Earthquake location visualization
- Detail views with coordinate information

## 🧪 Testing

**Backend Testing:**
- Unit tests for services and models
- API endpoint testing
- Database integration tests

**Frontend Testing:**
- Component unit tests with Vitest
- Vue Test Utils for component testing
- API service layer testing

## 🚀 Deployment

Both applications are containerized and can be deployed using Docker Compose:

```bash
# Backend deployment
cd earthquakes-api
docker compose up -d

# Frontend deployment  
cd earthquakes-app
docker compose up -d
```

## 📚 Development Documentation

The `earthquakes-prompts/` directory contains detailed development documentation including:
- FastAPI setup and configuration
- Database setup and migrations
- Frontend component specifications
- API integration guides
- Docker deployment instructions

