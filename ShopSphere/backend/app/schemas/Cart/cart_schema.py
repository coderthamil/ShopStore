from pydantic import BaseModel

class CartItem(BaseModel):
    user_id: int
    product_id: int
    quantity: int

class CartResponse(CartItem):
    id: int

    class Config:
        from_attributes = True
