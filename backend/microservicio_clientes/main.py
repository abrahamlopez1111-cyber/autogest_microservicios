from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 🔥 Permitir conexión con frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📌 Ruta de prueba
@app.get("/")
def home():
    return {"mensaje": "Microservicio de clientes funcionando"}

# 📌 Obtener clientes
@app.get("/clientes")
def get_clientes():
    return [
        {"id": 1, "nombre": "Pedro"},
        {"id": 2, "nombre": "Juan"},
        {"id": 3, "nombre": "Maria"}
    ]