from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

import models
import schemas
import crud
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Microservicio de Citas")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/citas")
def crear_cita(cita: schemas.CitaCreate, db: Session = Depends(get_db)):
    return crud.crear_cita(db, cita)


@app.get("/citas")
def listar_citas(db: Session = Depends(get_db)):
    return crud.obtener_citas(db)