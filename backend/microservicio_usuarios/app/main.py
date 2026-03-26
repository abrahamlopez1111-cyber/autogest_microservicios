from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, wait_for_db, SessionLocal
from . import models
from .routes import usuarios

app = FastAPI(title="Microservicio de Usuarios")

def crear_admin(db):
    admin = db.query(models.Usuario).filter(models.Usuario.email == "admin@gmail.com").first()

    if not admin:
        nuevo = models.Usuario(
            nombre="admin",
            email="admin@gmail.com",
            password="1234",
            rol="admin"
        )
        db.add(nuevo)
        db.commit()
        
        
# EVENTO DE INICIO (CLAVE)
@app.on_event("startup")
def startup():
    wait_for_db()
    models.Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    crear_admin(db)
    db.close()

    print(" Admin listo")


#  CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  ROUTES
app.include_router(usuarios.router)