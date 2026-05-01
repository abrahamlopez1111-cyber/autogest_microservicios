from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, wait_for_db
from app.routes import diagnostico


app = FastAPI(
    title="Microservicio Diagnóstico",
    version="1.0.0"
)

# =========================
# CORS (ESTO FALTABA)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # luego en producción restringes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# STARTUP
# =========================
@app.on_event("startup")
def startup():

    print("⏳ Esperando DB diagnostico...")
    wait_for_db()

    print("📦 Creando tablas...")
    Base.metadata.create_all(bind=engine)

    print("✅ Diagnostico listo")


# =========================
# ROUTES
# =========================
app.include_router(
    diagnostico.router
)


# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {
        "mensaje": "Microservicio diagnóstico funcionando 🔧"
    }