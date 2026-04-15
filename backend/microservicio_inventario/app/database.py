from sqlalchemy import create_engine # type: ignore
from sqlalchemy.orm import sessionmaker, declarative_base # type: ignore
import time

DATABASE_URL = "postgresql://postgres:postgres@microservicio_inventario:5432/inventario"

engine = None

# Esperar a que la base de datos esté disponible
for i in range(10):
    try:
        engine = create_engine(DATABASE_URL)
        connection = engine.connect()
        connection.close()
        print("✅ Conectado a la base de datos inventario")
        break
    except Exception as e:
        print("⏳ Esperando base de datos inventario...")
        time.sleep(3)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()