import os

# 🔥 ACTIVAR TESTING
os.environ["TESTING"] = "1"

from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine

# 🔥 CREAR TABLAS SQLITE
Base.metadata.create_all(bind=engine)

client = TestClient(app)

# =========================
# ROOT
# =========================

def test_root():

    response = client.get("/")

    assert response.status_code == 200


# =========================
# LISTAR DIAGNOSTICOS
# =========================

def test_listar_diagnosticos():

    response = client.get("/diagnosticos/")

    assert response.status_code == 200


# =========================
# CREAR DIAGNOSTICO
# =========================

def test_crear_diagnostico():

    response = client.post(
        "/diagnosticos/",
        json={
            "cita_id": 1,
            "descripcion_falla": "Falla en frenos",
            "reparacion_realizada": "Cambio de pastillas",
            "mano_obra": 150000,
            "repuestos": [
                {
                    "repuesto_id": 1,
                    "cantidad": 2
                }
            ]
        }
    )

    assert response.status_code == 200


# =========================
# OBTENER POR CITA
# =========================

def test_obtener_diagnostico_por_cita():

    response = client.get(
        "/diagnosticos/cita/1"
    )

    assert response.status_code in [200, 404]