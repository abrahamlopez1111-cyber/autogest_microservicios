from fastapi import APIRouter, HTTPException, Request
import httpx

from app.config import SERVICIOS

router = APIRouter(
    tags=["Gateway Inventario"]
)

# El microservicio de inventario tiene prefix /inventario en main.py
# y el router tiene prefix /repuestos
# Ruta real del microservicio: /inventario/repuestos/<endpoint>
# INVENTARIO_URL = raiz del microservicio (ej: https://autogest-inventario.onrender.com)

def inv_url(path: str) -> str:
    return f"{SERVICIOS['inventario']}/inventario/repuestos{path}"


# =========================
# LISTAR INVENTARIO COMPLETO
# =========================
@router.get("/inventario/repuestos/inventario-completo")
async def inventario_completo():
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(inv_url("/inventario-completo"))

        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error conectando con inventario: {str(e)}")


# =========================
# LISTAR REPUESTOS
# =========================
@router.get("/inventario/repuestos")
async def listar_repuestos():
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(inv_url("/"))

        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# CREAR REPUESTO
# =========================
@router.post("/inventario/repuestos/")
async def crear_repuesto(request: Request):
    try:
        body = await request.json()

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(inv_url("/"), json=body)

        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# CREAR STOCK
# =========================
@router.post("/inventario/repuestos/stock")
async def crear_stock(request: Request):
    try:
        body = await request.json()

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(inv_url("/stock"), json=body)

        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# REPUESTO POR ID
# =========================
@router.get("/inventario/repuestos/{repuesto_id}")
async def obtener_repuesto(repuesto_id: int):
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(inv_url(f"/{repuesto_id}"))

        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# EDITAR REPUESTO
# =========================
@router.put("/inventario/repuestos/{repuesto_id}")
async def actualizar_repuesto(repuesto_id: int, request: Request):
    try:
        body = await request.json()
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.put(
                inv_url(f"/{repuesto_id}"),
                json=body
            )
        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ELIMINAR REPUESTO
# =========================
@router.delete("/inventario/repuestos/{repuesto_id}")
async def eliminar_repuesto(repuesto_id: int):
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.delete(inv_url(f"/{repuesto_id}"))
        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))