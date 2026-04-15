from sqlalchemy import Column, Integer, String, Float # type: ignore
from app.database import Base


class CatalogoRepuestos(Base):

    __tablename__ = "catalogo_repuestos"

    id = Column(Integer, primary_key=True, index=True)
    codigo_inventario = Column(String, nullable=False)
    descripcion = Column(String, nullable=False)
    precio = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False)