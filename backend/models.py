from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class Farmer(Base):
    __tablename__ = "farmers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String)
    address = Column(String)
    
    tasks = relationship("Task", back_populates="farmer")
    lands = relationship("Land", back_populates="farmer")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    status = Column(String, default="Pending") # Pending, Completed
    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    
    farmer = relationship("Farmer", back_populates="tasks")

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String) # crop, input (seed, fertilizer)
    quantity = Column(Integer, default=0)
    price = Column(Float, default=0.0)

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    type = Column(String) # buy, sell
    quantity = Column(Integer)
    price_per_unit = Column(Float)
    total_price = Column(Float)
    buyer_name = Column(String, nullable=True) # For sells
    date = Column(DateTime, default=datetime.datetime.utcnow)
    
    item = relationship("Item")

class Asset(Base):
    __tablename__ = "assets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String) # machinery, land, etc.
    value = Column(Float)
    purchase_date = Column(DateTime, default=datetime.datetime.utcnow)

class Land(Base):
    __tablename__ = "lands"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    size = Column(Float)  # in acres or hectares
    soil_type = Column(String, nullable=True)
    tax_amount = Column(Float, default=0.0)  # Annual tax amount
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=True)
    
    farmer = relationship("Farmer", back_populates="lands")
    crops = relationship("Crop", back_populates="land")

class Crop(Base):
    __tablename__ = "crops"
    id = Column(Integer, primary_key=True, index=True)
    land_id = Column(Integer, ForeignKey("lands.id"))
    crop_name = Column(String, index=True)
    variety = Column(String, nullable=True)
    planting_date = Column(DateTime)
    expected_harvest_date = Column(DateTime)
    actual_harvest_date = Column(DateTime, nullable=True)
    status = Column(String, default="Planned")  # Planned, Growing, Harvested
    expected_yield = Column(Float, nullable=True)  # in kg or tons
    actual_yield = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
    
    land = relationship("Land", back_populates="crops")
