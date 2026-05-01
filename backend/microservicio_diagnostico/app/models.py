from sqlalchemy import (Column, Integer, String, Float, DateTime, ForeignKey)
from datetime import datetime
from app.database import Base


class Diagnostico(Base):

    __tablename__ = "diagnosticos"
    id = Column(Integer, primary_key=True, index=True)
    cita_id = Column(Integer, nullable=False)
    descripcion_falla = Column(String, nullable=False)
    reparacion_realizada = Column(String, nullable=True)
    mano_obra = Column(Float, default=0)
    estado = Column(String, default="diagnosticado")
    fecha_creacion = Column(DateTime, default=datetime.utcnow)


class DiagnosticoRepuesto(Base):

    __tablename__ = "diagnostico_repuestos"
    id = Column(Integer, primary_key=True, index=True)
    diagnostico_id = Column(Integer, ForeignKey("diagnosticos.id"), nullable=False)
    repuesto_id = Column(Integer, nullable=False)
    cantidad = Column(Integer, nullable=False)