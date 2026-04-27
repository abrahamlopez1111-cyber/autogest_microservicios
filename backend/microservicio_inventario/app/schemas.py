from pydantic import BaseModel


# ======================
# PRODUCTO
# ======================
class RepuestoBase(BaseModel):
    nombre: str
    precio: float


class RepuestoCreate(RepuestoBase):
    pass


class Repuesto(RepuestoBase):
    id: int

    class Config:
        from_attributes = True


# ======================
# STOCK
# ======================
class StockCreate(BaseModel):
    sucursal_id: int
    catalogo_repuestos_id: int
    cantidad_disponible: int