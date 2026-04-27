from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas
import time

router = APIRouter(prefix="/repuestos", tags=["Repuestos"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# ✅ CREAR PRODUCTO
# =========================
@router.post("/", response_model=schemas.Repuesto)
def crear_repuesto(data: schemas.RepuestoCreate, db: Session = Depends(get_db)):

    nuevo = models.CatalogoRepuestos(
        codigo_inventario=f"REP-{int(time.time())}",
        nombre=data.nombre,  # 🔥 CORREGIDO
        precio=data.precio
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return nuevo


# =========================
# ✅ LISTAR
# =========================
@router.get("/", response_model=list[schemas.Repuesto])
def listar_repuestos(db: Session = Depends(get_db)):
    return db.query(models.CatalogoRepuestos).all()


# =========================
# ✅ STOCK (CREAR)
# =========================
@router.post("/stock")
def crear_stock(data: schemas.StockCreate, db: Session = Depends(get_db)):

    existente = db.query(models.StockSucursal).filter(
        models.StockSucursal.catalogo_repuestos_id == data.catalogo_repuestos_id,
        models.StockSucursal.sucursal_id == data.sucursal_id
    ).first()

    if existente:
        existente.cantidad_disponible += data.cantidad_disponible
        db.commit()
        return {"mensaje": "Stock actualizado"}

    nuevo = models.StockSucursal(**data.dict())
    db.add(nuevo)
    db.commit()

    return {"mensaje": "Stock creado"}


# =========================
# ✅ STOCK POR SUCURSAL
# =========================
@router.get("/stock/{sucursal_id}")
def stock_por_sucursal(sucursal_id: int, db: Session = Depends(get_db)):

    return db.query(models.StockSucursal).filter(
        models.StockSucursal.sucursal_id == sucursal_id
    ).all()


# =========================
# ✅ DISPONIBILIDAD
# =========================
@router.get("/disponibilidad/{repuesto_id}/{sucursal_id}")
def disponibilidad(repuesto_id: int, sucursal_id: int, db: Session = Depends(get_db)):

    stock = db.query(models.StockSucursal).filter(
        models.StockSucursal.catalogo_repuestos_id == repuesto_id,
        models.StockSucursal.sucursal_id == sucursal_id
    ).first()

    if not stock:
        return {"disponible": False, "cantidad": 0}

    return {
        "disponible": stock.cantidad_disponible > 0,
        "cantidad": stock.cantidad_disponible
    }
    
    
@router.get("/inventario-completo")
def inventario_completo(db: Session = Depends(get_db)):

    data = db.query(
        models.CatalogoRepuestos.id,
        models.CatalogoRepuestos.nombre,
        models.CatalogoRepuestos.precio,
        models.StockSucursal.cantidad_disponible,
        models.StockSucursal.sucursal_id
    ).join(
        models.StockSucursal,
        models.CatalogoRepuestos.id == models.StockSucursal.catalogo_repuestos_id
    ).all()

    return [
        {
            "id": r.id,
            "nombre": r.nombre,
            "precio": r.precio,
            "cantidad": r.cantidad_disponible,
            "sucursal_id": r.sucursal_id
        }
        for r in data
    ]