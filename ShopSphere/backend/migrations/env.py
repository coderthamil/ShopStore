from decouple import config
from sqlalchemy import engine_from_config, pool
from alembic import context
from app.database.database import Base

# Import all models explicitly so Alembic sees them
from app.models.User.user_models import User
from app.models.Products.products_model import Product
from app.models.Cart.cart_model import Cart
from app.models.Orders.order_model import Order
from app.models.Promos.promo_model import Promo

# Alembic needs this to autogenerate migrations
target_metadata = Base.metadata

# Load DATABASE_URL from .env
DATABASE_URL = config("DATABASE_URL")

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        {"sqlalchemy.url": DATABASE_URL},
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
