from sqlalchemy.orm import Session
from . import models

def crear_usuario(db: Session, usuario):
    nuevo = models.Usuario(**usuario.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def obtener_usuarios(db: Session):
    return db.query(models.Usuario).all()


def login(db: Session, email: str, password: str):
    return db.query(models.Usuario).filter(
        models.Usuario.email == email,
        models.Usuario.password == password
    ).first()