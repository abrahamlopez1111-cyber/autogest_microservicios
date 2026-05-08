from fastapi import APIRouter, HTTPException
import httpx

from app.config import SERVICIOS

router = APIRouter(
    tags=["Gateway Citas"]
)


# =========================
# LISTAR CITAS
# =========================
@router.get("/citas")
async def listar_citas():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['citas']}/citas"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# OBTENER CITA
# =========================
@router.get("/citas/{cita_id}")
async def obtener_cita(cita_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['citas']}/citas/{cita_id}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# CITAS POR SUCURSAL
# =========================
@router.get("/citas/sucursal/{sucursal_id}")
async def citas_por_sucursal(sucursal_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['citas']}/citas/sucursal/{sucursal_id}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# SUCURSALES
# =========================
@router.get("/sucursales")
async def listar_sucursales():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['citas']}/sucursales"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# MECÁNICOS DE CITAS
# =========================
@router.get("/mecanicos-citas")
async def listar_mecanicos_citas():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['citas']}/mecanicos"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# RECEPCIONISTAS
# =========================
@router.get("/recepcionistas-citas")
async def listar_recepcionistas_citas():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['citas']}/recepcionistas"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )