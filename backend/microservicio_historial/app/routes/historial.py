from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.orm import Session # type: ignore
from app.database import SessionLocal
import app.models as models
import app.schemas as schemas

router = APIRouter(prefix="/historial", tags=["Historial"])

# 🔌 Conexión DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================================================
# 🚗 VEHÍCULOS (3 endpoints)
# =========================================================

# 1. Crear vehículo
@router.post("/vehiculos", response_model=schemas.Vehiculo)
def crear_vehiculo(vehiculo: schemas.VehiculoCreate, db: Session = Depends(get_db)):
    db_vehiculo = models.Vehiculo(**vehiculo.dict())
    db.add(db_vehiculo)
    db.commit()
    db.refresh(db_vehiculo)
    return db_vehiculo


# 2. Listar vehículos
@router.get("/vehiculos", response_model=list[schemas.Vehiculo])
def listar_vehiculos(db: Session = Depends(get_db)):
    return db.query(models.Vehiculo).all()


# 3. Buscar vehículo por matrícula
@router.get("/vehiculos/{matricula}", response_model=schemas.Vehiculo)
def obtener_vehiculo(matricula: str, db: Session = Depends(get_db)):
    vehiculo = db.query(models.Vehiculo).filter(models.Vehiculo.matricula == matricula).first()
    if not vehiculo:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    return vehiculo


# =========================================================
# 👤 CLIENTES (3 endpoints)
# =========================================================

# 4. Crear cliente
@router.post("/clientes", response_model=schemas.Cliente)
def crear_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = models.Cliente(**cliente.dict())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente


# 5. Listar clientes
@router.get("/clientes", response_model=list[schemas.Cliente])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(models.Cliente).all()


# 6. Buscar cliente por documento
@router.get("/clientes/{documento}", response_model=schemas.Cliente)
def obtener_cliente(documento: str, db: Session = Depends(get_db)):
    cliente = db.query(models.Cliente).filter(models.Cliente.documento == documento).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente


# =========================================================
# 📋 HISTORIAL (2 endpoints)
# =========================================================

# 7. Crear registro de historial
@router.post("/registros", response_model=schemas.Historial)
def crear_historial(historial: schemas.HistorialCreate, db: Session = Depends(get_db)):
    # Validar vehículo
    vehiculo = db.query(models.Vehiculo).filter(models.Vehiculo.id == historial.vehiculo_id).first()
    if not vehiculo:
        raise HTTPException(status_code=404, detail="Vehículo no existe")

    db_historial = models.Historial(**historial.dict())
    db.add(db_historial)
    db.commit()
    db.refresh(db_historial)
    return db_historial


# 8. Obtener historial por vehículo
@router.get("/vehiculos/{vehiculo_id}/historial", response_model=list[schemas.Historial])
def obtener_historial(vehiculo_id: int, db: Session = Depends(get_db)):
    registros = db.query(models.Historial).filter(models.Historial.vehiculo_id == vehiculo_id).all()
    return registros