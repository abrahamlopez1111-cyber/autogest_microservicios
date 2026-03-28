from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Sucursal(Base):
    tablename = "sucursales"


    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    pais = Column(String, nullable=False)
    capacidad_elevadores = Column(Integer, nullable=False)

    # 🔗 Relaciones
    mecanicos = relationship("Mecanico", back_populates="sucursal")
    citas = relationship("Cita", back_populates="sucursal")


class Mecanico(Base):
    tablename = "mecanicos"


    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, nullable=False, unique=True)
    sucursal_id = Column(Integer, ForeignKey("sucursales.id"), nullable=False)
    activo = Column(Boolean, default=True)

# 🔗 Relaciones
    sucursal = relationship("Sucursal", back_populates="mecanicos")
    citas = relationship("Cita", back_populates="mecanico")


class ContratoFlota(Base):
    tablename = "contrato_flota"


    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, nullable=False)
    politica_autorizacion = Column(String)

# 🔗 Relaciones
    citas = relationship("Cita", back_populates="contrato_flota")


class Cita(Base):
    tablename = "citas"


    id = Column(Integer, primary_key=True, index=True)

    sucursal_id = Column(Integer, ForeignKey("sucursales.id"), nullable=False)
    mecanico_id = Column(Integer, ForeignKey("mecanicos.id"), nullable=False)
    vehiculo_id = Column(Integer, nullable=False)

    contrato_flota_id = Column(Integer, ForeignKey("contrato_flota.id"))

    fecha_hora_inicio = Column(DateTime, nullable=False)
    fecha_hora_fin = Column(DateTime, nullable=False)

    estado = Column(String, default="programada")

    # 🔗 Relaciones
    sucursal = relationship("Sucursal", back_populates="citas")
    mecanico = relationship("Mecanico", back_populates="citas")
    contrato_flota = relationship("ContratoFlota", back_populates="citas")

