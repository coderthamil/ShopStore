"""fix foreign keys

Revision ID: b9877fca3604
Revises: 0a376f96ad00
Create Date: 2026-06-26 13:13:04.390068

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b9877fca3604'
down_revision: Union[str, None] = '0a376f96ad00'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
