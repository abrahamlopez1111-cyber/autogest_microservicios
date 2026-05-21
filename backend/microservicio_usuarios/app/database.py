import os
import time

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# =========================================
# PRIORIDAD:
# 1. TEST_DATABASE_URL (pytest)
# 2. DATABASE_URL (Render)
# 3. PostgreSQL Docker/local
# =========================================

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")
DATABASE_URL = os.getenv("DATABASE_URL")

# =========================
# SQLITE PARA TESTS
# =========================
if TEST_DATABASE_URL:

    DATABASE_URL = TEST_DATABASE_URL

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

# =========================
# POSTGRESQL NORMAL
# =========================
else:

    if not DATABASE_URL:

        DB_HOST = os.getenv("DB_HOST", "localhost")
        DB_PORT = os.getenv("DB_PORT", "5432")
        DB_NAME = os.getenv("DB_NAME", "usuarios")
        DB_USER = os.getenv("DB_USER", "postgres")
        DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

        DATABASE_URL = (
            f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}"
            f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        )

    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True
    )

# =========================
# SESSION
# =========================

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

    # SQLITE NO NECESITA WAIT
    if DATABASE_URL.startswith("sqlite"):
        print("✅ SQLite lista")
        return

    for i in range(20):

        try:

            conn = engine.connect()
            conn.close()

            print("✅ DB usuarios lista")
            return

        except Exception as e:

            print(f"⏳ Esperando DB usuarios... intento {i+1}: {e}")
            time.sleep(2)

    raise Exception("❌ No se pudo conectar a la DB")

# =========================
# GET DB
# =========================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
