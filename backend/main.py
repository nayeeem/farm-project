from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import farmers, tasks, items, assets, reports, lands, crops
from .database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Farm Management API")

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
