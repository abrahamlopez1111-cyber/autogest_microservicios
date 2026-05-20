from fastapi import APIRouter, HTTPException, Request
import httpx

from app.config import SERVICIOS

router = APIRouter(
    tags=["Gateway Citas"]
)

TIMEOUT = 15.0


# =========================
# LISTAR CITAS
# =========================
@router.get("/citas")
async def listar_citas():

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:

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
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:

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
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:

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
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:

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
# MECÁNICOS
# =========================
@router.get("/mecanicos")
async def listar_mecanicos():

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:

            response = await client.get(
                f"{SERVICIOS['citas']}/mecanicos"
            )

        return response.json()

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post("/mecanicos")
async def crear_mecanico(request: Request):

    try:
        body = await request.json()

        async with httpx.AsyncClient(timeout=TIMEOUT) as client:

            response = await client.post(
                f"{SERVICIOS['citas']}/mecanicos",
                json=body
            )

        if response.status_code >= 400:

            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return response.json()

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.delete("/mecanicos/{mecanico_id}")
async def eliminar_mecanico(mecanico_id: int):

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:

            response = await client.delete(
                f"{SERVICIOS['citas']}/mecanicos/{mecanico_id}"
            )

        if response.status_code >= 400:

            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return response.json()

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# RECEPCIONISTAS
# =========================
@router.get("/recepcionistas")
async def listar_recepcionistas():

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:

            response = await client.get(
                f"{SERVICIOS['citas']}/recepcionistas"
            )

        return response.json()

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post("/recepcionistas")
async def crear_recepcionista(request: Request):

    try:
        body = await request.json()

        async with httpx.AsyncClient(timeout=TIMEOUT) as client:

            response = await client.post(
                f"{SERVICIOS['citas']}/recepcionistas",
                json=body
            )

        if response.status_code >= 400:

            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return response.json()

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.delete("/recepcionistas/{recepcionista_id}")
async def eliminar_recepcionista(recepcionista_id: int):

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:

            response = await client.delete(
                f"{SERVICIOS['citas']}/recepcionistas/{recepcionista_id}"
            )

        if response.status_code >= 400:

            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return response.json()

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        
        
# =========================
# CREAR CITA
# =========================
@router.post("/citas")
async def crear_cita(request: Request):

    try:
        body = await request.json()

        async with httpx.AsyncClient(timeout=TIMEOUT) as client:

            response = await client.post(
                f"{SERVICIOS['citas']}/citas",
                json=body
            )

        if response.status_code >= 400:

            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return response.json()

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# DISPONIBILIDAD
# =========================
@router.get("/citas/disponibilidad/{mecanico_id}/{fecha}")
async def disponibilidad(
    mecanico_id: int,
    fecha: str
):

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:

            response = await client.get(
                f"{SERVICIOS['citas']}/citas/disponibilidad/{mecanico_id}/{fecha}"
            )

        if response.status_code >= 400:

            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return response.json()

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )