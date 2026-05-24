from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from app.database import SessionLocal
from app import models, schemas

import requests
import time
import os


router = APIRouter(
    tags=["Facturacion"]
)


# =========================
# MICROSERVICIOS RENDER
# =========================
SERVICIOS = {

    "citas":
        os.getenv(
            "CITAS_SERVICE_URL",
            "https://autogest-citas.onrender.com"
        ),

    "diagnostico":
        os.getenv(
            "DIAGNOSTICO_SERVICE_URL",
            "https://autogest-diagnostico.onrender.com"
        ),

    "historial":
        os.getenv(
            "HISTORIAL_SERVICE_URL",
            "https://autogest-historial.onrender.com"
        ),

    "usuarios":
        os.getenv(
            "USUARIOS_SERVICE_URL",
            "https://autogest-usuarios.onrender.com"
        ),

    "inventario":
        os.getenv(
            "INVENTARIO_SERVICE_URL",
            "https://autogest-inventario.onrender.com"
        ),

    "facturacion":
        os.getenv(
            "FACTURACION_SERVICE_URL",
            "https://autogest-facturacion.onrender.com"
        ),
}


# =========================
# DB SESSION
# =========================
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================
# CREAR FACTURA
# =========================
@router.post("/facturas/{cita_id}")
def generar_factura(
    cita_id: int,
    db: Session = Depends(get_db)
):

    factura_existente = db.query(
        models.Factura
    ).filter(
        models.Factura.cita_id == cita_id
    ).first()

    if factura_existente:

        raise HTTPException(
            status_code=400,
            detail="Esta cita ya tiene factura"
        )

    # =========================
    # OBTENER CITA
    # =========================
    try:

        cita_res = requests.get(
            f"{SERVICIOS['citas']}/citas/{cita_id}",
            timeout=15
        )

    except Exception as e:

        raise HTTPException(
            status_code=503,
            detail=f"Error conectando citas: {str(e)}"
        )

    if not cita_res.ok:

        raise HTTPException(
            status_code=404,
            detail="Cita no encontrada"
        )

    cita = cita_res.json()

    # =========================
    # VALIDAR ESTADO
    # =========================
    estado = (
        cita.get("estado", "")
    ).lower().strip()

    if estado != "finalizada":

        raise HTTPException(
            status_code=400,
            detail="La cita aún no ha sido finalizada"
        )

    # =========================
    # OBTENER DIAGNOSTICO
    # =========================
    try:

        diag_res = requests.get(
            f"{SERVICIOS['diagnostico']}/diagnosticos/cita/{cita_id}",
            timeout=15
        )

    except Exception as e:

        raise HTTPException(
            status_code=503,
            detail=f"Error conectando diagnostico: {str(e)}"
        )

    if not diag_res.ok:

        raise HTTPException(
            status_code=404,
            detail="Diagnóstico no encontrado"
        )

    diagnostico = diag_res.json()

    # =========================
    # CALCULAR COSTOS
    # =========================
    mano_obra = float(
        diagnostico.get(
            "mano_obra",
            0
        )
    )

    subtotal = mano_obra

    for repuesto in diagnostico.get(
        "repuestos",
        []
    ):

        precio = float(
            repuesto.get(
                "precio",
                0
            )
        )

        cantidad = int(
            repuesto.get(
                "cantidad",
                1
            )
        )

        subtotal += (
            precio * cantidad
        )

    impuestos = subtotal * 0.19

    total = subtotal + impuestos

    # =========================
    # CREAR FACTURA
    # =========================
    numero = (
        f"FAC-{int(time.time())}"
    )

    nueva_factura = models.Factura(
        cita_id=cita_id,
        cliente_id=cita["usuario_id"],
        sucursal_id=cita["sucursal_id"],
        numero_factura=numero,
        subtotal=subtotal,
        impuestos=impuestos,
        total=total,
        estado_pago="pendiente"
    )

    db.add(nueva_factura)

    db.commit()

    db.refresh(nueva_factura)

    return {

        "mensaje":
            "Factura generada correctamente",

        "factura":
            nueva_factura
    }


