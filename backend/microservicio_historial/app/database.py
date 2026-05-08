import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# Render usa DATABASE_URL
# Local Docker usa la segunda opción por defecto
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:postgres@db_historial:5432/historial"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def wait_for_db():
    for i in range(20):
        try:
            conn = engine.connect()
            conn.close()
            print("✅ DB historial lista")
            return

        except Exception as e:
            print(f"⏳ Esperando DB historial... intento {i+1}: {e}")
            time.sleep(2)

    raise Exception("❌ No se pudo conectar a la DB")


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()