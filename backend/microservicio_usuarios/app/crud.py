from sqlalchemy.orm import Session
from . import models


# =========================
# 👤 CREAR USUARIO
# =========================
def crear_usuario(db: Session, usuario):
    nuevo = models.Usuario(**usuario.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


# =========================
# 📋 OBTENER TODOS
# =========================
def obtener_usuarios(db: Session):
    return db.query(models.Usuario).all()


# =========================
# 🔍 OBTENER POR ID (🔥 CLAVE)
# =========================
def obtener_usuario_por_id(db: Session, usuario_id: int):
    return db.query(models.Usuario).filter(
        models.Usuario.id_usuarios == usuario_id  # ✅ CORRECTO
    ).first()


# =========================
# 🔐 LOGIN
# =========================
def login(db: Session, email: str, password: str):
    return db.query(models.Usuario).filter(
        models.Usuario.email == email,
        models.Usuario.password == password
    ).first()