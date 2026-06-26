"""fix cart-product relationship

Revision ID: f9a06f1e1ce4
Revises: b9877fca3604
Create Date: 2026-06-26 13:18:14.808346

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f9a06f1e1ce4'
down_revision: Union[str, None] = 'b9877fca3604'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
