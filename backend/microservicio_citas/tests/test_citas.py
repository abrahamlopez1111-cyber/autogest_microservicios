from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from database import Base, get_db

# =========================
# SQLITE TEST DATABASE
# =========================

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# =========================
# CREAR TABLAS
# =========================

Base.metadata.create_all(bind=engine)

# =========================
# OVERRIDE DB
# =========================

def override_get_db():

    db = TestingSessionLocal()

    try:
        yield db

    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# =========================
# ROOT
# =========================

def test_root():

    response = client.get("/")

    assert response.status_code == 200


# =========================
# LISTAR CITAS
# =========================

def test_listar_citas():

    response = client.get("/citas")

    assert response.status_code == 200


# =========================
# DISPONIBILIDAD
# =========================

def test_disponibilidad():

    response = client.get(
        "/citas/disponibilidad/1/2026-05-20"
    )

    assert response.status_code == 200


# =========================
# SUCURSALES
# =========================

def test_sucursales():

    response = client.get("/sucursales")

    assert response.status_code == 200


# =========================
# MECANICOS
# =========================

def test_mecanicos():

    response = client.get("/mecanicos")

    assert response.status_code == 200


# =========================
# CREAR CITA
# =========================

def test_crear_cita():

    response = client.post(
        "/citas",
        json={
            "sucursal_id": 1,
            "mecanico_id": 1,
            "vehiculo_id": 1,
            "contrato_flota_id": None,
            "fecha_hora_inicio": "2026-06-01T10:00:00",
            "fecha_hora_fin": "2026-06-01T11:00:00",
            "observacion_cliente": "Prueba pytest",
            "usuario_id": 2,
            "estado": "programada"
        }
    )

    assert response.status_code in [200, 201, 400]


# =========================
# OBTENER CITA
# =========================

def test_obtener_cita():

    response = client.get("/citas/1")

    assert response.status_code in [200, 404]


# =========================
# CAMBIAR ESTADO
# =========================

def test_cambiar_estado():

    response = client.put(
        "/citas/1/estado/recibida"
    )

    assert response.status_code in [200, 404]


# =========================
# RECIBIR CITA
# =========================

def test_recibir_cita():

    response = client.put(
        "/citas/1/recibir",
        json={
            "kilometraje": 120000,
            "observaciones": "Vehiculo recibido correctamente"
        }
    )

    assert response.status_code in [200, 400, 404]