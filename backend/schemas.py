from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Farmer Schemas
class FarmerBase(BaseModel):
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None

class FarmerCreate(FarmerBase):
    pass

class Farmer(FarmerBase):
    id: int
    class Config:
        from_attributes = True

# Task Schemas
class TaskBase(BaseModel):
    description: str
    status: Optional[str] = "Pending"

class TaskCreate(TaskBase):
    farmer_id: int

class Task(TaskBase):
    id: int
    farmer_id: int
    class Config:
        from_attributes = True

# Item Schemas
class ItemBase(BaseModel):
    name: str
    type: str
    quantity: int = 0
    price: float = 0.0

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    item_id: int
    type: str
    quantity: int
    price_per_unit: float
    buyer_name: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    total_price: float
    date: datetime
    class Config:
        from_attributes = True

# Asset Schemas
class AssetBase(BaseModel):
    name: str
    type: str
    value: float

class AssetCreate(AssetBase):
    pass

class Asset(AssetBase):
    id: int
    purchase_date: datetime
    class Config:
        from_attributes = True

# Land Schemas
class LandBase(BaseModel):
    name: str
    location: str
    size: float
    soil_type: Optional[str] = None
    tax_amount: Optional[float] = 0.0

class LandCreate(LandBase):
    farmer_id: Optional[int] = None

class LandUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    size: Optional[float] = None
    soil_type: Optional[str] = None
    tax_amount: Optional[float] = None
    farmer_id: Optional[int] = None

class Land(LandBase):
    id: int
    farmer_id: Optional[int] = None
    class Config:
        from_attributes = True

# Crop Schemas
class CropBase(BaseModel):
    crop_name: str
    variety: Optional[str] = None
    planting_date: datetime
    expected_harvest_date: datetime
    expected_yield: Optional[float] = None
    notes: Optional[str] = None

class CropCreate(CropBase):
    land_id: int

class CropUpdate(BaseModel):
    crop_name: Optional[str] = None
    variety: Optional[str] = None
    planting_date: Optional[datetime] = None
    expected_harvest_date: Optional[datetime] = None
    actual_harvest_date: Optional[datetime] = None
    status: Optional[str] = None
    expected_yield: Optional[float] = None
    actual_yield: Optional[float] = None
    notes: Optional[str] = None

class Crop(CropBase):
    id: int
    land_id: int
    actual_harvest_date: Optional[datetime] = None
    status: str
    actual_yield: Optional[float] = None
    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    username: str
    role: Optional[str] = "farmer"
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None
