import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL")

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
            print("✅ DB usuarios lista")
            return
        except Exception as e:
            print(f"⏳ Esperando DB usuarios... intento {i+1}: {e}")
            time.sleep(2)

    raise Exception("❌ No se pudo conectar a la DB")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()