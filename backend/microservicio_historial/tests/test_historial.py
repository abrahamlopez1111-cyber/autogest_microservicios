from fastapi.testclient import TestClient

import time

from app.main import app
from app.database import get_db
from tests.test_database import (
    override_get_db,
    crear_tablas
)

# =========================
# OVERRIDE DB
# =========================

app.dependency_overrides[get_db] = override_get_db

# =========================
# CREAR TABLAS SQLITE
# =========================

crear_tablas()

client = TestClient(app)

# =========================
# ROOT
# =========================

def test_root():

    response = client.get("/")

    assert response.status_code == 200


# =========================
# CREAR VEHICULO
# =========================

def test_crear_vehiculo():

    response = client.post(
        "/historial/vehiculos",
        json={
            "usuario_id": 1,
            "placa": f"ABC{int(time.time())}",
            "marca": "Toyota",
            "modelo": "Corolla",
            "anio_fabricacion": 2020
        }
    )

    assert response.status_code == 200

# =========================
# LISTAR VEHICULOS
# =========================

def test_listar_vehiculos():

    response = client.get(
        "/historial/vehiculos"
    )

    assert response.status_code == 200


# =========================
# VEHICULOS POR USUARIO
# =========================

def test_vehiculos_usuario():

    response = client.get(
        "/historial/vehiculos/usuario/1"
    )

    assert response.status_code == 200


# =========================
# CREAR SERVICIO
# =========================

def test_crear_servicio():

    response = client.post(
        "/historial/servicios",
        json={
            "vehiculo_id": 1,
            "sucursal_id": 1,
            "fecha_servicio": "2026-06-01",
            "kilometraje": 120000,
            "observaciones": "Cambio de aceite",
            "diagnostico": "Motor en buen estado",
            "recomendacion": "Próximo cambio en 5000 km",
            "precio_mano_obra": 150000
        }
    )

    assert response.status_code == 200


# =========================
# HISTORIAL VEHICULO
# =========================

def test_historial_vehiculo():

    response = client.get(
        "/historial/vehiculos/1/servicios"
    )

    assert response.status_code == 200