from pydantic import BaseModel
from typing import Optional
from datetime import date

# =========================
# 🚗 VEHÍCULO
# =========================

class VehiculoBase(BaseModel):
    usuario_id: int
    placa: str
    marca: str
    modelo: Optional[str] = None
    anio_fabricacion: Optional[int] = None


class VehiculoCreate(VehiculoBase):
    pass


class Vehiculo(VehiculoBase):
    id: int

    class Config:
        from_attributes = True


# =========================
# 📋 SERVICIO HISTÓRICO
# =========================

class ServicioHistoricoBase(BaseModel):
    vehiculo_id: int
    sucursal_id: int
    fecha_servicio: date
    kilometraje: Optional[int] = None
    observaciones: Optional[str] = None



    # 🔥 NUEVO (ROL MECÁNICO)
    diagnostico: Optional[str] = None
    recomendacion: Optional[str] = None
    precio_mano_obra: Optional[int] = None



class ServicioHistoricoCreate(ServicioHistoricoBase):
    pass


class ServicioHistorico(ServicioHistoricoBase):
    id: int

    class Config:
        from_attributes = True