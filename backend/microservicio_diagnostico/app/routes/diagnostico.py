from fastapi import APIRouter, Depends
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
# LISTAR
# =========================
@router.get("/")
def listar_diagnosticos(
    db: Session = Depends(get_db)
):
    return db.query(
        models.Diagnostico
    ).all()