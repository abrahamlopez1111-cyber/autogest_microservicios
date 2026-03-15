from sqlalchemy.orm import Session
import models
import schemas


def crear_cita(db: Session, cita: schemas.CitaCreate):
    db_cita = models.Cita(**cita.dict())
    db.add(db_cita)
    db.commit()
    db.refresh(db_cita)
    return db_cita


def obtener_citas(db: Session):
    return db.query(models.Cita).all()