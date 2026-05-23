from fastapi import APIRouter, HTTPException, Request
import httpx

from app.config import SERVICIOS

router = APIRouter(
    tags=["Gateway Usuarios"]
)


# =========================
# FUNCIÓN AUXILIAR
# =========================
def manejar_error_response(response):
    try:
        detail = response.json().get(
            "detail",
            response.text
        )
    except:
        detail = response.text

    raise HTTPException(
        status_code=response.status_code,
        detail=detail
    )


# =========================
# LOGIN
# =========================
@router.post("/login")
async def login(request: Request):
    try:
        body = await request.json()

        async with httpx.AsyncClient(
            timeout=30.0
        ) as client:

            response = await client.post(
                f"{SERVICIOS['usuarios']}/login",
                json=body
            )

        # Si usuarios respondió error
        if response.status_code >= 400:
            manejar_error_response(response)

        # Validar JSON
        content_type = response.headers.get(
            "content-type",
            ""
        )

        if "application/json" in content_type:
            return response.json()

        raise HTTPException(
            status_code=502,
            detail="Usuarios respondió con formato inválido"
        )

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Microservicio usuarios no disponible"
        )

    except httpx.ReadTimeout:
        raise HTTPException(
            status_code=504,
            detail="Tiempo de espera agotado en usuarios"
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gateway error: {str(e)}"
        )


# =========================
# PERFIL
# =========================
@router.get("/perfil/{usuario_id}")
async def obtener_perfil(usuario_id: int):
    try:

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['usuarios']}/perfil/{usuario_id}"
            )

        if response.status_code >= 400:
            manejar_error_response(response)

        return response.json()

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# CREAR PERFIL
# =========================
@router.post("/perfil/{usuario_id}")
async def crear_perfil(usuario_id: int, request: Request):
    try:

        body = await request.json()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SERVICIOS['usuarios']}/perfil/{usuario_id}",
                json=body
            )

        if response.status_code >= 400:
            manejar_error_response(response)

        return response.json()

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# ACTUALIZAR PERFIL
# =========================
@router.put("/perfil/{usuario_id}")
async def actualizar_perfil(usuario_id: int, request: Request):
    try:

        body = await request.json()

        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{SERVICIOS['usuarios']}/perfil/{usuario_id}",
                json=body
            )

        if response.status_code >= 400:
            manejar_error_response(response)

        return response.json()

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# LISTAR USUARIOS
# =========================
@router.get("/usuarios")
async def listar_usuarios():
    try:

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['usuarios']}/usuarios"
            )

        if response.status_code >= 400:
            manejar_error_response(response)

        return response.json()

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# USUARIO POR ID
# =========================
@router.get("/usuarios/{usuario_id}")
async def obtener_usuario(usuario_id: int):
    try:

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['usuarios']}/usuarios/{usuario_id}"
            )

        if response.status_code >= 400:
            manejar_error_response(response)

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

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['usuarios']}/recepcionistas"
            )

        if response.status_code >= 400:
            manejar_error_response(response)

        return response.json()

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# VALIDAR MECÁNICO
# =========================
@router.get("/mecanicos/{usuario_id}")
async def validar_mecanico(usuario_id: int):
    try:

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['usuarios']}/usuarios/{usuario_id}/es-mecanico"
            )

        if response.status_code >= 400:
            manejar_error_response(response)

        return response.json()

    except HTTPException:
        raise

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

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['usuarios']}/mecanicos"
            )

        if response.status_code >= 400:
            manejar_error_response(response)

        return response.json()

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# CREAR USUARIO
# =========================
@router.post("/usuarios")
async def crear_usuario(request: Request):
    try:

        body = await request.json()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SERVICIOS['usuarios']}/usuarios",
                json=body
            )

        if response.status_code >= 400:
            manejar_error_response(response)

        return response.json()

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# EDITAR USUARIO
# =========================
@router.put("/usuarios/{usuario_id}")
async def actualizar_usuario(
    usuario_id: int,
    request: Request
):
    try:

        body = await request.json()

        async with httpx.AsyncClient(
            timeout=15.0
        ) as client:

            response = await client.put(
                f"{SERVICIOS['usuarios']}/usuarios/{usuario_id}",
                json=body
            )

        if response.status_code >= 400:
            manejar_error_response(response)

        return response.json()

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# ELIMINAR USUARIO
# =========================
@router.delete("/usuarios/{usuario_id}")
async def eliminar_usuario(usuario_id: int):
    try:

        async with httpx.AsyncClient(
            timeout=15.0
        ) as client:

            response = await client.delete(
                f"{SERVICIOS['usuarios']}/usuarios/{usuario_id}"
            )

        if response.status_code >= 400:
            manejar_error_response(response)

        return response.json()

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )