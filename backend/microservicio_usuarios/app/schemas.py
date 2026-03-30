from pydantic import BaseModel


# =========================
# 👤 USUARIO BASE
# =========================

class UsuarioBase(BaseModel):
    nombre: str
    email: str
    rol: str


# =========================
# 📝 CREAR USUARIO
# =========================

class UsuarioCreate(UsuarioBase):
    password: str


# =========================
# 📤 RESPUESTA USUARIO (IMPORTANTE)
# =========================

class UsuarioOut(UsuarioBase):
    id_usuarios: int  # 👈 MUY IMPORTANTE (igual que tu DB)

    class Config:
        from_attributes = True  # ✅ Pydantic v2


# =========================
# 🔐 LOGIN
# =========================

class Login(BaseModel):
    email: str
    password: str