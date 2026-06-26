"""init tables

Revision ID: 0a376f96ad00
Revises: 44c5774f01e8
Create Date: 2026-06-26 13:10:42.778090

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0a376f96ad00'
down_revision: Union[str, None] = '44c5774f01e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
