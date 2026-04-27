from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base


class CatalogoRepuestos(Base):

    __tablename__ = "catalogo_repuestos"

    id = Column(Integer, primary_key=True, index=True)
    codigo_inventario = Column(String, unique=True, nullable=False)
    nombre = Column(String, nullable=False)  # 🔥 antes descripcion
    precio = Column(Float, nullable=False)


class StockSucursal(Base):

    __tablename__ = "stock_sucursal"

    id = Column(Integer, primary_key=True, index=True)
    sucursal_id = Column(Integer, nullable=False)
    catalogo_repuestos_id = Column(Integer, ForeignKey("catalogo_repuestos.id"))
    cantidad_disponible = Column(Integer, default=0)