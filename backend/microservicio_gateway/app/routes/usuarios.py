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

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SERVICIOS['usuarios']}/login",
                json=body
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
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