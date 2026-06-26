from pydantic import BaseModel

class OrderBase(BaseModel):
    user_id: int
    total: float
    status: str = "pending"

class OrderCreate(OrderBase):
    pass

class OrderResponse(OrderBase):
    id: int

    class Config:
        from_attributes = True
