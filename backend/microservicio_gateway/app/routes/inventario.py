from fastapi import APIRouter, HTTPException
import httpx

from app.config import SERVICIOS

router = APIRouter(
    prefix="/repuestos",
    tags=["Gateway Inventario"]
)


@router.get("/{repuesto_id}")
async def obtener_repuesto(repuesto_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['inventario']}/repuestos/{repuesto_id}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )