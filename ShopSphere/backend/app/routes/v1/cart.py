from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.Cart.cart_model import Cart
from app.models.User.user_models import User
from app.models.Products.products_model import Product
from app.schemas.Cart.cart_schema import CartItem, CartResponse

router = APIRouter()

@router.post("/", response_model=CartResponse)
def add_to_cart(item: CartItem, db: Session = Depends(get_db)):
    db_cart = Cart(**item.dict())
    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)
    return db_cart

@router.get("/{id}", response_model=CartResponse)
def get_cart_item(id: int, db: Session = Depends(get_db)):
    cart_item = db.query(Cart).filter(Cart.id == id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return cart_item

@router.get("/", response_model=list[CartResponse])
def list_cart_items(db: Session = Depends(get_db)):
    return db.query(Cart).all()

@router.put("/{id}", response_model=CartResponse)
def update_cart_item(id: int, item: CartItem, db: Session = Depends(get_db)):
    db_cart = db.query(Cart).filter(Cart.id == id).first()
    if not db_cart:
        raise HTTPException(status_code=404, detail="Cart item not found")
    for key, value in item.dict().items():
        setattr(db_cart, key, value)
    db.commit()
    db.refresh(db_cart)
    return db_cart

@router.delete("/{id}")
def delete_cart_item(id: int, db: Session = Depends(get_db)):
    cart_item = db.query(Cart).filter(Cart.id == id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(cart_item)
    db.commit()
    return {"detail": "Cart item deleted"}
