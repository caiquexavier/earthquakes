"""Pydantic models for the earthquakes domain."""
from pydantic import BaseModel
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import String, Integer, Text

Base = declarative_base()


class Earthquake(Base):
    """SQLAlchemy model for earthquakes table."""
    __tablename__ = "earthquakes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    geo_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    image: Mapped[str] = mapped_column(String(1024), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)


class EarthquakeResponse(BaseModel):
    """Pydantic model for API responses."""

    id: int
    geo_id: str
    title: str
    image: str
    description: str


