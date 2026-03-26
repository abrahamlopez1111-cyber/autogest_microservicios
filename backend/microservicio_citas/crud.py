from sqlalchemy import and_
from sqlalchemy.orm import Session
import models
import schemas
from datetime import date

def obtener_agenda_hoy(db: Session):

    hoy = date.today()

    return db.query(models.Cita).filter(
        models.Cita.fecha_hora_inicio >= hoy
    ).all()

def crear_cita(db: Session, cita: schemas.CitaCreate):

    cita_existente = db.query(models.Cita).filter(
        and_(
            models.Cita.mecanico_id == cita.mecanico_id,
            models.Cita.fecha_hora_inicio < cita.fecha_hora_fin,
            models.Cita.fecha_hora_fin > cita.fecha_hora_inicio
        )
    ).first()

    if cita_existente:
        raise ValueError("El mecánico ya tiene una cita en ese horario")

    db_cita = models.Cita(**cita.model_dump())
    db.add(db_cita)
    db.commit()
    db.refresh(db_cita)

    return db_cita


def obtener_citas(db: Session):
    return db.query(models.Cita).all()


def obtener_cita_por_id(db: Session, cita_id: int):
    return db.query(models.Cita).filter(models.Cita.id == cita_id).first()


def obtener_citas_por_mecanico(db: Session, mecanico_id: int):
    return db.query(models.Cita).filter(models.Cita.mecanico_id == mecanico_id).all()


def obtener_citas_por_fecha(db: Session, fecha):
    return db.query(models.Cita).filter(models.Cita.fecha_hora_inicio >= fecha).all()


def actualizar_cita(db: Session, cita_id: int, cita: schemas.CitaCreate):
    db_cita = db.query(models.Cita).filter(models.Cita.id == cita_id).first()

    if db_cita:
        for key, value in cita.dict().items():
            setattr(db_cita, key, value)

        db.commit()
        db.refresh(db_cita)

    return db_cita


def cancelar_cita(db: Session, cita_id: int):
    db_cita = db.query(models.Cita).filter(models.Cita.id == cita_id).first()

    if db_cita:
        db_cita.estado = "cancelada"
        db.commit()
        db.refresh(db_cita)

    return db_cita


def obtener_sucursales(db: Session):
    return db.query(models.Sucursal).all()

def crear_sucursal(db, sucursal):
    nueva = models.Sucursal(**sucursal.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


def obtener_mecanicos(db: Session):
    return db.query(models.Mecanico).all()


def crear_mecanico(db: Session, mecanico):
    nuevo = models.Mecanico(**mecanico.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo