from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas


router = APIRouter(
    prefix="/diagnosticos",
    tags=["Diagnosticos"]
)


# =========================
# CREAR DIAGNOSTICO
# =========================
@router.post("/", response_model=schemas.DiagnosticoOut)
def crear_diagnostico(
    data: schemas.DiagnosticoCreate,
    db: Session = Depends(get_db)
):

    nuevo = models.Diagnostico(
        cita_id=data.cita_id,
        descripcion_falla=data.descripcion_falla,
        reparacion_realizada=data.reparacion_realizada,
        mano_obra=data.mano_obra
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    # guardar repuestos usados
    for item in data.repuestos:

        repuesto = models.DiagnosticoRepuesto(
            diagnostico_id=nuevo.id,
            repuesto_id=item.repuesto_id,
            cantidad=item.cantidad
        )

        db.add(repuesto)

    db.commit()

    return nuevo


# =========================
# LISTAR DIAGNOSTICOS
# =========================
@router.get("/")
def listar_diagnosticos(
    db: Session = Depends(get_db)
):

    return db.query(
        models.Diagnostico
    ).all()


# =========================
# DIAGNOSTICO POR CITA
# =========================
@router.get("/cita/{cita_id}")
def obtener_diagnostico_por_cita(
    cita_id: int,
    db: Session = Depends(get_db)
):

    diagnostico = db.query(
        models.Diagnostico
    ).filter(
        models.Diagnostico.cita_id == cita_id
    ).first()

    if not diagnostico:

        raise HTTPException(
            status_code=404,
            detail="Diagnóstico no encontrado"
        )

    repuestos = db.query(
        models.DiagnosticoRepuesto
    ).filter(
        models.DiagnosticoRepuesto.diagnostico_id == diagnostico.id
    ).all()

    return {
        "id": diagnostico.id,
        "cita_id": diagnostico.cita_id,
        "descripcion_falla": diagnostico.descripcion_falla,
        "reparacion_realizada": diagnostico.reparacion_realizada,
        "mano_obra": diagnostico.mano_obra,

        "repuestos": [
            {
                "repuesto_id": r.repuesto_id,
                "cantidad": r.cantidad,
                "precio": 0
            }
            for r in repuestos
        ]
    }