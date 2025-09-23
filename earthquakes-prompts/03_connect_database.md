Perfect — here’s the updated Cursor AI prompt including your applied fix with the controller adjustment. I’ve added the **🔧 Fix Applied** section exactly as you requested at the bottom for traceability.

---

# Cursor Prompt: Refactor Earthquake Service to Use Database + Add DB Access Service

**Context (do not change):**
Project root: `./earthquakes-api`
Controllers must keep their responsibilities minimal and delegate to the service layer. This refactor introduces DB access and updates the controller return type accordingly.

---

## Goals

1. **Create a dedicated DB access service** (connection/session management only).
2. **Refactor the earthquake service** to read from the database following the existing DB schema.
3. **Update the earthquake controller return type** to `List[Dict[str, Any]]` since the service now returns plain dicts.
4. **Use environment-driven configuration** via `core/` getters (one function per constant).

---

## Dependencies

Update `requirements.txt` (append if missing):

```
SQLAlchemy==2.0.34
psycopg2-binary==2.9.9
python-dotenv==1.0.1
```

---

## .env / .env.example

Add:

```
DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/earthquakes
```

---

## core/config.py

```python
import os
from dotenv import load_dotenv

load_dotenv()

_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/earthquakes")

def getDATABASE_URL():
    return _DATABASE_URL
```

---

## Models

`api/models/earthquake.py`

```python
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import String, Integer, Text

Base = declarative_base()

class Earthquake(Base):
    __tablename__ = "earthquakes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    geo_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    image: Mapped[str] = mapped_column(String(1024), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
```

---

## Database Service

`api/services/database.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.core.config import getDATABASE_URL

_engine = create_engine(getDATABASE_URL(), pool_pre_ping=True, future=True)

SessionLocal = sessionmaker(bind=_engine, autoflush=False, autocommit=False, future=True)

def get_session():
    return SessionLocal()
```

---

## Earthquake Service

`api/services/earthquake_service.py`

```python
from typing import List, Dict, Any
from contextlib import contextmanager
from api.services.database import get_session
from api.models.earthquake import Earthquake

@contextmanager
def _session_scope():
    session = get_session()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()

def get_earthquakes() -> List[Dict[str, Any]]:
    with _session_scope() as session:
        rows = session.query(Earthquake).order_by(Earthquake.id.desc()).all()
        return [
            {
                "id": r.id,
                "geo_id": r.geo_id,
                "title": r.title,
                "image": r.image,
                "description": r.description,
            }
            for r in rows
        ]
```

---

## Controller

`api/controllers/earthquakes_controller.py`

```python
from typing import List, Dict, Any
from fastapi import APIRouter
from api.services.earthquake_service import get_earthquakes

router = APIRouter()

@router.get("/earthquakes", response_model=List[Dict[str, Any]])
def list_earthquakes() -> List[Dict[str, Any]]:
    return get_earthquakes()
```

---

## QA Checklist

* Service backed by database.
* Controller returns `List[Dict[str, Any]]` instead of Pydantic model.
* Removed unused imports in controller.
* API contract preserved.

---

# 🔧 Fix Applied

* ✅ **api/controllers/earthquakes\_controller.py** – Changed return type from `List[Earthquake]` to `List[Dict[str, Any]]`
* ✅ Removed unused import (Pydantic `Earthquake` model no longer needed)
* ✅ Maintained functionality (still delegates to the service layer)

---

Would you like me to also include a **migration script** under `db/` so that Cursor sets up the `earthquakes` table automatically, or should we assume the table already exists from your earlier migration step?
