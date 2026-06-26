from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database.database import Base
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default="buyer")  # admin, seller, buyer

    # Relationships
    products = relationship("Product", back_populates="seller")
    orders = relationship("Order", back_populates="user")
    carts = relationship("Cart", back_populates="user")
