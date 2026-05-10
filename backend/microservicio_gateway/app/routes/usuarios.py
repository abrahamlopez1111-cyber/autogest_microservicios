from fastapi import APIRouter, HTTPException, Request
import httpx

from app.config import SERVICIOS

router = APIRouter(
    tags=["Gateway Usuarios"]
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
            raise HTTPException(
                status_code=response.status_code,
                detail="Microservicio usuarios temporalmente no disponible"
            )

        # Validar JSON
        content_type = response.headers.get(
            "content-type", ""
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

        return response.json()

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

        return response.json()

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

        return response.json()

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

        return response.json()

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
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SERVICIOS['usuarios']}/mecanicos"
            )

        return response.json()

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

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )