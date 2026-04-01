from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
import app.models as models
import app.schemas as schemas

router = APIRouter(tags=["Historial"])

# =========================
# 🔌 CONEXIÓN DB
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================================================
# 🚗 VEHÍCULOS
# =========================================================

# ✅ Crear vehículo
@router.post("/vehiculos", response_model=schemas.Vehiculo)
def crear_vehiculo(vehiculo: schemas.VehiculoCreate, db: Session = Depends(get_db)):
    # Validar placa única
    existe = db.query(models.Vehiculo).filter(
        models.Vehiculo.placa == vehiculo.placa
    ).first()

    if existe:
        raise HTTPException(status_code=400, detail="La placa ya existe")

    db_vehiculo = models.Vehiculo(**vehiculo.dict())
    db.add(db_vehiculo)
    db.commit()
    db.refresh(db_vehiculo)

    return db_vehiculo


# ✅ Listar vehículos
@router.get("/vehiculos", response_model=list[schemas.Vehiculo])
def listar_vehiculos(db: Session = Depends(get_db)):
    return db.query(models.Vehiculo).all()


# ✅ Vehículos por usuario (🔥 IMPORTANTE para tu frontend)
@router.get("/vehiculos/usuario/{usuario_id}", response_model=list[schemas.Vehiculo])
def obtener_vehiculos_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return db.query(models.Vehiculo).filter(
        models.Vehiculo.usuario_id == usuario_id
    ).all()


# =========================================================
# 📋 SERVICIOS HISTÓRICOS
# =========================================================

# ✅ Crear historial
@router.post("/servicios", response_model=schemas.ServicioHistorico)
def crear_historial(data: schemas.ServicioHistoricoCreate, db: Session = Depends(get_db)):

    vehiculo = db.query(models.Vehiculo).filter(
        models.Vehiculo.id == data.vehiculo_id
    ).first()

    if not vehiculo:
        raise HTTPException(status_code=404, detail="Vehículo no existe")

    nuevo = models.ServicioHistorico(**data.dict())

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return nuevo

# ✅ Obtener historial por vehículo
@router.get("/vehiculos/{vehiculo_id}/servicios", response_model=list[schemas.ServicioHistorico])
def obtener_historial(vehiculo_id: int, db: Session = Depends(get_db)):
    return db.query(models.ServicioHistorico).filter(
        models.ServicioHistorico.vehiculo_id == vehiculo_id
    ).all()