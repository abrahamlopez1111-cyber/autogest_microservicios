from fastapi import APIRouter, HTTPException
import httpx

from app.config import SERVICIOS

router = APIRouter(
    prefix="/usuarios",
    tags=["Gateway Usuarios"]
)


@router.get("/{usuario_id}")
async def obtener_usuario(usuario_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['usuarios']}/usuarios/{usuario_id}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )