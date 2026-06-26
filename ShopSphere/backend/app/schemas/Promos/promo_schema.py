from pydantic import BaseModel

class PromoBase(BaseModel):
    code: str
    discount: float
    active: bool = True

class PromoCreate(PromoBase):
    pass

class PromoResponse(PromoBase):
    id: int

    class Config:
        from_attributes = True
