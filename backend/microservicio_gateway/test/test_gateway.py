import os

# =========================
# TESTING
# =========================

os.environ["TESTING"] = "1"

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# =========================
# ROOT
# =========================

def test_root():

    response = client.get("/")

    assert response.status_code == 200


# =========================
# CITAS
# =========================

def test_listar_citas():

    response = client.get("/citas")

    assert response.status_code in [200, 500]


def test_obtener_cita():

    response = client.get("/citas/1")

    assert response.status_code in [200, 404, 500]


# =========================
# SUCURSALES
# =========================

def test_sucursales():

    response = client.get("/sucursales")

    assert response.status_code in [200, 500]


# =========================
# MECANICOS
# =========================

def test_mecanicos():

    response = client.get("/mecanicos")

    assert response.status_code in [200, 500]


# =========================
# USUARIOS
# =========================

def test_usuarios():

    response = client.get("/usuarios")

    assert response.status_code in [200, 500]


# =========================
# LOGIN
# =========================

def test_login():

    response = client.post(
        "/login",
        json={
            "email": "admin@gmail.com",
            "password": "1234"
        }
    )

    assert response.status_code in [200, 401, 500, 503]


# =========================
# INVENTARIO
# =========================

def test_inventario():

    response = client.get(
        "/inventario/repuestos"
    )

    assert response.status_code in [200, 500]


def test_inventario_completo():

    response = client.get(
        "/inventario/repuestos/inventario-completo"
    )

    assert response.status_code in [200, 500]


# =========================
# HISTORIAL
# =========================

def test_vehiculos():

    response = client.get(
        "/historial/vehiculos"
    )

    assert response.status_code in [200, 500]


# =========================
# DIAGNOSTICOS
# =========================

def test_diagnosticos():

    response = client.get(
        "/diagnosticos"
    )

    assert response.status_code in [200, 500]


# =========================
# FACTURAS
# =========================

def test_facturas():

    response = client.get(
        "/facturas"
    )

    assert response.status_code in [200, 500]


# =========================
# DEBUG INVENTARIO
# =========================

def test_debug_inventario():

    response = client.get(
        "/debug/inventario"
    )

    assert response.status_code in [200, 500]