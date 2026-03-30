from sqlalchemy import Column, Integer, String, ForeignKey, Date, Text
from app.database import Base


class Vehiculo(Base):
    __tablename__ = "vehiculos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, nullable=False)

    placa = Column(String, unique=True, nullable=False)
    marca = Column(String, nullable=False)
    modelo = Column(String, nullable=False)
    anio_fabricacion = Column(Integer)


class ServicioHistorico(Base):
    __tablename__ = "servicios_historicos"

    id = Column(Integer, primary_key=True, index=True)

    vehiculo_id = Column(Integer, ForeignKey("vehiculos.id"))
    sucursal_id = Column(Integer)

    fecha_servicio = Column(Date)
    kilometraje = Column(Integer)
    observaciones = Column(Text)


class DetalleRepuesto(Base):
    __tablename__ = "detalles_repuestos"

    id = Column(Integer, primary_key=True, index=True)

    servicio_id = Column(Integer, ForeignKey("servicios_historicos.id"))
    repuesto_id = Column(Integer)

    cantidad = Column(Integer)