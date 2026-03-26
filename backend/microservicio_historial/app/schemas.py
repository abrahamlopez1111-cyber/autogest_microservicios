from pydantic import BaseModel # type: ignore
from datetime import datetime
from typing import Optional


# =========================================================
# 🚗 VEHÍCULO
# =========================================================

class VehiculoBase(BaseModel):
    matricula: str
    marca: str
    modelo: str
    anio: int


class VehiculoCreate(VehiculoBase):
    pass


class Vehiculo(VehiculoBase):
    id: int

    class Config:
        from_attributes = True


# =========================================================
# 👤 CLIENTE
# =========================================================

class ClienteBase(BaseModel):
    nombre: str
    documento: str
    telefono: Optional[str] = None


class ClienteCreate(ClienteBase):
    pass


class Cliente(ClienteBase):
    id: int

    class Config:
        from_attributes = True


# =========================================================
#  HISTORIAL
# =========================================================

class HistorialBase(BaseModel):
    vehiculo_id: int
    descripcion: str
    fecha: Optional[datetime] = None


class HistorialCreate(HistorialBase):
    pass


class Historial(HistorialBase):
    id: int

    class Config:
        from_attributes = True