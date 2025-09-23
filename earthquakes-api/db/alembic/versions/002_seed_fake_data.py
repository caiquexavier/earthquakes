"""Seed fake data

Revision ID: 002
Revises: 001
Create Date: 2024-01-01 00:01:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Insert sample earthquake data using raw SQL
    op.execute("""
        INSERT INTO earthquakes (geo_id, title, image, description) VALUES
        ('EQ_SEED_001', 'Magnitude 7.0 - Pacific Ocean', 'https://example.com/eq1.jpg', 'A powerful earthquake in the Pacific, no tsunami warning issued.'),
        ('EQ_SEED_002', 'Minor Tremor - California', 'https://example.com/eq2.jpg', 'A small earthquake near Los Angeles, widely felt but no damage.'),
        ('EQ_SEED_003', 'Deep Quake - Japan', 'https://example.com/eq3.jpg', 'A deep earthquake off the coast of Japan, minimal surface impact.')
        ON CONFLICT (geo_id) DO NOTHING;
    """)


def downgrade() -> None:
    # Remove sample data
    op.execute("""
        DELETE FROM earthquakes WHERE geo_id IN ('EQ_SEED_001', 'EQ_SEED_002', 'EQ_SEED_003');
    """)