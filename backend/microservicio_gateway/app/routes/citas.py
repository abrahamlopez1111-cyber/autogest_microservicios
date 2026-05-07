from fastapi import APIRouter, HTTPException
import httpx

from app.config import SERVICIOS

router = APIRouter(prefix="/citas", tags=["Gateway Citas"])


@router.get("/{cita_id}")
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