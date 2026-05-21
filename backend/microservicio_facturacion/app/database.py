import os
import time

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# =========================
# TESTING SQLITE
# =========================

TESTING = os.getenv("TESTING")

if TESTING == "1":

    print("🧪 Testing mode SQLite")

    DATABASE_URL = "sqlite:///./test.db"

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

else:

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
# WAIT DB
# =========================

def wait_for_db():

    if TESTING == "1":
        return

    for i in range(30):

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
# DB SESSION
# =========================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()