from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

import models
import schemas
import crud

from database import SessionLocal, engine, wait_for_db, get_db

from datetime import datetime, timedelta
import pytz

app = FastAPI(title="Microservicio de Citas")


@app.on_event("startup")
def startup():
    wait_for_db()
    models.Base.metadata.create_all(bind=engine)
    print("Microservicio de citas listo")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=HTMLResponse)
def inicio():
    return """
    <html>
        <body style="font-family: Arial; text-align:center; margin-top:50px;">
            <h1>AutoGest</h1>
            <h2>Microservicio de Citas</h2>
            <p>Backend funcionando correctamente</p>
            <a href="/docs">Ir a Swagger</a>
        </body>
    </html>
    """


# =========================
# CITAS
# =========================
@app.post("/citas", response_model=schemas.CitaOut)
def crear_cita(cita: schemas.CitaCreate, db: Session = Depends(get_db)):
    try:
        return crud.crear_cita(db, cita)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/citas")
def listar_citas(db: Session = Depends(get_db)):
    return crud.obtener_citas(db)


@app.get("/citas/disponibilidad/{mecanico_id}/{fecha}")
def disponibilidad(mecanico_id: int, fecha: str, db: Session = Depends(get_db)):
    return crud.obtener_disponibilidad(db, mecanico_id, fecha)


@app.get("/citas/mecanico/{mecanico_id}/hoy")
def citas_hoy_mecanico(mecanico_id: int, db: Session = Depends(get_db)):
    tz = pytz.timezone("America/Bogota")
    hoy_inicio = datetime.now(tz).replace(hour=0, minute=0, second=0, microsecond=0)
    hoy_fin = hoy_inicio + timedelta(days=1)

    return db.query(models.Cita).filter(
        models.Cita.mecanico_id == mecanico_id,
        models.Cita.estado == "recibida",
        models.Cita.fecha_hora_inicio >= hoy_inicio,
        models.Cita.fecha_hora_inicio < hoy_fin
    ).all()


@app.get("/citas/mecanico/{mecanico_id}")
def citas_por_mecanico(mecanico_id: int, db: Session = Depends(get_db)):
    return crud.obtener_citas_por_mecanico(db, mecanico_id) or []


@app.get("/citas/sucursal/{sucursal_id}/hoy", response_model=list[schemas.CitaOut])
def citas_hoy_sucursal(sucursal_id: int, db: Session = Depends(get_db)):
    tz = pytz.timezone("America/Bogota")
    hoy_inicio = datetime.now(tz).replace(hour=0, minute=0, second=0, microsecond=0)
    hoy_fin = hoy_inicio + timedelta(days=1)

    return db.query(models.Cita).filter(
        models.Cita.sucursal_id == sucursal_id,
        models.Cita.fecha_hora_inicio >= hoy_inicio,
        models.Cita.fecha_hora_inicio < hoy_fin
    ).all()


@app.get("/citas/sucursal/{sucursal_id}")
def citas_por_sucursal(sucursal_id: int, db: Session = Depends(get_db)):
    return db.query(models.Cita).filter(
        models.Cita.sucursal_id == sucursal_id
    ).all()


@app.get("/citas/{cita_id}/recepcion")
def obtener_recepcion(cita_id: int, db: Session = Depends(get_db)):
    recepcion = db.query(models.RecepcionCita).filter(
        models.RecepcionCita.cita_id == cita_id
    ).first()

    if not recepcion:
        raise HTTPException(status_code=404, detail="Recepción no encontrada")

    return recepcion


@app.get("/citas/{id}")
def obtener_cita(id: int, db: Session = Depends(get_db)):
    cita = crud.obtener_cita_por_id(db, id)
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return cita


@app.put("/citas/{id}/recibir", response_model=schemas.CitaOut)
def recibir_cita(id: int, data: schemas.RecepcionCreate, db: Session = Depends(get_db)):
    cita = db.query(models.Cita).filter(models.Cita.id == id).first()

    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    if cita.estado != "programada":
        raise HTTPException(
            status_code=400,
            detail=f"La cita no se puede recibir (estado actual: {cita.estado})"
        )

    recepcion = models.RecepcionCita(
        cita_id=id,
        kilometraje=data.kilometraje,
        observaciones=data.observaciones
    )
    db.add(recepcion)

    cita.estado = "recibida"
    db.commit()
    db.refresh(cita)

    return cita


@app.put("/citas/{id}/estado/{estado}")
def cambiar_estado_cita(id: int, estado: str, db: Session = Depends(get_db)):
    cita = db.query(models.Cita).filter(models.Cita.id == id).first()

    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    cita.estado = estado
    db.commit()
    db.refresh(cita)

    return {"mensaje": "Estado actualizado", "estado": cita.estado}


@app.put("/citas/{id}/observacion")
def guardar_observacion(id: int, observacion: str, db: Session = Depends(get_db)):
    cita = db.query(models.Cita).filter(models.Cita.id == id).first()

    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    cita.observacion_cliente = observacion
    db.commit()

    return {"ok": True}


@app.delete("/citas/{cita_id}")
def eliminar_cita(cita_id: int, db: Session = Depends(get_db)):
    cita = crud.eliminar_cita(db, cita_id)
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return {"mensaje": "Cita eliminada"}


# =========================
# SUCURSALES
# =========================
@app.post("/sucursales")
def crear_sucursal(data: schemas.SucursalCreate, db: Session = Depends(get_db)):
    return crud.crear_sucursal(db, data)


@app.get("/sucursales")
def listar_sucursales(db: Session = Depends(get_db)):
    return crud.obtener_sucursales(db)


# =========================
# MECANICOS
# =========================
@app.post("/mecanicos")
def crear_mecanico(data: schemas.MecanicoCreate, db: Session = Depends(get_db)):
    return crud.crear_mecanico(db, data)


@app.get("/mecanicos")
def listar_mecanicos(db: Session = Depends(get_db)):
    return crud.obtener_mecanicos(db)


@app.delete("/mecanicos/{id}")
def eliminar_mecanico(id: int, db: Session = Depends(get_db)):
    mecanico = crud.eliminar_mecanico(db, id)
    if not mecanico:
        raise HTTPException(status_code=404, detail="Mecánico no encontrado")
    return {"mensaje": "Mecánico eliminado"}


# =========================
# RECEPCIONISTAS
# =========================
@app.get("/recepcionistas", response_model=list[schemas.RecepcionistaOut])
def listar_recepcionistas(db: Session = Depends(get_db)):
    return db.query(models.Recepcionista).all()


@app.post("/recepcionistas", response_model=schemas.RecepcionistaOut)
def crear_recepcionista(data: schemas.RecepcionistaCreate, db: Session = Depends(get_db)):
    existe = db.query(models.Recepcionista).filter(
        models.Recepcionista.usuario_id == data.usuario_id
    ).first()

    if existe:
        raise HTTPException(status_code=400, detail="El usuario ya es recepcionista")

    nuevo = models.Recepcionista(
        usuario_id=data.usuario_id,
        sucursal_id=data.sucursal_id
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return nuevo


@app.delete("/recepcionistas/{id}")
def eliminar_recepcionista(id: int, db: Session = Depends(get_db)):
    recep = db.query(models.Recepcionista).filter(models.Recepcionista.id == id).first()
    if not recep:
        raise HTTPException(status_code=404, detail="Recepcionista no encontrado")
    db.delete(recep)
    db.commit()
    return {"mensaje": "Recepcionista eliminado"}