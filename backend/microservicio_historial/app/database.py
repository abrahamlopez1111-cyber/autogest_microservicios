from sqlalchemy import create_engine # type: ignore
from sqlalchemy.orm import sessionmaker, declarative_base # type: ignore

DATABASE_URL = "postgresql://postgres:postgres@microservicio_historial:5432/microservicio_historial"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()