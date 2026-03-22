from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔹 Crear repuesto
@router.post("/repuestos")
def crear_repuesto(repuesto: schemas.RepuestoCreate, db: Session = Depends(get_db)):
    nuevo = models.CatalogoRepuesto(**repuesto.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# 🔹 Listar repuestos
@router.get("/repuestos")
def listar_repuestos(db: Session = Depends(get_db)):
    return db.query(models.CatalogoRepuesto).all()