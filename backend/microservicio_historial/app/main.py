from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import historial
from app.database import engine, Base, wait_for_db

app = FastAPI(
    title="Microservicio de Historial",
    version="1.0.0"
)

# ======================
# 🌐 CORS
# ======================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción deberías restringir esto
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
        print("⏳ Esperando DB historial...")
        wait_for_db()

        print("📦 Creando tablas historial...")
        Base.metadata.create_all(bind=engine)

        print("✅ Microservicio historial listo")

    except Exception as e:
        print(f"❌ Error al iniciar historial: {e}")
        raise e


# ======================
# 📡 ROUTES
# ======================
app.include_router(
    historial.router,
    prefix="/historial",   # 🔥 buena práctica
    tags=["Historial"]     # 🔥 organización en Swagger
)


# ======================
# 🏠 ROOT
# ======================
@app.get("/", tags=["Root"])
def root():
    return {
        "mensaje": "Historial funcionando 🚗",
        "status": "ok"
    }