# Database Tooling for earthquakes-api

This directory contains the PostgreSQL database setup and Alembic migrations for the `earthquakes-api` project.

## Configuration

All database connection details are managed in the **project root `.env` file**.
Ensure the following variables are set in your `../.env` file:

```dotenv
POSTGRES_HOST=localhost   # 'db' when running in Docker
POSTGRES_PORT=5432
POSTGRES_DB=earthquakes
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_URL=postgresql+psycopg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
```

## Local Usage (without Docker)

To run migrations locally, you need a PostgreSQL instance running (e.g., via `brew install postgresql` or a local Docker container).

1. **Navigate to the project root directory:**
   ```bash
   cd /home/caique/workspace/earthquakes/earthquakes-api
   ```

2. **Create and activate a Python virtual environment (if you don't have one):**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Ensure your root `.env` is configured for local PostgreSQL:**
   (i.e., `POSTGRES_HOST=localhost`)

5. **Run Alembic migrations:**
   ```bash
   alembic -c db/alembic.ini upgrade head
   ```
   This will apply all pending migrations to your local PostgreSQL database.

## Docker Usage

When running with Docker Compose, the database and migrations are handled automatically.

1. **Ensure your project root `.env` file is configured.**
   (The `POSTGRES_HOST` will be overridden to `db` for the `db-migrate` service automatically).

2. **Navigate to the project root directory:**
   ```bash
   cd /home/caique/workspace/earthquakes/earthquakes-api
   ```

3. **Start Docker Compose services:**
   ```bash
   docker compose up
   ```
   This command will:
   * Start the `db` (PostgreSQL) container.
   * Wait for the `db` service to become healthy.
   * Run the `db-migrate` container, which executes `alembic upgrade head` to apply all migrations.
   * Start the `api` (FastAPI) container, ensuring the database schema and seed data are ready.

## Database Schema

The `earthquakes` table is created with the following structure:

* `id`: SERIAL PRIMARY KEY
* `geo_id`: VARCHAR(64) NOT NULL UNIQUE
* `title`: VARCHAR(255) NOT NULL
* `image`: TEXT (nullable)
* `description`: TEXT (nullable)
* `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
* `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

Indexes are created on `geo_id` and `title` for efficient querying.

## Migration Files

* `001_create_earthquakes.py`: Creates the earthquakes table and indexes
* `002_seed_fake_data.py`: Inserts sample earthquake data (idempotent)

All migrations are idempotent and safe to re-run.