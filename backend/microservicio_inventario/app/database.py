import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_HOST = os.getenv("DB_HOST", "db_inventario")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "inventario")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def wait_for_db():
    for i in range(10):
        try:
            conn = engine.connect()
            conn.close()
            print("✅ DB inventario lista")
            return
        except Exception:
            print("⏳ Esperando DB inventario...")
            time.sleep(3)

    raise Exception("❌ No conecta DB inventario")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()