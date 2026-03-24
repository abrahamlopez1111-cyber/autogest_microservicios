from fastapi import FastAPI # type: ignore
from app.routes import historial

app = FastAPI(
    title="Microservicio de Historial de Vehículos y Clientes",
    description="Gestiona vehículos, clientes y su historial de servicios",
    version="1.0.0"
)

# Incluir rutas
app.include_router(historial.router)

# Endpoint raíz
@app.get("/")
def root():
    return {
        "mensaje": "Microservicio de Historial funcionando correctamente 🚗"
    }