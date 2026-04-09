from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, wait_for_db, SessionLocal, get_db
from . import models, crud
from .routes import usuarios
from .routes import perfil


app = FastAPI(title="Microservicio de Usuarios")


# ======================
# 🌐 CORS
# ======================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================
# 📡 ROUTES
# ======================
app.include_router(usuarios.router)
app.include_router(perfil.router)


# ======================
# 👑 CREAR ADMIN
# ======================
def crear_admin(db: Session):
    admin = db.query(models.Usuario).filter(
        models.Usuario.email == "admin@gmail.com"
    ).first()

    if not admin:
        nuevo = models.Usuario(
            nombre="admin",
            email="admin@gmail.com",
            password="1234",
            rol="admin"
        )
        db.add(nuevo)
        db.commit()


# ======================
# 🚀 STARTUP
# ======================
@app.on_event("startup")
def startup():
    wait_for_db()
    models.Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    crear_admin(db)
    db.close()

    print("Admin listo 🚀")


# ======================
# 🔥 ENDPOINT CORREGIDO
# ======================
@app.get("/usuarios/{usuario_id}")
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = crud.obtener_usuario_por_id(db, usuario_id)

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return usuario