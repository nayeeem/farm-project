from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/farmers",
    tags=["farmers"],
    responses={404: {"description": "Not found"}},
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Farmer)
def create_farmer(farmer: schemas.FarmerCreate, db: Session = Depends(get_db)):
    return crud.create_farmer(db=db, farmer=farmer)

@router.get("/", response_model=List[schemas.Farmer])
def read_farmers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    farmers = crud.get_farmers(db, skip=skip, limit=limit)
    return farmers

@router.get("/{farmer_id}", response_model=schemas.Farmer)
def read_farmer(farmer_id: int, db: Session = Depends(get_db)):
    db_farmer = crud.get_farmer(db, farmer_id=farmer_id)
    if db_farmer is None:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return db_farmer

@router.put("/{farmer_id}", response_model=schemas.Farmer)
def update_farmer(farmer_id: int, farmer: schemas.FarmerCreate, db: Session = Depends(get_db)):
    db_farmer = crud.update_farmer(db, farmer_id=farmer_id, farmer=farmer)
    if db_farmer is None:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return db_farmer

@router.delete("/{farmer_id}", response_model=schemas.Farmer)
def delete_farmer(farmer_id: int, db: Session = Depends(get_db)):
    db_farmer = crud.delete_farmer(db, farmer_id=farmer_id)
    if db_farmer is None:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return db_farmer
