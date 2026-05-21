from fastapi.testclient import TestClient
from app.main import app

from app.database import Base, engine
from app import models

# Crear tablas para testing
Base.metadata.create_all(bind=engine)

client = TestClient(app)

# =========================
# ROOT
# =========================

def test_root():

    response = client.get("/docs")

    assert response.status_code == 200


# =========================
# LISTAR USUARIOS
# =========================

def test_listar_usuarios():

    response = client.get("/usuarios")

    assert response.status_code == 200


# =========================
# CREAR USUARIO
# =========================

def test_crear_usuario():

    response = client.post(
        "/usuarios",
        json={
            "nombre": "pytest_user",
            "email": "pytest@gmail.com",
            "password": "1234",
            "rol": "cliente"
        }
    )

    assert response.status_code in [200, 201]


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

    assert response.status_code in [200, 401]


# =========================
# OBTENER USUARIO
# =========================

def test_obtener_usuario():

    response = client.get("/usuarios/1")

    assert response.status_code in [200, 404]


# =========================
# ACTUALIZAR USUARIO
# =========================

def test_actualizar_usuario():

    response = client.put(
        "/usuarios/1",
        json={
            "nombre": "usuario_actualizado",
            "email": "actualizado@gmail.com",
            "password": "1234",
            "rol": "cliente"
        }
    )

    assert response.status_code in [200, 404]


# =========================
# VALIDAR MECANICO
# =========================

def test_es_mecanico():

    response = client.get(
        "/usuarios/1/es-mecanico"
    )

    assert response.status_code in [200, 404]


# =========================
# LISTAR RECEPCIONISTAS
# =========================

def test_recepcionistas():

    response = client.get("/recepcionistas")

    assert response.status_code == 200


# =========================
# LISTAR MECANICOS
# =========================

def test_mecanicos():

    response = client.get("/mecanicos")

    assert response.status_code == 200


# =========================
# CREAR PERFIL
# =========================

def test_crear_perfil():

    response = client.post(
        "/perfil/1",
        json={
            "telefono": "3001234567",
            "direccion": "Monteria",
            "foto_url": "https://foto.com/test.jpg"
        }
    )

    assert response.status_code in [200, 201, 400, 404]


# =========================
# OBTENER PERFIL
# =========================

def test_obtener_perfil():

    response = client.get("/perfil/1")

    assert response.status_code in [200, 404]


# =========================
# ACTUALIZAR PERFIL
# =========================

def test_actualizar_perfil():

    response = client.put(
        "/perfil/1",
        json={
            "telefono": "3119999999",
            "direccion": "Cordoba",
            "foto_url": "https://foto.com/update.jpg"
        }
    )

    assert response.status_code in [200, 400, 404]