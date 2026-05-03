from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base, wait_for_db

# 🔥 IMPORTAMOS FACTURACION
from app.routes import facturacion


app = FastAPI(
    title="Microservicio Facturación",
    version="1.0.0"
)


# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# STARTUP
# =========================
@app.on_event("startup")
def startup():

    print("⏳ Esperando DB facturación...")

    wait_for_db()

    print("📦 Creando tablas...")

    Base.metadata.create_all(
        bind=engine
    )

    print("✅ Facturación lista")


# =========================
# ROUTES
# =========================
app.include_router(
    facturacion.router
)


# =========================
# ROOT
# =========================
@app.get("/")
def root():

    return {
        "mensaje": "Microservicio facturación activo 💰"
    }