from sqlalchemy import Column
from sqlalchemy import Integer, String
from sqlalchemy import Float, DateTime
from sqlalchemy import ForeignKey

from datetime import datetime

from app.database import Base


# =========================
# FACTURAS
# =========================
class Factura(Base):
    __tablename__ = "facturas"

    id = Column(Integer, primary_key=True)

    cita_id = Column(Integer, nullable=False)
    cliente_id = Column(Integer, nullable=False)
    sucursal_id = Column(Integer, nullable=False)

    numero_factura = Column(
        String,
        unique=True,
        nullable=False
    )

    fecha_emision = Column(
        DateTime,
        default=datetime.utcnow
    )

    subtotal = Column(Float, default=0)
    impuestos = Column(Float, default=0)
    total = Column(Float, default=0)

    estado_pago = Column(
        String,
        default="pendiente"
    )


# =========================
# DETALLE FACTURA
# =========================
class DetalleFactura(Base):
    __tablename__ = "detalle_factura"

    id = Column(Integer, primary_key=True)

    factura_id = Column(
        Integer,
        ForeignKey("facturas.id")
    )

    concepto = Column(String, nullable=False)

    tipo_concepto = Column(String)

    cantidad = Column(Integer)

    precio_unitario = Column(Float)

    impuesto = Column(Float, default=0)


# =========================
# PAGOS
# =========================
class Pago(Base):
    __tablename__ = "pagos"

    id = Column(Integer, primary_key=True)

    factura_id = Column(
        Integer,
        ForeignKey("facturas.id")
    )

    metodo_pago = Column(String)

    monto = Column(Float)

    fecha_pago = Column(
        DateTime,
        default=datetime.utcnow
    )


# =========================
# CONTABILIDAD
# =========================
class AsientoContable(Base):
    __tablename__ = "asientos_contables"

    id = Column(Integer, primary_key=True)

    factura_id = Column(
        Integer,
        ForeignKey("facturas.id")
    )

    cuenta_contable = Column(String)

    tipo_movimiento = Column(String)

    monto = Column(Float)

    fecha = Column(
        DateTime,
        default=datetime.utcnow
    )