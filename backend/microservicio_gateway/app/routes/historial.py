from fastapi import APIRouter, HTTPException
import httpx

from app.config import SERVICIOS

router = APIRouter(
    prefix="/historial",
    tags=["Gateway Historial"]
)


# =========================
# VEHÍCULO POR ID
# =========================
@router.get("/vehiculos/{vehiculo_id}")
async def obtener_vehiculo(vehiculo_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['historial']}/historial/vehiculos/{vehiculo_id}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# VEHÍCULOS POR USUARIO
# =========================
@router.get("/vehiculos/usuario/{usuario_id}")
async def obtener_vehiculos_usuario(usuario_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['historial']}/historial/vehiculos/usuario/{usuario_id}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# LISTAR VEHÍCULOS
# =========================
@router.get("/vehiculos")
async def listar_vehiculos():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['historial']}/historial/vehiculos"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )