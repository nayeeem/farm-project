from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import farmers, tasks, items, assets, reports, lands, crops, auth, users
from .database import engine, Base, SessionLocal
from . import models, auth as auth_logic

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Farm Management API")

# Create initial admin user
def create_initial_admin():
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.username == "admin").first()
        if not user:
            hashed_password = auth_logic.get_password_hash("admin123")
            admin_user = models.User(username="admin", hashed_password=hashed_password, role="admin")
            db.add(admin_user)
            db.commit()
            print("Created initial admin user")
    finally:
        db.close()

create_initial_admin()

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(farmers.router)
app.include_router(tasks.router)
app.include_router(items.router)
app.include_router(assets.router)
app.include_router(reports.router)
app.include_router(lands.router)
app.include_router(crops.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Farm Management API"}
