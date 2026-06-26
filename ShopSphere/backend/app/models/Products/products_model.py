from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)
    stock = Column(Integer)
    seller_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    seller = relationship("User", back_populates="products")
    carts = relationship("Cart", back_populates="product")
