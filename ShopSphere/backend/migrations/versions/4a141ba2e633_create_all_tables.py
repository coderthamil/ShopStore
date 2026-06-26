"""create_all_tables

Revision ID: 4a141ba2e633
Revises: f9a06f1e1ce4
Create Date: 2026-06-26 15:01:48.280654

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4a141ba2e633'
down_revision: Union[str, None] = 'f9a06f1e1ce4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
