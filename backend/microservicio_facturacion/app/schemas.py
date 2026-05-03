from pydantic import BaseModel


# =========================
# CREAR FACTURA
# =========================
class FacturaCreate(BaseModel):

    cita_id: int
    cliente_id: int
    sucursal_id: int


# =========================
# RESPUESTA FACTURA
# =========================
class FacturaOut(BaseModel):

    id: int
    numero_factura: str

    subtotal: float
    impuestos: float
    total: float

    estado_pago: str

    class Config:
        from_attributes = True


# =========================
# PAGAR FACTURA
# =========================
class PagoCreate(BaseModel):

    factura_id: int
    metodo_pago: str
    monto: float