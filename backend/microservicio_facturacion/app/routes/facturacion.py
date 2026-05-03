from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from app.database import SessionLocal
from app import models, schemas

import requests
import time


router = APIRouter(
    tags=["Facturacion"]
)


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

    # validar si ya existe
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

    # obtener cita
    cita_res = requests.get(
        f"http://citas_service:8000/citas/{cita_id}"
    )

    if not cita_res.ok:
        raise HTTPException(
            status_code=404,
            detail="Cita no encontrada"
        )

    cita = cita_res.json()

    # validar estado
    if cita["estado"] != "finalizada":
        raise HTTPException(
            status_code=400,
            detail="La cita aún no ha sido finalizada"
        )

    # obtener diagnóstico
    diag_res = requests.get(
        f"http://diagnostico_service:8000/diagnosticos/cita/{cita_id}"
    )

    if not diag_res.ok:
        raise HTTPException(
            status_code=404,
            detail="Diagnóstico no encontrado"
        )

    diagnostico = diag_res.json()

    # calcular costos
    mano_obra = float(
        diagnostico["mano_obra"]
    )

    subtotal = mano_obra

    for repuesto in diagnostico.get("repuestos", []):

        precio = float(
            repuesto.get("precio", 0)
        )

        cantidad = int(
            repuesto.get("cantidad", 1)
        )

        subtotal += (precio * cantidad)

    impuestos = subtotal * 0.19

    total = subtotal + impuestos

    # crear factura
    numero = f"FAC-{int(time.time())}"

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
        "mensaje": "Factura generada correctamente",
        "factura": nueva_factura
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
        "mensaje": "Pago registrado correctamente"
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
    # USAR PREVIEW YA CALCULADA
    # =========================
    preview_res = requests.get(
        f"http://facturacion_service:8000/facturas/preview/{factura.cita_id}"
    )

    if not preview_res.ok:
        raise HTTPException(
            status_code=404,
            detail="No se pudo obtener la vista previa"
        )

    preview = preview_res.json()


    cliente = preview.get("cliente", {})
    vehiculo = preview.get("vehiculo", {})
    repuestos = preview.get("repuestos", [])


    ruta_pdf = f"factura_{factura.id}.pdf"


    # =========================
    # CREAR PDF
    # =========================
    pdf = canvas.Canvas(
        ruta_pdf,
        pagesize=A4
    )

    width, height = A4

    y = 800


    # =========================
    # HEADER
    # =========================
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


    # =========================
    # VEHICULO
    # =========================
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
        f"Placa: {vehiculo.get('placa','N/A')}"
    )

    y -= 20

    pdf.drawString(
        70,
        y,
        f"Marca: {vehiculo.get('marca','N/A')}"
    )

    y -= 20

    pdf.drawString(
        70,
        y,
        f"Modelo: {vehiculo.get('modelo','N/A')}"
    )

    y -= 35


    # =========================
    # OBSERVACION
    # =========================
    pdf.setFont(
        "Helvetica-Bold",
        13
    )

    pdf.drawString(
        50,
        y,
        "OBSERVACION DEL CLIENTE"
    )

    y -= 25


    pdf.setFont(
        "Helvetica",
        11
    )

    pdf.drawString(
        70,
        y,
        preview["observacion_cliente"]
    )

    y -= 35


    # =========================
    # DIAGNOSTICO
    # =========================
    pdf.setFont(
        "Helvetica-Bold",
        13
    )

    pdf.drawString(
        50,
        y,
        "REPORTE TECNICO"
    )

    y -= 25


    pdf.setFont(
        "Helvetica",
        11
    )

    pdf.drawString(
        70,
        y,
        f"Falla: {preview['descripcion_falla']}"
    )

    y -= 20


    pdf.drawString(
        70,
        y,
        f"Reparacion: {preview['reparacion_realizada']}"
    )

    y -= 35


    # =========================
    # REPUESTOS
    # =========================
    pdf.setFont(
        "Helvetica-Bold",
        13
    )

    pdf.drawString(
        50,
        y,
        "REPUESTOS"
    )

    y -= 25


    pdf.setFont(
        "Helvetica",
        10
    )

    for rep in repuestos:

        texto = (
            f"{rep['nombre']} | "
            f"x{rep['cantidad']} | "
            f"${rep['precio_unitario']} | "
            f"${rep['subtotal']}"
        )

        pdf.drawString(
            70,
            y,
            texto
        )

        y -= 18


    y -= 20


    # =========================
    # TOTALES
    # =========================
    pdf.setFont(
        "Helvetica-Bold",
        13
    )

    pdf.drawString(
        50,
        y,
        "TOTALES"
    )

    y -= 25


    pdf.setFont(
        "Helvetica",
        11
    )

    pdf.drawString(
        70,
        y,
        f"Repuestos: ${preview['subtotal_repuestos']}"
    )

    y -= 20

    pdf.drawString(
        70,
        y,
        f"Mano de obra: ${preview['mano_obra']}"
    )

    y -= 20

    pdf.drawString(
        70,
        y,
        f"IVA: ${preview['iva']}"
    )

    y -= 20

    pdf.drawString(
        70,
        y,
        f"TOTAL: ${preview['total']}"
    )

    y -= 20

    pdf.drawString(
        70,
        y,
        f"Estado: {factura.estado_pago}"
    )


    pdf.save()


    return FileResponse(
        path=ruta_pdf,
        filename=f"{factura.numero_factura}.pdf",
        media_type="application/pdf"
    )
    
    
    
    
    
    
    
    
    #########################
    
    # vista de factura previa
    
    #########################
    
@router.get("/facturas/preview/{cita_id}")
def preview_factura(
    cita_id: int,
    db: Session = Depends(get_db)
):

    # =========================
    # OBTENER CITA
    # =========================
    cita_res = requests.get(
        f"http://citas_service:8000/citas/{cita_id}"
    )

    if not cita_res.ok:
        raise HTTPException(
            status_code=404,
            detail="Cita no encontrada"
        )

    cita = cita_res.json()


    # =========================
    # OBTENER DIAGNOSTICO
    # =========================
    diag_res = requests.get(
        f"http://diagnostico_service:8000/diagnosticos/cita/{cita_id}"
    )

    if not diag_res.ok:
        raise HTTPException(
            status_code=404,
            detail="Diagnóstico no encontrado"
        )

    diagnostico = diag_res.json()


    # =========================
    # OBTENER VEHICULO
    # =========================
    vehiculo = {}

    try:

        vehiculo_res = requests.get(
            "http://historial_service:8000/historial/vehiculos"
        )

        if vehiculo_res.ok:

            vehiculos = vehiculo_res.json()

            vehiculo = next(

                (
                    v for v in vehiculos
                    if v["id"] == cita["vehiculo_id"]
                ),

                {}

            )

    except:
        pass


    # =========================
    # OBTENER CLIENTE
    # =========================
    cliente = {}

    try:

        cliente_res = requests.get(
            f"http://usuarios_service:8000/usuarios/{cita['usuario_id']}"
        )

        if cliente_res.ok:
            cliente = cliente_res.json()

    except:
        pass


    # =========================
    # CALCULAR REPUESTOS
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
                f"http://inventario_service:8000/inventario/repuestos/{r['repuesto_id']}"
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

        except:
            pass


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


    # =========================
    # CALCULOS GENERALES
    # =========================
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


    # =========================
    # RESPUESTA FINAL
    # =========================
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