# =========================
# LISTAR FACTURAS
# =========================
@router.get("/facturas")
def listar_facturas(
    db: Session = Depends(get_db)
):

    return db.query(
        models.Factura
    ).all()


# =========================
# FACTURAS CLIENTE
# =========================
@router.get("/facturas/cliente/{cliente_id}")
def facturas_cliente(
    cliente_id: int,
    db: Session = Depends(get_db)
):

    return db.query(
        models.Factura
    ).filter(
        models.Factura.cliente_id == cliente_id
    ).all()


# =========================
# FACTURA POR ID
# =========================
@router.get("/facturas/{factura_id}")
def obtener_factura(
    factura_id: int,
    db: Session = Depends(get_db)
):

    factura = db.query(
        models.Factura
    ).filter(
        models.Factura.id == factura_id
    ).first()

    if not factura:

        raise HTTPException(
            status_code=404,
            detail="Factura no encontrada"
        )

    return factura


# =========================
# REGISTRAR PAGO
# =========================
@router.post("/pagos")
def registrar_pago(
    data: schemas.PagoCreate,
    db: Session = Depends(get_db)
):

    factura = db.query(
        models.Factura
    ).filter(
        models.Factura.id == data.factura_id
    ).first()

    if not factura:

        raise HTTPException(
            status_code=404,
            detail="Factura no encontrada"
        )

    nuevo_pago = models.Pago(
        factura_id=data.factura_id,
        metodo_pago=data.metodo_pago,
        monto=data.monto
    )

    db.add(nuevo_pago)

    factura.estado_pago = "pagada"

    db.commit()

    return {
        "mensaje":
            "Pago registrado correctamente"
    }


# =========================
# DESCARGAR PDF
# =========================
@router.get("/facturas/{factura_id}/pdf")
def descargar_factura_pdf(
    factura_id: int,
    db: Session = Depends(get_db)
):

    factura = db.query(
        models.Factura
    ).filter(
        models.Factura.id == factura_id
    ).first()

    if not factura:

        raise HTTPException(
            status_code=404,
            detail="Factura no encontrada"
        )

    # =========================
    # PREVIEW
    # =========================
    preview_res = requests.get(
        f"{SERVICIOS['facturacion']}/facturas/preview/{factura.cita_id}",
        timeout=15
    )

    if not preview_res.ok:

        raise HTTPException(
            status_code=404,
            detail="No se pudo obtener la vista previa"
        )

    preview = preview_res.json()

    cliente = preview.get(
        "cliente",
        {}
    )

    vehiculo = preview.get(
        "vehiculo",
        {}
    )

    repuestos = preview.get(
        "repuestos",
        []
    )

    ruta_pdf = (
        f"factura_{factura.id}.pdf"
    )

    # =========================
    # CREAR PDF
    # =========================
    pdf = canvas.Canvas(
        ruta_pdf,
        pagesize=A4
    )

    y = 800

    pdf.setFont(
        "Helvetica-Bold",
        20
    )

    pdf.drawString(
        50,
        y,
        "AUTOGEST"
    )

    y -= 35

    pdf.setFont(
        "Helvetica",
        11
    )

    pdf.drawString(
        50,
        y,
        f"Factura #: {factura.numero_factura}"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Cliente: {cliente.get('nombre', 'N/A')}"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Fecha: {factura.fecha_emision}"
    )

    y -= 35

    pdf.setFont(
        "Helvetica-Bold",
        13
    )

    pdf.drawString(
        50,
        y,
        "DATOS DEL VEHICULO"
    )

    y -= 25

    pdf.setFont(
        "Helvetica",
        11
    )

    pdf.drawString(
        70,
        y,
        f"Placa: {vehiculo.get('placa', 'N/A')}"
    )

    y -= 20

    pdf.drawString(
        70,
        y,
        f"Marca: {vehiculo.get('marca', 'N/A')}"
    )

    y -= 20

    pdf.drawString(
        70,
        y,
        f"Modelo: {vehiculo.get('modelo', 'N/A')}"
    )

    y -= 35

    pdf.save()

    return FileResponse(
        path=ruta_pdf,
        filename=f"{factura.numero_factura}.pdf",
        media_type="application/pdf"
    )


