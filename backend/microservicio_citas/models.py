from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from database import Base


# =========================
# 🏢 SUCURSAL
# =========================
class Sucursal(Base):
    __tablename__ = "sucursales"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    pais = Column(String, nullable=False)
    capacidad_elevadores = Column(Integer, nullable=False)

    mecanicos = relationship(
        "Mecanico",
        back_populates="sucursal",
        cascade="all, delete"
    )

    citas = relationship(
        "Cita",
        back_populates="sucursal",
        cascade="all, delete"
    )


# =========================
# 🔧 MECÁNICO
# =========================
class Mecanico(Base):
    __tablename__ = "mecanicos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, nullable=False, unique=True)
    sucursal_id = Column(Integer, ForeignKey("sucursales.id"), nullable=False)
    activo = Column(Boolean, default=True)

    sucursal = relationship("Sucursal", back_populates="mecanicos")

    citas = relationship(
        "Cita",
        back_populates="mecanico",
        cascade="all, delete"
    )


# =========================
# 📄 CONTRATO FLOTA
# =========================
class ContratoFlota(Base):
    __tablename__ = "contrato_flota"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, nullable=False)
    politica_autorizacion = Column(String)

    citas = relationship(
        "Cita",
        back_populates="contrato_flota",
        cascade="all, delete"
    )


# =========================
# 📅 CITA
# =========================
class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True)

    usuario_id = Column(Integer, nullable=False)
    sucursal_id = Column(Integer, ForeignKey("sucursales.id"), nullable=False)
    mecanico_id = Column(Integer, ForeignKey("mecanicos.id"), nullable=False)
    vehiculo_id = Column(Integer, nullable=False)

    contrato_flota_id = Column(
        Integer,
        ForeignKey("contrato_flota.id"),
        nullable=True
    )

    fecha_hora_inicio = Column(DateTime, nullable=False)
    fecha_hora_fin = Column(DateTime, nullable=False)

    estado = Column(String, default="programada")

    # 🔥 NUEVO CAMPO (CLIENTE → MECÁNICO)
    observacion_cliente = Column(Text, nullable=True)

    # 🔥 (FUTURO OPCIONAL)
    # observacion_mecanico = Column(Text, nullable=True)

    # =========================
    # RELACIONES
    # =========================
    sucursal = relationship("Sucursal", back_populates="citas")
    mecanico = relationship("Mecanico", back_populates="citas")
    contrato_flota = relationship("ContratoFlota", back_populates="citas")