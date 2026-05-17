from fastapi import FastAPI
import httpx
import os
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


@app.get("/debug/inventario")
async def debug_inventario():
    inventario_url = os.getenv("INVENTARIO_URL", "NO CONFIGURADO")
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
                r = await client.get(url)
                resultados[url] = {"status": r.status_code, "ok": r.status_code < 400}
            except Exception as e:
                resultados[url] = {"status": "ERROR", "detalle": str(e)}
    return {
        "INVENTARIO_URL": inventario_url,
        "pruebas": resultados
<<<<<<< HEAD
    }
=======
    }
>>>>>>> df580f8457edeceeaa276a8caa7381d30e2611ac
