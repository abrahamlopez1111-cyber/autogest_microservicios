from fastapi import FastAPI
from .database import engine
from . import models
from .routes import usuarios

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Microservicio de Usuarios")

app.include_router(usuarios.router)