"""Database access service for connection and session management."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.core.config import getDATABASE_URL

# Engine is process-wide; echo=False to avoid noisy logs by default
_engine = create_engine(getDATABASE_URL(), pool_pre_ping=True, future=True)

SessionLocal = sessionmaker(bind=_engine, autoflush=False, autocommit=False, future=True)


def get_session():
    """
    Yields a SQLAlchemy session. Caller is responsible for closing it,
    preferably via context manager.
    """
    return SessionLocal()
