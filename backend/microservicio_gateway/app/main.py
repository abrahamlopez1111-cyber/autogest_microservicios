from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    citas,
    usuarios,
    historial,
    inventario,
    diagnostico,
    facturacion
)

app = FastAPI(
    title="AUTOGEST Gateway"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(citas.router)
app.include_router(usuarios.router)
app.include_router(historial.router)
app.include_router(inventario.router)
app.include_router(diagnostico.router)
app.include_router(facturacion.router)


@app.get("/")
def root():
    return {
        "mensaje": "Gateway AUTOGEST funcionando"
    }