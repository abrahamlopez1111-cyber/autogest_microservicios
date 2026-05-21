import os

# 🔥 ACTIVAR TESTING ANTES DE IMPORTAR APP
os.environ["TESTING"] = "1"

from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine

# 🔥 IMPORTANTE:
# crear tablas SQLite para testing
Base.metadata.create_all(bind=engine)

client = TestClient(app)

# =========================
# ROOT
# =========================

def test_root():

    response = client.get("/")

    assert response.status_code == 200


# =========================
# LISTAR REPUESTOS
# =========================

def test_listar_repuestos():

    response = client.get("/inventario/repuestos/")

    assert response.status_code == 200


# =========================
# CREAR REPUESTO
# =========================

def test_crear_repuesto():

    response = client.post(
        "/inventario/repuestos/",
        json={
            "nombre": "Filtro Aceite",
            "precio": 35000
        }
    )

    assert response.status_code == 200


# =========================
# OBTENER REPUESTO
# =========================

def test_obtener_repuesto():

    response = client.get(
        "/inventario/repuestos/1"
    )

    assert response.status_code in [200, 404]


# =========================
# CREAR STOCK
# =========================

def test_crear_stock():

    response = client.post(
        "/inventario/repuestos/stock",
        json={
            "sucursal_id": 1,
            "catalogo_repuestos_id": 1,
            "cantidad_disponible": 10
        }
    )

    assert response.status_code == 200


# =========================
# STOCK POR SUCURSAL
# =========================

def test_stock_por_sucursal():

    response = client.get(
        "/inventario/repuestos/stock/1"
    )

    assert response.status_code == 200


# =========================
# DISPONIBILIDAD
# =========================

def test_disponibilidad():

    response = client.get(
        "/inventario/repuestos/disponibilidad/1/1"
    )

    assert response.status_code == 200


# =========================
# INVENTARIO COMPLETO
# =========================

def test_inventario_completo():

    response = client.get(
        "/inventario/repuestos/inventario-completo"
    )

    assert response.status_code == 200