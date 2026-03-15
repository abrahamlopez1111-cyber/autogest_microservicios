from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Sucursal(Base):
    __tablename__ = "sucursales"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    pais = Column(String)
    capacidad_elevadores = Column(Integer)


class Mecanico(Base):
    __tablename__ = "mecanicos"

    id = Column(Integer, primary_key=True, index=True)
    sucursal_id = Column(Integer, ForeignKey("sucursales.id"))
    nombre = Column(String)
    activo = Column(Boolean, default=True)


class ContratoFlota(Base):
    __tablename__ = "contrato_flota"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer)
    politica_autorizacion = Column(String)


class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True)

    sucursal_id = Column(Integer, ForeignKey("sucursales.id"))
    mecanico_id = Column(Integer, ForeignKey("mecanicos.id"))
    vehiculo_id = Column(Integer)

    contrato_flota_id = Column(Integer, ForeignKey("contrato_flota.id"))

    fecha_hora_inicio = Column(DateTime)
    fecha_hora_fin = Column(DateTime)

    estado = Column(String, default="programada")