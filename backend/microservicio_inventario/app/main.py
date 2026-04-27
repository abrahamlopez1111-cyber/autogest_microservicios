from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base, wait_for_db
from app.routes import inventario

app = FastAPI(
    title="Microservicio Inventario",
    version="1.0.0"
)

# ======================
# 🌐 CORS
# ======================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# 🚀 STARTUP
# ======================
@app.on_event("startup")
def startup():
    try:
        print("⏳ Esperando DB inventario...")
        wait_for_db()

        print("📦 Creando tablas inventario...")
        Base.metadata.create_all(bind=engine)

        print("✅ Microservicio inventario listo")

    except Exception as e:
        print(f"❌ Error al iniciar inventario: {e}")
        raise e


# ======================
# 📡 ROUTES
# ======================
app.include_router(
    inventario.router,
    prefix="/inventario",
    tags=["Inventario"]
)


# ======================
# 🏠 ROOT
# ======================
@app.get("/", tags=["Root"])
def root():
    return {
        "mensaje": "Microservicio Inventario funcionando 📦",
        "status": "ok"
    }