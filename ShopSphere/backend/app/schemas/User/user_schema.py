from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    role: str = "buyer"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True
