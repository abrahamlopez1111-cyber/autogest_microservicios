from pydantic import BaseModel # type: ignore


class RepuestoBase(BaseModel):
    codigo_inventario: str
    descripcion: str
    precio: float
    stock: int


class RepuestoCreate(RepuestoBase):
    pass


class Repuesto(RepuestoBase):
    id: int

    class Config:
        from_attributes = True