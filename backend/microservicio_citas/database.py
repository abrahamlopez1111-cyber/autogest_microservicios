import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres:postgres@microservicio_citas:5432/microservicio_citas"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

def wait_for_db():
    for i in range(10):
        try:
            connection = engine.connect()
            connection.close()
            print("✅ Conectado a DB citas")
            return
        except Exception:
            print("⏳ Esperando DB citas...")
            time.sleep(3)

    raise Exception("❌ No conecta DB citas")