from pydantic import BaseModel
from typing import Optional
from datetime import date

# =========================
# 👤 USUARIO
# =========================
class UsuarioBase(BaseModel):
    nombre: str
    email: str
    rol: str


class UsuarioCreate(UsuarioBase):
    password: str


class UsuarioOut(UsuarioBase):
    id_usuarios: int

    class Config:
        from_attributes = True


# =========================
# 🔐 LOGIN
# =========================
class Login(BaseModel):
    email: str
    password: str


# =========================
# 📄 PERFIL USUARIO
# =========================
class PerfilCreate(BaseModel):
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    documento: Optional[str] = None
    fecha_nacimiento: Optional[date] = None


class PerfilOut(BaseModel):
    id_personal: int
    usuario_id: int
    telefono: Optional[str]
    direccion: Optional[str]
    ciudad: Optional[str]
    documento: Optional[str]
    fecha_nacimiento: Optional[date]

    class Config:
        from_attributes = True