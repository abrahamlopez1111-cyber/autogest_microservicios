from fastapi import FastAPI
from .routes import inventario

app = FastAPI(title="Microservicio de Repuestos")

app.include_router(inventario.router)