from pydantic import BaseModel

class ProductBase(BaseModel):
    seller_id: int
    name: str
    price: float
    stock: int

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True
