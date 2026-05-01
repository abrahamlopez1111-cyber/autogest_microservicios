from pydantic import BaseModel
from typing import List


class RepuestoUsadoCreate(BaseModel):
    repuesto_id: int
    cantidad: int


class DiagnosticoCreate(BaseModel):

    cita_id: int
    descripcion_falla: str
    reparacion_realizada: str
    mano_obra: float
    repuestos: List[RepuestoUsadoCreate]


class DiagnosticoOut(BaseModel):

    id: int
    cita_id: int
    descripcion_falla: str
    reparacion_realizada: str
    mano_obra: float
    estado: str

    class Config:
        from_attributes = True