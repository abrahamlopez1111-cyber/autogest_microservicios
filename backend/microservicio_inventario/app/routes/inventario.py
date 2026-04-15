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

@router.get("/repuestos/{id}")
def obtener_repuesto(id: int, db: Session = Depends(get_db)):
    return db.query(models.CatalogoRepuesto).filter(models.CatalogoRepuesto.id == id).first()


@router.put("/repuestos/{id}")
def actualizar_repuesto(id: int, repuesto: schemas.RepuestoCreate, db: Session = Depends(get_db)):
    rep = db.query(models.CatalogoRepuesto).filter(models.CatalogoRepuesto.id == id).first()
    if rep:
        rep.codigo_inventario = repuesto.codigo_inventario
        rep.descripcion = repuesto.descripcion
        db.commit()
        db.refresh(rep)
    return rep


@router.delete("/repuestos/{id}")
def eliminar_repuesto(id: int, db: Session = Depends(get_db)):
    rep = db.query(models.CatalogoRepuesto).filter(models.CatalogoRepuesto.id == id).first()
    if rep:
        db.delete(rep)
        db.commit()
    return {"mensaje": "Repuesto eliminado"}


@router.get("/stock")
def ver_stock(db: Session = Depends(get_db)):
    return db.query(models.StockSucursal).all()


@router.patch("/stock/{id}")
def actualizar_stock(id: int, cantidad: int, db: Session = Depends(get_db)):
    stock = db.query(models.StockSucursal).filter(models.StockSucursal.id == id).first()
    if stock:
        stock.cantidad_disponible = cantidad
        db.commit()
        db.refresh(stock)
    return stock


@router.post("/transferencias")
def crear_transferencia(transferencia: dict, db: Session = Depends(get_db)):
    nueva = models.Transferencia(**transferencia)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.get("/stock/{sucursal_id}")
def stock_por_sucursal(sucursal_id: int, db: Session = Depends(get_db)):
    return db.query(models.StockSucursal).filter(models.StockSucursal.sucursal_id == sucursal_id).all()