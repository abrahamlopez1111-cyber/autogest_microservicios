from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, wait_for_db
from . import models
from .routes import usuarios

app = FastAPI(title="Microservicio de Usuarios")


# 🔥 EVENTO DE INICIO (CLAVE)
@app.on_event("startup")
def startup():
    wait_for_db()
    models.Base.metadata.create_all(bind=engine)
    print("🚀 DB usuarios lista")


# 🔥 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 ROUTES
app.include_router(usuarios.router)