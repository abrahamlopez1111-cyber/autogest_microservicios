from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import Response
import httpx

from app.config import SERVICIOS

router = APIRouter(
    tags=["Gateway Facturación"]
)


# =========================
# GENERAR FACTURA
# =========================
@router.post("/facturas/{cita_id}")
async def generar_factura(cita_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SERVICIOS['facturacion']}/facturas/{cita_id}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# LISTAR FACTURAS
# =========================
@router.get("/facturas")
async def listar_facturas():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['facturacion']}/facturas"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# FACTURAS DEL CLIENTE
# =========================
@router.get("/facturas/cliente/{cliente_id}")
async def facturas_cliente(cliente_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['facturacion']}/facturas/cliente/{cliente_id}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# VISTA PREVIA
# =========================
@router.get("/facturas/preview/{cita_id}")
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


# =========================
# REGISTRAR PAGO
# =========================
@router.post("/pagos")
async def registrar_pago(request: Request):
    try:
        body = await request.json()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SERVICIOS['facturacion']}/pagos",
                json=body
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# DESCARGAR PDF
# =========================
@router.get("/facturas/{factura_id}/pdf")
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

# =========================
# FACTURA POR ID
# =========================
@router.get("/facturas/{factura_id}")
async def obtener_factura(factura_id: int):
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{SERVICIOS['facturacion']}/facturas/{factura_id}"
            )
        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))