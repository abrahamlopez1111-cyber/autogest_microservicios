from fastapi import APIRouter, HTTPException, Request
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

# =========================
# CREAR VEHÍCULO
# =========================
@router.post("/vehiculos")
async def crear_vehiculo(request: Request):
    try:
        body = await request.json()
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"{SERVICIOS['historial']}/historial/vehiculos",
                json=body
            )
        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# HISTORIAL DE SERVICIOS POR VEHICULO
# =========================
@router.get("/vehiculos/{vehiculo_id}/servicios")
async def servicios_por_vehiculo(vehiculo_id: int):
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{SERVICIOS['historial']}/historial/vehiculos/{vehiculo_id}/servicios"
            )
        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# REGISTRAR SERVICIO
# =========================
@router.post("/servicios")
async def registrar_servicio(request: Request):
    try:
        body = await request.json()
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"{SERVICIOS['historial']}/historial/servicios",
                json=body
            )
        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))