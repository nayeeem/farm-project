from sqlalchemy.orm import Session
from . import models, schemas
import datetime

# Farmer CRUD
def get_farmer(db: Session, farmer_id: int):
    return db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()

def get_farmers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Farmer).offset(skip).limit(limit).all()

def create_farmer(db: Session, farmer: schemas.FarmerCreate):
    db_farmer = models.Farmer(**farmer.model_dump())
    db.add(db_farmer)
    db.commit()
    db.refresh(db_farmer)
    return db_farmer

def update_farmer(db: Session, farmer_id: int, farmer: schemas.FarmerCreate):
    db_farmer = get_farmer(db, farmer_id)
    if db_farmer:
        for key, value in farmer.model_dump().items():
            setattr(db_farmer, key, value)
        db.commit()
        db.refresh(db_farmer)
    return db_farmer

def delete_farmer(db: Session, farmer_id: int):
    db_farmer = get_farmer(db, farmer_id)
    if db_farmer:
        db.delete(db_farmer)
        db.commit()
    return db_farmer

# Task CRUD
def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Task).offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task: schemas.TaskBase): # Using TaskBase for update to allow partial updates if needed, but here simple
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task:
        for key, value in task.model_dump(exclude_unset=True).items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task

# Item CRUD
def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Item).offset(skip).limit(limit).all()

def create_item(db: Session, item: schemas.ItemCreate):
    db_item = models.Item(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, item_id: int, item: schemas.ItemCreate):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item:
        for key, value in item.model_dump().items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_item(db: Session, item_id: int):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item

# Transaction CRUD
def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    # Calculate total price
    total_price = transaction.quantity * transaction.price_per_unit
    db_transaction = models.Transaction(**transaction.model_dump(), total_price=total_price)
    
    # Update item quantity
    db_item = db.query(models.Item).filter(models.Item.id == transaction.item_id).first()
    if db_item:
        if transaction.type == "buy":
            db_item.quantity += transaction.quantity
        elif transaction.type == "sell":
            db_item.quantity -= transaction.quantity
    
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_transactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Transaction).offset(skip).limit(limit).all()

# Asset CRUD
def get_assets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Asset).offset(skip).limit(limit).all()

def create_asset(db: Session, asset: schemas.AssetCreate):
    db_asset = models.Asset(**asset.model_dump())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def delete_asset(db: Session, asset_id: int):
    db_asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if db_asset:
        db.delete(db_asset)
        db.commit()
    return db_asset

# Land CRUD
def get_lands(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Land).offset(skip).limit(limit).all()

def get_land(db: Session, land_id: int):
    return db.query(models.Land).filter(models.Land.id == land_id).first()

def create_land(db: Session, land: schemas.LandCreate):
    db_land = models.Land(**land.model_dump())
    db.add(db_land)
    db.commit()
    db.refresh(db_land)
    return db_land

def update_land(db: Session, land_id: int, land: schemas.LandUpdate):
    db_land = get_land(db, land_id)
    if db_land:
        for key, value in land.model_dump(exclude_unset=True).items():
            setattr(db_land, key, value)
        db.commit()
        db.refresh(db_land)
    return db_land

def delete_land(db: Session, land_id: int):
    db_land = get_land(db, land_id)
    if db_land:
        db.delete(db_land)
        db.commit()
    return db_land

def assign_land_to_farmer(db: Session, land_id: int, farmer_id: int):
    db_land = get_land(db, land_id)
    if db_land:
        db_land.farmer_id = farmer_id
        db.commit()
        db.refresh(db_land)
    return db_land

# Crop CRUD
def get_crops(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Crop).offset(skip).limit(limit).all()

def get_crop(db: Session, crop_id: int):
    return db.query(models.Crop).filter(models.Crop.id == crop_id).first()

def get_crops_by_land(db: Session, land_id: int):
    return db.query(models.Crop).filter(models.Crop.land_id == land_id).all()

def create_crop(db: Session, crop: schemas.CropCreate):
    db_crop = models.Crop(**crop.model_dump())
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop

def update_crop(db: Session, crop_id: int, crop: schemas.CropUpdate):
    db_crop = get_crop(db, crop_id)
    if db_crop:
        for key, value in crop.model_dump(exclude_unset=True).items():
            setattr(db_crop, key, value)
        db.commit()
        db.refresh(db_crop)
    return db_crop

def delete_crop(db: Session, crop_id: int):
    db_crop = get_crop(db, crop_id)
    if db_crop:
        db.delete(db_crop)
        db.commit()
    return db_crop
