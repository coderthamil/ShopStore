from sqlalchemy import Column, Integer, String, Float, Boolean
from app.database.database import Base

class Promo(Base):
    __tablename__ = "promos"   # ✅ plural for consistency

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    discount = Column(Float)   # percentage or flat value
    active = Column(Boolean, default=True)
