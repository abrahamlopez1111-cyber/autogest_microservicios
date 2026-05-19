from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import httpx
import os

from app.routes import (
    citas,
    usuarios,
    historial,
    inventario,
    diagnostico,
    facturacion
)

# =========================
# APP
# =========================

app = FastAPI(
    title="AUTOGEST Gateway"
)

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROUTERS
# =========================

app.include_router(citas.router)
app.include_router(usuarios.router)
app.include_router(historial.router)
app.include_router(inventario.router)
app.include_router(diagnostico.router)
app.include_router(facturacion.router)

# =========================
# ROOT
# =========================

@app.get("/")
def root():
    return {
        "mensaje": "Gateway AUTOGEST funcionando"
    }

# =========================
# DEBUG INVENTARIO
# =========================

@app.get("/debug/inventario")
async def debug_inventario():

    inventario_url = os.getenv(
        "INVENTARIO_URL",
        "NO CONFIGURADO"
    )

    rutas_a_probar = [
        f"{inventario_url}/inventario/repuestos/inventario-completo",
        f"{inventario_url}/inventario/repuestos/",
        f"{inventario_url}/repuestos/inventario-completo",
        f"{inventario_url}/",
    ]

    resultados = {}

    async with httpx.AsyncClient(timeout=10.0) as client:

        for url in rutas_a_probar:

            try:
                response = await client.get(url)

                resultados[url] = {
                    "status": response.status_code,
                    "ok": response.status_code < 400
                }

            except Exception as e:

                resultados[url] = {
                    "status": "ERROR",
                    "detalle": str(e)
                }

    return {
        "INVENTARIO_URL": inventario_url,
        "pruebas": resultados
    }