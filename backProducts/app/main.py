from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.product import router_product
from app.database.database import Base, engine

app = FastAPI()


allow_origins = [
    "http://localhost:3000",   # frontend en Docker
    "http://localhost:5173",  # desarrollo local (vite)
    "https://midominio.com",  # producción
]



app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router_product)

@app.get("/health")
def health_check():
    return {"status": "ok"}

Base.metadata.create_all(bind=engine)