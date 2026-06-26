from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.Promos.promo_model import  Promo
from app.schemas.Promos.promo_schema import PromoCreate, PromoResponse

router = APIRouter()

@router.post("/", response_model=PromoResponse)
def create_promo(promo: PromoCreate, db: Session = Depends(get_db)):
    db_promo = Promo(**promo.dict())
    db.add(db_promo)
    db.commit()
    db.refresh(db_promo)
    return db_promo

@router.get("/{id}", response_model=PromoResponse)
def get_promo(id: int, db: Session = Depends(get_db)):
    promo = db.query(Promo).filter(Promo.id == id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promo not found")
    return promo

@router.get("/", response_model=list[PromoResponse])
def list_promos(db: Session = Depends(get_db)):
    return db.query(Promo).all()

@router.put("/{id}", response_model=PromoResponse)
def update_promo(id: int, promo: PromoCreate, db: Session = Depends(get_db)):
    db_promo = db.query(Promo).filter(Promo.id == id).first()
    if not db_promo:
        raise HTTPException(status_code=404, detail="Promo not found")
    for key, value in promo.dict().items():
        setattr(db_promo, key, value)
    db.commit()
    db.refresh(db_promo)
    return db_promo

@router.delete("/{id}")
def delete_promo(id: int, db: Session = Depends(get_db)):
    promo = db.query(Promo).filter(Promo.id == id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promo not found")
    db.delete(promo)
    db.commit()
    return {"detail": "Promo deleted"}
