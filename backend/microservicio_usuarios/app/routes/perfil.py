from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/perfil", tags=["Perfil"])


# =========================
# 📥 OBTENER PERFIL
# =========================
@router.get("/{usuario_id}", response_model=schemas.PerfilOut)
def obtener_perfil(usuario_id: int, db: Session = Depends(get_db)):

    perfil = db.query(models.PerfilUsuario).filter(
        models.PerfilUsuario.usuario_id == usuario_id
    ).first()

    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")

    return perfil


# =========================
# ➕ CREAR PERFIL
# =========================
@router.post("/{usuario_id}", response_model=schemas.PerfilOut)
def crear_perfil(usuario_id: int, datos: schemas.PerfilCreate, db: Session = Depends(get_db)):

    existente = db.query(models.PerfilUsuario).filter(
        models.PerfilUsuario.usuario_id == usuario_id
    ).first()

    if existente:
        raise HTTPException(status_code=400, detail="El perfil ya existe")

    nuevo = models.PerfilUsuario(
        usuario_id=usuario_id,
        **datos.dict()
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return nuevo


# =========================
# 🔄 ACTUALIZAR PERFIL
# =========================
@router.put("/{usuario_id}", response_model=schemas.PerfilOut)
def actualizar_perfil(usuario_id: int, datos: schemas.PerfilCreate, db: Session = Depends(get_db)):

    perfil = db.query(models.PerfilUsuario).filter(
        models.PerfilUsuario.usuario_id == usuario_id
    ).first()

    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")

    for key, value in datos.dict(exclude_unset=True).items():
        setattr(perfil, key, value)

    db.commit()
    db.refresh(perfil)

    return perfil