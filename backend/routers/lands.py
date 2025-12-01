from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import SessionLocal

router = APIRouter(
    prefix="/lands",
    tags=["lands"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Land)
def create_land(land: schemas.LandCreate, db: Session = Depends(get_db)):
    return crud.create_land(db=db, land=land)

@router.get("/", response_model=List[schemas.Land])
def read_lands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    lands = crud.get_lands(db, skip=skip, limit=limit)
    return lands

@router.get("/{land_id}", response_model=schemas.Land)
def read_land(land_id: int, db: Session = Depends(get_db)):
    db_land = crud.get_land(db, land_id=land_id)
    if db_land is None:
        raise HTTPException(status_code=404, detail="Land not found")
    return db_land

@router.put("/{land_id}", response_model=schemas.Land)
def update_land(land_id: int, land: schemas.LandUpdate, db: Session = Depends(get_db)):
    db_land = crud.update_land(db, land_id=land_id, land=land)
    if db_land is None:
        raise HTTPException(status_code=404, detail="Land not found")
    return db_land

@router.delete("/{land_id}", response_model=schemas.Land)
def delete_land(land_id: int, db: Session = Depends(get_db)):
    db_land = crud.delete_land(db, land_id=land_id)
    if db_land is None:
        raise HTTPException(status_code=404, detail="Land not found")
    return db_land

@router.put("/{land_id}/assign/{farmer_id}", response_model=schemas.Land)
def assign_land_to_farmer(land_id: int, farmer_id: int, db: Session = Depends(get_db)):
    """Assign a land to a farmer"""
    db_land = crud.assign_land_to_farmer(db, land_id=land_id, farmer_id=farmer_id)
    if db_land is None:
        raise HTTPException(status_code=404, detail="Land not found")
    return db_land