# =========================
# PREVIEW FACTURA
# =========================
@router.get("/facturas/preview/{cita_id}")
def preview_factura(
    cita_id: int,
    db: Session = Depends(get_db)
):

    # =========================
    # CITA
    # =========================
    cita_res = requests.get(
        f"{SERVICIOS['citas']}/citas/{cita_id}",
        timeout=15
    )

    if not cita_res.ok:

        raise HTTPException(
            status_code=404,
            detail="Cita no encontrada"
        )

    cita = cita_res.json()

    # =========================
    # DIAGNOSTICO
    # =========================
    diag_res = requests.get(
        f"{SERVICIOS['diagnostico']}/diagnosticos/cita/{cita_id}",
        timeout=15
    )

    if not diag_res.ok:

        raise HTTPException(
            status_code=404,
            detail="Diagnóstico no encontrado"
        )

    diagnostico = diag_res.json()

    # =========================
    # VEHICULO
    # =========================
    vehiculo = {}

    try:

        vehiculo_res = requests.get(
            f"{SERVICIOS['historial']}/historial/vehiculos",
            timeout=15
        )

        if vehiculo_res.ok:

            vehiculos = vehiculo_res.json()

            vehiculo = next(
                (
                    v for v in vehiculos
                    if int(v["id"]) == int(cita["vehiculo_id"])
                ),
                {}
            )

    except Exception as e:

        print(
            "Error vehiculo:",
            e
        )

    # =========================
    # CLIENTE
    # =========================
    cliente = {}

    try:

        cliente_id = int(cita["usuario_id"])

        cliente_res = requests.get(
            f"{SERVICIOS['usuarios']}/usuarios/{cliente_id}",
            timeout=15
        )

        if cliente_res.ok:
            cliente = cliente_res.json()

    except Exception as e:

        print(
            "Error cliente:",
            e
        )

    # =========================
    # REPUESTOS
    # =========================
    repuestos_detallados = []

    subtotal_repuestos = 0

    repuestos = diagnostico.get(
        "repuestos",
        []
    )

    for r in repuestos:

        nombre = "Repuesto"

        precio_unitario = 0

        try:

            repuesto_res = requests.get(
                f"{SERVICIOS['inventario']}/inventario/repuestos/{r['repuesto_id']}",
                timeout=15
            )

            if repuesto_res.ok:

                repuesto = repuesto_res.json()

                nombre = repuesto.get(
                    "nombre",
                    "Repuesto"
                )

                precio_unitario = float(
                    repuesto.get(
                        "precio",
                        0
                    )
                )

        except Exception as e:

            print(
                "Error repuesto:",
                e
            )

        cantidad = int(
            r.get(
                "cantidad",
                1
            )
        )

        subtotal_producto = (
            precio_unitario *
            cantidad
        )

        subtotal_repuestos += (
            subtotal_producto
        )

        repuestos_detallados.append({

            "repuesto_id":
                r["repuesto_id"],

            "nombre":
                nombre,

            "cantidad":
                cantidad,

            "precio_unitario":
                precio_unitario,

            "subtotal":
                subtotal_producto
        })

    mano_obra = float(
        diagnostico.get(
            "mano_obra",
            0
        )
    )

    subtotal = (
        subtotal_repuestos +
        mano_obra
    )

    iva = subtotal * 0.19

    total = subtotal + iva

    return {

        "cliente":
            cliente,

        "vehiculo":
            vehiculo,

        "observacion_cliente":
            cita.get(
                "observacion_cliente",
                ""
            ),

        "descripcion_falla":
            diagnostico.get(
                "descripcion_falla",
                ""
            ),

        "reparacion_realizada":
            diagnostico.get(
                "reparacion_realizada",
                ""
            ),

        "repuestos":
            repuestos_detallados,

        "subtotal_repuestos":
            subtotal_repuestos,

        "mano_obra":
            mano_obra,

        "subtotal":
            subtotal,

        "iva":
            iva,

        "total":
            total
    }