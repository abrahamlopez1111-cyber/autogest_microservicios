from fastapi import APIRouter, HTTPException, Request
import httpx

from app.config import SERVICIOS

router = APIRouter(
    tags=["Gateway Inventario"]
)


# =========================
# LISTAR INVENTARIO COMPLETO
# =========================
@router.get("/inventario/repuestos/inventario-completo")
async def inventario_completo():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['inventario']}/inventario/repuestos/inventario-completo"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# LISTAR REPUESTOS
# =========================
@router.get("/inventario/repuestos")
async def listar_repuestos():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['inventario']}/inventario/repuestos/"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# CREAR REPUESTO
# =========================
@router.post("/inventario/repuestos/")
async def crear_repuesto(request: Request):
    try:
        body = await request.json()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SERVICIOS['inventario']}/inventario/repuestos/",
                json=body
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return response.json()

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# CREAR STOCK
# =========================
@router.post("/inventario/repuestos/stock")
async def crear_stock(request: Request):
    try:
        body = await request.json()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SERVICIOS['inventario']}/inventario/repuestos/stock",
                json=body
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return response.json()

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# REPUESTO POR ID
# =========================
@router.get("/repuestos/{repuesto_id}")
async def obtener_repuesto(repuesto_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['inventario']}/inventario/repuestos/{repuesto_id}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )