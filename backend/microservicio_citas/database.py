import os
import time

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# ==========================================
# DETECTAR SI ESTAMOS EN TESTS
# ==========================================

TESTING = os.getenv("TESTING", "0") == "1"

# ==========================================
# DATABASE URL
# ==========================================

if TESTING:

    DATABASE_URL = "sqlite:///./test.db"

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

else:

    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:

        DB_HOST = os.getenv("DB_HOST", "localhost")
        DB_PORT = os.getenv("DB_PORT", "5432")
        DB_NAME = os.getenv("DB_NAME", "citas")
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

# ==========================================
# SESSION
# ==========================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# ==========================================
# WAIT FOR DB
# ==========================================

def wait_for_db():

    if TESTING:
        print("✅ SQLite test DB lista")
        return

    for i in range(20):

        try:

            conn = engine.connect()
            conn.close()

            print("✅ DB citas lista")
            return

        except Exception as e:

            print(f"⏳ Esperando DB citas... intento {i+1}: {e}")
            time.sleep(2)

    raise Exception("❌ No se pudo conectar a la DB")

# ==========================================
# GET DB
# ==========================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()