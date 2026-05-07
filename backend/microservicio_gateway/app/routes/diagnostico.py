from fastapi import APIRouter, HTTPException
import httpx

from app.config import SERVICIOS

router = APIRouter(
    prefix="/diagnosticos",
    tags=["Gateway Diagnóstico"]
)


@router.get("/cita/{cita_id}")
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