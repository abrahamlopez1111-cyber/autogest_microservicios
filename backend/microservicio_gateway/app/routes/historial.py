from fastapi import APIRouter, HTTPException
import httpx

from app.config import SERVICIOS

router = APIRouter(
    prefix="/historial",
    tags=["Gateway Historial"]
)


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