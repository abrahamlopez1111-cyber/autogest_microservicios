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
# LISTAR REPUESTOS
# =========================
@router.get("/", response_model=list[schemas.Repuesto])
def listar_repuestos(db: Session = Depends(get_db)):
    return db.query(models.CatalogoRepuestos).all()


# =========================
# CREAR REPUESTO
# =========================
@router.post("/", response_model=schemas.Repuesto)
def crear_repuesto(data: schemas.RepuestoCreate, db: Session = Depends(get_db)):
    nuevo = models.CatalogoRepuestos(
        codigo_inventario=f"REP-{int(time.time())}",
        nombre=data.nombre,
        precio=data.precio
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


# =========================
# CREAR STOCK
# =========================
@router.post("/stock")
def crear_stock(data: schemas.StockCreate, db: Session = Depends(get_db)):
    stock = models.StockSucursal(
        sucursal_id=data.sucursal_id,
        catalogo_repuestos_id=data.catalogo_repuestos_id,
        cantidad_disponible=data.cantidad_disponible
    )
    db.add(stock)
    db.commit()
    db.refresh(stock)
    return {"mensaje": "Stock creado", "id": stock.id}


# =========================
# STOCK POR SUCURSAL
# =========================
@router.get("/stock/{sucursal_id}")
def stock_por_sucursal(sucursal_id: int, db: Session = Depends(get_db)):
    return db.query(models.StockSucursal).filter(
        models.StockSucursal.sucursal_id == sucursal_id
    ).all()


# =========================
# DISPONIBILIDAD
# =========================
@router.get("/disponibilidad/{repuesto_id}/{sucursal_id}")
def disponibilidad(repuesto_id: int, sucursal_id: int, db: Session = Depends(get_db)):
    stock = db.query(models.StockSucursal).filter(
        models.StockSucursal.catalogo_repuestos_id == repuesto_id,
        models.StockSucursal.sucursal_id == sucursal_id
    ).first()
    return {"disponible": stock.cantidad_disponible if stock else 0}


# =========================
# INVENTARIO COMPLETO
# =========================
@router.get("/inventario-completo")
def inventario_completo(db: Session = Depends(get_db)):
    try:
        data = db.query(
            models.CatalogoRepuestos.id,
            models.CatalogoRepuestos.nombre,
            models.CatalogoRepuestos.precio,
            models.StockSucursal.cantidad_disponible,
            models.StockSucursal.sucursal_id
        ).outerjoin(
            models.StockSucursal,
            models.CatalogoRepuestos.id == models.StockSucursal.catalogo_repuestos_id
        ).all()

        return [
            {
                "id": r.id,
                "nombre": r.nombre,
                "precio": r.precio,
                "cantidad": r.cantidad_disponible or 0,
                "sucursal_id": r.sucursal_id
            }
            for r in data
        ]
    except Exception:
        return []


# =========================
# OBTENER REPUESTO POR ID
# =========================
@router.get("/{repuesto_id}", response_model=schemas.Repuesto)
def obtener_repuesto(repuesto_id: int, db: Session = Depends(get_db)):
    repuesto = db.query(models.CatalogoRepuestos).filter(
        models.CatalogoRepuestos.id == repuesto_id
    ).first()
    if not repuesto:
        raise HTTPException(status_code=404, detail="Repuesto no encontrado")
    return repuesto


# =========================
# EDITAR REPUESTO
# =========================
@router.put("/{repuesto_id}")
def actualizar_repuesto(repuesto_id: int, data: schemas.RepuestoBase, db: Session = Depends(get_db)):
    repuesto = db.query(models.CatalogoRepuestos).filter(
        models.CatalogoRepuestos.id == repuesto_id
    ).first()
    if not repuesto:
        raise HTTPException(status_code=404, detail="Repuesto no encontrado")

    repuesto.nombre = data.nombre
    repuesto.precio = data.precio
    db.commit()
    db.refresh(repuesto)

    return {
        "id": repuesto.id,
        "nombre": repuesto.nombre,
        "precio": repuesto.precio,
        "codigo_inventario": repuesto.codigo_inventario,
    }


# =========================
# ELIMINAR REPUESTO
# =========================
@router.delete("/{repuesto_id}")
def eliminar_repuesto(repuesto_id: int, db: Session = Depends(get_db)):
    repuesto = db.query(models.CatalogoRepuestos).filter(
        models.CatalogoRepuestos.id == repuesto_id
    ).first()
    if not repuesto:
        raise HTTPException(status_code=404, detail="Repuesto no encontrado")

    # Eliminar stock asociado primero para evitar FK constraint
    db.query(models.StockSucursal).filter(
        models.StockSucursal.catalogo_repuestos_id == repuesto_id
    ).delete()

    db.delete(repuesto)
    db.commit()

    return {"mensaje": "Repuesto eliminado"}


# =========================
# ACTUALIZAR STOCK
# =========================
@router.put("/stock/{sucursal_id}/{repuesto_id}")
def actualizar_stock(sucursal_id: int, repuesto_id: int, cantidad: int, db: Session = Depends(get_db)):
    stock = db.query(models.StockSucursal).filter(
        models.StockSucursal.sucursal_id == sucursal_id,
        models.StockSucursal.catalogo_repuestos_id == repuesto_id
    ).first()

    if not stock:
        raise HTTPException(status_code=404, detail="Stock no encontrado")

    stock.cantidad_disponible = max(0, cantidad)
    db.commit()
    db.refresh(stock)

    return {
        "sucursal_id": stock.sucursal_id,
        "repuesto_id": stock.catalogo_repuestos_id,
        "cantidad_disponible": stock.cantidad_disponible
    }


# =========================
# DESCONTAR STOCK
# =========================
@router.post("/stock/descontar")
def descontar_stock(data: dict, db: Session = Depends(get_db)):
    repuesto_id = data.get("repuesto_id")
    sucursal_id = data.get("sucursal_id")
    cantidad = data.get("cantidad", 0)

    stock = db.query(models.StockSucursal).filter(
        models.StockSucursal.sucursal_id == sucursal_id,
        models.StockSucursal.catalogo_repuestos_id == repuesto_id
    ).first()

    if not stock:
        raise HTTPException(status_code=404, detail="Stock no encontrado")

    if stock.cantidad_disponible < cantidad:
        raise HTTPException(status_code=400, detail="Stock insuficiente")

    stock.cantidad_disponible -= cantidad
    db.commit()

    return {"ok": True, "cantidad_restante": stock.cantidad_disponible}