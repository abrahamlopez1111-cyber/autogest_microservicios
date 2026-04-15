from fastapi import APIRouter, Depends # pyright: ignore[reportMissingImports]
from sqlalchemy.orm import Session # pyright: ignore[reportMissingImports]
from app.database import SessionLocal
from app import models, schemas

router = APIRouter()

# Dependencia DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREAR REPUESTO
@router.post("/repuestos", response_model=schemas.Repuesto)
def crear_repuesto(repuesto: schemas.RepuestoCreate, db: Session = Depends(get_db)):
    nuevo = models.CatalogoRepuestos(**repuesto.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


# LISTAR REPUESTOS
@router.get("/repuestos", response_model=list[schemas.Repuesto])
def listar_repuestos(db: Session = Depends(get_db)):
    return db.query(models.CatalogoRepuestos).all()


# OBTENER REPUESTO
@router.get("/repuestos/{repuesto_id}", response_model=schemas.Repuesto)
def obtener_repuesto(repuesto_id: int, db: Session = Depends(get_db)):
    return db.query(models.CatalogoRepuestos).filter(
        models.CatalogoRepuestos.id == repuesto_id
    ).first()


# ELIMINAR REPUESTO
@router.delete("/repuestos/{repuesto_id}")
def eliminar_repuesto(repuesto_id: int, db: Session = Depends(get_db)):
    repuesto = db.query(models.CatalogoRepuestos).filter(
        models.CatalogoRepuestos.id == repuesto_id
    ).first()

    if repuesto:
        db.delete(repuesto)
        db.commit()

    return {"mensaje": "Repuesto eliminado"}