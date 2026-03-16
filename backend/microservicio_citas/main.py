from fastapi.responses import HTMLResponse
from fastapi import HTTPException
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

import models
import schemas
import crud
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Microservicio de Citas")

""" """
@app.get("/", response_class=HTMLResponse)
def inicio():
    return """
    <html>
        <head>
            <title>AutoGest - Microservicio de Citas</title>
        </head>
        <body style="font-family: Arial; text-align:center; margin-top:50px;">
            <h1>🚗 AutoGest</h1>
            <h2>Microservicio de Gestión de Citas</h2>
            <p>El backend está funcionando correctamente.</p>

            <h3>Endpoints disponibles</h3>
            <ul style="list-style:none;">
                <li>📌 Ver documentación: <a href="/docs">/docs</a></li>
                <li>📌 Ver citas: <a href="/citas">/citas</a></li>
            </ul>

            <p style="margin-top:40px;">Proyecto de Arquitectura de Software</p>
        </body>
    </html>
    """
    
    
    


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def inicio():
    return {"mensaje": "Microservicio de citas funcionando"}


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
    return crud.obtener_cita_por_id(db, id)


@app.get("/citas/mecanico/{id}")
def citas_por_mecanico(id: int, db: Session = Depends(get_db)):
    return crud.obtener_citas_por_mecanico(db, id)


@app.put("/citas/{id}")
def actualizar_cita(id: int, cita: schemas.CitaCreate, db: Session = Depends(get_db)):
    return crud.actualizar_cita(db, id, cita)


@app.delete("/citas/{id}")
def cancelar_cita(id: int, db: Session = Depends(get_db)):
    return crud.cancelar_cita(db, id)


@app.get("/agenda/hoy")
def agenda_hoy(db: Session = Depends(get_db)):
    return crud.obtener_agenda_hoy(db)