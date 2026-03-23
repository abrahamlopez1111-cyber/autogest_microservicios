from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, database

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔹 Crear usuario
@router.post("/usuarios")
def crear(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return crud.crear_usuario(db, usuario)

# 🔹 Listar usuarios
@router.get("/usuarios")
def listar(db: Session = Depends(get_db)):
    return crud.obtener_usuarios(db)

# 🔹 Login
@router.post("/login")
def login(data: schemas.Login, db: Session = Depends(get_db)):
    user = crud.login(db, data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    return {"mensaje": "Login exitoso", "usuario": user}