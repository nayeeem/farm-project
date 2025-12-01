from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from .. import crud, models, schemas
from ..database import SessionLocal

router = APIRouter(
    prefix="/crops",
    tags=["crops"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Crop)
def create_crop(crop: schemas.CropCreate, db: Session = Depends(get_db)):
    """Create a new crop planting record"""
    return crud.create_crop(db=db, crop=crop)

@router.get("/", response_model=List[schemas.Crop])
def read_crops(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all crops"""
    crops = crud.get_crops(db, skip=skip, limit=limit)
    return crops

@router.get("/land/{land_id}", response_model=List[schemas.Crop])
def read_crops_by_land(land_id: int, db: Session = Depends(get_db)):
    """Get all crops for a specific land"""
    crops = crud.get_crops_by_land(db, land_id=land_id)
    return crops

@router.get("/land/{land_id}/4months", response_model=List[schemas.Crop])
def read_crops_by_land_4months(land_id: int, db: Session = Depends(get_db)):
    """Get crops for a specific land for the next 4 months"""
    current_date = datetime.utcnow()
    four_months_later = current_date + timedelta(days=120)  # Approximately 4 months
    
    crops = db.query(models.Crop).filter(
        models.Crop.land_id == land_id,
        models.Crop.planting_date >= current_date,
        models.Crop.expected_harvest_date <= four_months_later
    ).all()
    
    return crops

@router.get("/{crop_id}", response_model=schemas.Crop)
def read_crop(crop_id: int, db: Session = Depends(get_db)):
    """Get detailed information about a specific crop"""
    db_crop = crud.get_crop(db, crop_id=crop_id)
    if db_crop is None:
        raise HTTPException(status_code=404, detail="Crop not found")
    return db_crop

@router.put("/{crop_id}", response_model=schemas.Crop)
def update_crop(crop_id: int, crop: schemas.CropUpdate, db: Session = Depends(get_db)):
    """Update crop information (e.g., mark as harvested, update yield)"""
    db_crop = crud.update_crop(db, crop_id=crop_id, crop=crop)
    if db_crop is None:
        raise HTTPException(status_code=404, detail="Crop not found")
    return db_crop

@router.delete("/{crop_id}", response_model=schemas.Crop)
def delete_crop(crop_id: int, db: Session = Depends(get_db)):
    """Delete a crop record"""
    db_crop = crud.delete_crop(db, crop_id=crop_id)
    if db_crop is None:
        raise HTTPException(status_code=404, detail="Crop not found")
    return db_crop
