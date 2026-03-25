from pydantic import BaseModel

class UsuarioBase(BaseModel):
    nombre: str
    email: str
    rol: str

class UsuarioCreate(UsuarioBase):
    password: str

class Usuario(UsuarioBase):
    id_usuarios: int

    class Config:
        orm_mode = True


class Login(BaseModel):
    email: str
    password: str