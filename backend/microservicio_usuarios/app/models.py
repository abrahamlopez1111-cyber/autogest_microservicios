from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship

from .database import Base

# =========================
# 👤 USUARIO
# =========================
class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuarios = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    rol = Column(String, nullable=False)

    perfil = relationship("PerfilUsuario", back_populates="usuario", uselist=False)


# =========================
# 📄 PERFIL USUARIO
# =========================
class PerfilUsuario(Base):
    __tablename__ = "perfil_usuario"

    id_personal = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id_usuarios", ondelete="CASCADE"), unique=True, nullable=False)

    telefono = Column(String)
    direccion = Column(String)
    ciudad = Column(String)
    documento = Column(String)
    fecha_nacimiento = Column(Date)

    usuario = relationship("Usuario", back_populates="perfil")