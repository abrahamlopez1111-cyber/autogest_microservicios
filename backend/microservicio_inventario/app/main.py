from fastapi import FastAPI # type: ignore
from .routes import inventario

app = FastAPI(title="Microservicio de Repuestos")

app.include_router(inventario.router)