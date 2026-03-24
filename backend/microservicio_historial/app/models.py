from sqlalchemy import Column, Integer, String # type: ignore
from app.database import Base

class Historial(Base):
    __tablename__ = "historial"

    id = Column(Integer, primary_key=True, index=True)
    vehiculo = Column(String)
    descripcion = Column(String)