from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
import httpx

from app.config import SERVICIOS

router = APIRouter(
    prefix="/facturas",
    tags=["Gateway Facturación"]
)


# Vista previa
@router.get("/preview/{cita_id}")
async def preview_factura(cita_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['facturacion']}/facturas/preview/{cita_id}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# Descargar PDF
@router.get("/{factura_id}/pdf")
async def descargar_pdf(factura_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['facturacion']}/facturas/{factura_id}/pdf"
            )

        return Response(
            content=response.content,
            media_type="application/pdf"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )