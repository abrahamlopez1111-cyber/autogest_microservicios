from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas


router = APIRouter(
    prefix="/perfil",
    tags=["Perfil"]
)


# =========================
# 📥 OBTENER PERFIL
# =========================
@router.get(
    "/{usuario_id}",
    response_model=schemas.PerfilOut
)
def obtener_perfil(
    usuario_id: int,
    db: Session = Depends(get_db)
):
    
    perfil = db.query(
        models.PerfilUsuario
    ).filter(
        models.PerfilUsuario.usuario_id == usuario_id
    ).first()

    if perfil is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil no encontrado"
        )

    return perfil


# =========================
# ➕ CREAR PERFIL
# =========================
@router.post(
    "/{usuario_id}",
    response_model=schemas.PerfilOut,
    status_code=status.HTTP_201_CREATED
)
def crear_perfil(
    usuario_id: int,
    datos: schemas.PerfilCreate,
    db: Session = Depends(get_db)
):

    # Validar que el usuario exista
    usuario = db.query(
        models.Usuario
    ).filter(
        models.Usuario.id_usuarios == usuario_id
    ).first()

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    # Verificar si ya existe perfil
    perfil_existente = db.query(
        models.PerfilUsuario
    ).filter(
        models.PerfilUsuario.usuario_id == usuario_id
    ).first()

    if perfil_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El perfil ya existe"
        )

    # Evitar guardar perfiles completamente vacíos
    datos_dict = datos.dict()

    if not any(datos_dict.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes guardar un perfil vacío"
        )

    nuevo_perfil = models.PerfilUsuario(
        usuario_id=usuario_id,
        **datos_dict
    )

    db.add(nuevo_perfil)
    db.commit()
    db.refresh(nuevo_perfil)

    return nuevo_perfil


# =========================
# 🔄 ACTUALIZAR PERFIL
# =========================
@router.put(
    "/{usuario_id}",
    response_model=schemas.PerfilOut
)
def actualizar_perfil(
    usuario_id: int,
    datos: schemas.PerfilCreate,
    db: Session = Depends(get_db)
):

    perfil = db.query(
        models.PerfilUsuario
    ).filter(
        models.PerfilUsuario.usuario_id == usuario_id
    ).first()

    if perfil is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil no encontrado"
        )

    datos_actualizar = datos.dict()

    # Evitar actualizar con todo vacío
    if not any(datos_actualizar.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes actualizar con datos vacíos"
        )

    # Actualizar campos
    for key, value in datos_actualizar.items():
        setattr(perfil, key, value)

    db.commit()
    db.refresh(perfil)

    return perfil