from fastapi import APIRouter, HTTPException, Request
import httpx

from app.config import SERVICIOS

router = APIRouter(
    tags=["Gateway Diagnóstico"]
)


# =========================
# CREAR DIAGNÓSTICO
# =========================
@router.post("/diagnosticos")
async def crear_diagnostico(request: Request):
    try:
        body = await request.json()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SERVICIOS['diagnostico']}/diagnosticos/",
                json=body
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# LISTAR DIAGNÓSTICOS
# =========================
@router.get("/diagnosticos")
async def listar_diagnosticos():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['diagnostico']}/diagnosticos/"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# DIAGNÓSTICO POR CITA
# =========================
@router.get("/diagnosticos/cita/{cita_id}")
async def obtener_diagnostico(cita_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['diagnostico']}/diagnosticos/cita/{cita_id}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )