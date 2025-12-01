from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models
from ..database import SessionLocal

router = APIRouter(
    prefix="/reports",
    tags=["reports"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/summary")
def get_summary_report(db: Session = Depends(get_db)):
    """Get overall summary statistics"""
    
    # Farmer stats
    total_farmers = db.query(func.count(models.Farmer.id)).scalar()
    
    # Task stats
    total_tasks = db.query(func.count(models.Task.id)).scalar()
    pending_tasks = db.query(func.count(models.Task.id)).filter(models.Task.status == "Pending").scalar()
    completed_tasks = db.query(func.count(models.Task.id)).filter(models.Task.status == "Completed").scalar()
    
    # Item stats
    total_items = db.query(func.count(models.Item.id)).scalar()
    total_inventory_value = db.query(func.sum(models.Item.quantity * models.Item.price)).scalar() or 0
    
    # Transaction stats
    total_transactions = db.query(func.count(models.Transaction.id)).scalar()
    total_purchases = db.query(func.count(models.Transaction.id)).filter(models.Transaction.type == "buy").scalar()
    total_sales = db.query(func.count(models.Transaction.id)).filter(models.Transaction.type == "sell").scalar()
    
    total_purchase_amount = db.query(func.sum(models.Transaction.total_price)).filter(
        models.Transaction.type == "buy"
    ).scalar() or 0
    
    total_sales_amount = db.query(func.sum(models.Transaction.total_price)).filter(
        models.Transaction.type == "sell"
    ).scalar() or 0
    
    # Asset stats
    total_assets = db.query(func.count(models.Asset.id)).scalar()
    total_asset_value = db.query(func.sum(models.Asset.value)).scalar() or 0
    
    return {
        "farmers": {
            "total": total_farmers
        },
        "tasks": {
            "total": total_tasks,
            "pending": pending_tasks,
            "completed": completed_tasks,
            "in_progress": total_tasks - pending_tasks - completed_tasks
        },
        "items": {
            "total": total_items,
            "inventory_value": round(total_inventory_value, 2)
        },
        "transactions": {
            "total": total_transactions,
            "purchases": total_purchases,
            "sales": total_sales,
            "total_purchase_amount": round(total_purchase_amount, 2),
            "total_sales_amount": round(total_sales_amount, 2),
            "net_profit": round(total_sales_amount - total_purchase_amount, 2)
        },
        "assets": {
            "total": total_assets,
            "total_value": round(total_asset_value, 2)
        }
    }

@router.get("/farmers")
def get_farmer_report(db: Session = Depends(get_db)):
    """Get detailed farmer report with task counts"""
    farmers = db.query(models.Farmer).all()
    
    farmer_data = []
    for farmer in farmers:
        task_count = db.query(func.count(models.Task.id)).filter(
            models.Task.farmer_id == farmer.id
        ).scalar()
        
        completed_tasks = db.query(func.count(models.Task.id)).filter(
            models.Task.farmer_id == farmer.id,
            models.Task.status == "Completed"
        ).scalar()
        
        farmer_data.append({
            "id": farmer.id,
            "name": farmer.name,
            "phone": farmer.phone,
            "address": farmer.address,
            "total_tasks": task_count,
            "completed_tasks": completed_tasks,
            "pending_tasks": task_count - completed_tasks
        })
    
    return farmer_data

@router.get("/items")
def get_item_report(db: Session = Depends(get_db)):
    """Get detailed item report with transaction history"""
    items = db.query(models.Item).all()
    
    item_data = []
    for item in items:
        buy_count = db.query(func.count(models.Transaction.id)).filter(
            models.Transaction.item_id == item.id,
            models.Transaction.type == "buy"
        ).scalar()
        
        sell_count = db.query(func.count(models.Transaction.id)).filter(
            models.Transaction.item_id == item.id,
            models.Transaction.type == "sell"
        ).scalar()
        
        total_bought = db.query(func.sum(models.Transaction.quantity)).filter(
            models.Transaction.item_id == item.id,
            models.Transaction.type == "buy"
        ).scalar() or 0
        
        total_sold = db.query(func.sum(models.Transaction.quantity)).filter(
            models.Transaction.item_id == item.id,
            models.Transaction.type == "sell"
        ).scalar() or 0
        
        item_data.append({
            "id": item.id,
            "name": item.name,
            "type": item.type,
            "current_quantity": item.quantity,
            "price_per_unit": item.price,
            "inventory_value": round(item.quantity * item.price, 2),
            "total_bought": total_bought,
            "total_sold": total_sold,
            "buy_transactions": buy_count,
            "sell_transactions": sell_count
        })
    
    return item_data

@router.get("/transactions/summary")
def get_transaction_summary(db: Session = Depends(get_db)):
    """Get transaction summary by type"""
    
    # Buy transactions summary
    buy_summary = db.query(
        func.count(models.Transaction.id).label('count'),
        func.sum(models.Transaction.quantity).label('total_quantity'),
        func.sum(models.Transaction.total_price).label('total_amount')
    ).filter(models.Transaction.type == "buy").first()
    
    # Sell transactions summary
    sell_summary = db.query(
        func.count(models.Transaction.id).label('count'),
        func.sum(models.Transaction.quantity).label('total_quantity'),
        func.sum(models.Transaction.total_price).label('total_amount')
    ).filter(models.Transaction.type == "sell").first()
    
    return {
        "buy": {
            "transaction_count": buy_summary.count or 0,
            "total_quantity": buy_summary.total_quantity or 0,
            "total_amount": round(buy_summary.total_amount or 0, 2)
        },
        "sell": {
            "transaction_count": sell_summary.count or 0,
            "total_quantity": sell_summary.total_quantity or 0,
            "total_amount": round(sell_summary.total_amount or 0, 2)
        },
        "profit": round((sell_summary.total_amount or 0) - (buy_summary.total_amount or 0), 2)
    }
