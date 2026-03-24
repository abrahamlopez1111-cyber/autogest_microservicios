from sqlalchemy import Column, Integer, String, Boolean, ForeignKey # type: ignore
from .database import Base

class CatalogoRepuesto(Base):
    __tablename__ = "catalogo_repuestos"

    id = Column(Integer, primary_key=True, index=True)
    codigo_inventario = Column(String(50), unique=True)
    descripcion = Column(String(255))
    requiere_lote = Column(Boolean, default=False)
    punto_pedido_global = Column(Integer, default=0)


class StockSucursal(Base):
    __tablename__ = "stock_sucursal"

    id = Column(Integer, primary_key=True, index=True)
    sucursal_id = Column(Integer)
    catalogo_repuestos_id = Column(Integer, ForeignKey("catalogo_repuestos.id"))
    cantidad_disponible = Column(Integer)


class Transferencia(Base):
    __tablename__ = "transferencias"

    id_transferencias = Column(Integer, primary_key=True, index=True)
    catalogo_repuestos_id = Column(Integer, ForeignKey("catalogo_repuestos.id"))
    sucursal_origen_id = Column(Integer)
    sucursal_destino_id = Column(Integer)
    cantidad = Column(Integer)
    estado = Column(String(50))