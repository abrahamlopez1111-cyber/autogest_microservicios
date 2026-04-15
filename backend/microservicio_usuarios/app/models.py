from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship

from .database import Base


# =========================
# 👤 USUARIO
# =========================
class Usuario(Base):
    __tablename__ = "usuarios"

    # 🔥 dejamos id_usuarios (para no romper tu sistema actual)
    id_usuarios = Column(Integer, primary_key=True, index=True)

    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    rol = Column(String, nullable=False)

    # 🔥 relación 1 a 1 con perfil
    perfil = relationship(
        "PerfilUsuario",
        back_populates="usuario",
        uselist=False,
        cascade="all, delete"
    )


# =========================
# 📄 PERFIL USUARIO
# =========================
class PerfilUsuario(Base):
    __tablename__ = "perfil_usuario"

    id_personal = Column(Integer, primary_key=True, index=True)

    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id_usuarios", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    telefono = Column(String, nullable=True)
    direccion = Column(String, nullable=True)
    ciudad = Column(String, nullable=True)
    documento = Column(String, nullable=True)
    fecha_nacimiento = Column(Date, nullable=True)

    # 🔥 relación inversa
    usuario = relationship(
        "Usuario",
        back_populates="perfil"
    )