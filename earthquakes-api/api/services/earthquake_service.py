"""Business services for earthquake operations."""
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
    """
    Returns list of earthquakes from DB, shaped for controller response.
    Controller MUST NOT change; keep the contract identical to previous return format.
    """
    with _session_scope() as session:
        rows = session.query(Earthquake).order_by(Earthquake.id.desc()).all()
        # Map ORM rows into plain dicts the controller already expects:
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


