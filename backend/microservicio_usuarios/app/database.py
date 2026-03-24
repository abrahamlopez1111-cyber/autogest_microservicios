import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres:postgres@microservicio_usuarios:5432/microservicio_usuarios"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


def wait_for_db():
    for i in range(10):
        try:
            connection = engine.connect()
            connection.close()
            print("✅ Conectado a la base de datos")
            return
        except Exception:
            print("⏳ Esperando base de datos...")
            time.sleep(3)

    raise Exception("❌ No se pudo conectar a la base de datos")