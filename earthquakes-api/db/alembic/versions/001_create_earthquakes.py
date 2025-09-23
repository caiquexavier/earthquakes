"""Create earthquakes table

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create earthquakes table
    op.create_table("earthquakes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("geo_id", sa.String(length=64), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("image", sa.Text(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("geo_id")
    )
    
    # Create indexes
    op.create_index("idx_earthquakes_geo_id", "earthquakes", ["geo_id"])
    op.create_index("idx_earthquakes_title", "earthquakes", ["title"])


def downgrade() -> None:
    # Drop indexes
    op.drop_index("idx_earthquakes_title", table_name="earthquakes")
    op.drop_index("idx_earthquakes_geo_id", table_name="earthquakes")
    
    # Drop table
    op.drop_table("earthquakes")
