from pydantic import BaseModel

class RepuestoBase(BaseModel):
    codigo_inventario: str
    descripcion: str

class RepuestoCreate(RepuestoBase):
    pass

class Repuesto(RepuestoBase):
    id: int

    class Config:
        orm_mode = True