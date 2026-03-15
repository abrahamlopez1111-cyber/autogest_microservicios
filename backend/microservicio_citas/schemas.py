from pydantic import BaseModel
from datetime import datetime

class CitaBase(BaseModel):
    sucursal_id: int
    mecanico_id: int
    vehiculo_id: int
    contrato_flota_id: int | None = None
    fecha_hora_inicio: datetime
    fecha_hora_fin: datetime
    estado: str = "programada"


class CitaCreate(CitaBase):
    pass


class Cita(CitaBase):
    id: int

    class Config:
        from_attributes = True