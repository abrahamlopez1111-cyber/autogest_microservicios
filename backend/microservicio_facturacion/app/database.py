import os
import time

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# =========================
# PRIORIDAD:
# 1. DATABASE_URL (Render)
# 2. Docker/local
# =========================

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:

    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_NAME", "facturacion")
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

    DATABASE_URL = (
        f"postgresql://{DB_USER}:{DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

# =========================
# ENGINE
# =========================

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# =========================
# ESPERAR DB
# =========================

def wait_for_db():

    for _ in range(30):

        try:
            conn = engine.connect()
            conn.close()

            print("✅ DB facturacion lista")
            return

        except Exception as e:

            print(f"⏳ Esperando DB facturacion... {e}")
            time.sleep(2)

    raise Exception("❌ No se pudo conectar a facturacion")

# =========================
# SESION DB
# =========================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()