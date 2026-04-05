from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

import models
import schemas
import crud

from database import SessionLocal, engine, wait_for_db


# =========================
# 🚀 APP
# =========================
app = FastAPI(title="Microservicio de Citas")


# =========================
# 🔥 STARTUP
# =========================
@app.on_event("startup")
def startup():
    wait_for_db()
    models.Base.metadata.create_all(bind=engine)
    print("🚀 DB citas lista")


# =========================
# 🌐 CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# 🔌 DB
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# 🏠 HOME
# =========================
@app.get("/", response_class=HTMLResponse)
def inicio():
    return """
    <html>
        <body style="font-family: Arial; text-align:center; margin-top:50px;">
            <h1>🚗 AutoGest</h1>
            <h2>Microservicio de Citas</h2>
            <p>Backend funcionando correctamente</p>
            <a href="/docs">📌 Ir a Swagger</a>
        </body>
    </html>
    """


# =========================
# 📅 CITAS
# =========================
@app.post("/citas")
def crear_cita(cita: schemas.CitaCreate, db: Session = Depends(get_db)):
    try:
        return crud.crear_cita(db, cita)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/citas")
def listar_citas(db: Session = Depends(get_db)):
    return crud.obtener_citas(db)


@app.get("/citas/{id}")
def obtener_cita(id: int, db: Session = Depends(get_db)):
    cita = crud.obtener_cita_por_id(db, id)

    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    return cita


# 🔥 ESTE ES EL QUE DEBES USAR EN EL FRONTEND
@app.get("/citas/mecanico/{mecanico_id}")
def citas_por_mecanico(mecanico_id: int, db: Session = Depends(get_db)):
    citas = crud.obtener_citas_por_mecanico(db, mecanico_id)

    if not citas:
        return []  # 🔥 evita errores en frontend

    return citas


@app.delete("/citas/{cita_id}")
def eliminar_cita(cita_id: int, db: Session = Depends(get_db)):
    cita = crud.eliminar_cita(db, cita_id)

    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    return {"mensaje": "Cita eliminada"}


# =========================
# 🔥 ACTUALIZAR ESTADO
# =========================
@app.put("/citas/{cita_id}/estado")
def actualizar_estado(cita_id: int, estado: str, db: Session = Depends(get_db)):
    cita = db.query(models.Cita).filter(models.Cita.id == cita_id).first()

    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    cita.estado = estado
    db.commit()
    db.refresh(cita)

    return {"mensaje": "Estado actualizado", "estado": cita.estado}


# =========================
# 🔥 DISPONIBILIDAD
# =========================
@app.get("/citas/disponibilidad/{mecanico_id}/{fecha}")
def disponibilidad(mecanico_id: int, fecha: str, db: Session = Depends(get_db)):
    return crud.obtener_disponibilidad(db, mecanico_id, fecha)


# =========================
# 🏢 SUCURSALES
# =========================
@app.post("/sucursales")
def crear_sucursal(data: schemas.SucursalCreate, db: Session = Depends(get_db)):
    return crud.crear_sucursal(db, data)


@app.get("/sucursales")
def listar_sucursales(db: Session = Depends(get_db)):
    return crud.obtener_sucursales(db)


# =========================
# 🔧 MECÁNICOS
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