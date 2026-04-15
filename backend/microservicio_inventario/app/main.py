from fastapi import FastAPI # type: ignore
from app.database import engine, Base
from app.routes import inventario

app = FastAPI(
    title="Microservicio Inventario",
    version="1.0"
)

# Crear tablas
Base.metadata.create_all(bind=engine)

# Rutas
app.include_router(inventario.router)

@app.get("/")
def root():
    return {"mensaje": "Microservicio Inventario funcionando"}