from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# =========================
# 📅 CITA BASE
# =========================
class CitaBase(BaseModel):
    sucursal_id: int
    mecanico_id: int
    vehiculo_id: int
    usuario_id: int
    contrato_flota_id: Optional[int] = None
    fecha_hora_inicio: datetime
    fecha_hora_fin: datetime
    estado: str = "programada"

    # 🔥 NUEVO CAMPO
    observacion_cliente: Optional[str] = None


# =========================
# 📝 CREAR CITA
# =========================
class CitaCreate(CitaBase):
    pass


# =========================
# 📤 RESPUESTA CITA
# =========================
class CitaOut(CitaBase):
    id: int

    class Config:
        from_attributes = True


# =========================
# 🏢 SUCURSAL
# =========================
class SucursalBase(BaseModel):
    nombre: str
    pais: str
    capacidad_elevadores: int


class SucursalCreate(SucursalBase):
    pass


class SucursalOut(SucursalBase):
    id: int

    class Config:
        from_attributes = True


# =========================
# 🔧 MECÁNICO
# =========================
class MecanicoBase(BaseModel):
    usuario_id: int
    sucursal_id: int


class MecanicoCreate(MecanicoBase):
    pass


class MecanicoOut(MecanicoBase):
    id: int
    activo: bool

    class Config:
        from_attributes = True