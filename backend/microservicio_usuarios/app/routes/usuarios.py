from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, database, models

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


@router.delete("/usuarios/{id}")
def eliminar_usuario(id: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id_usuarios == id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(usuario)
    db.commit()

    return {"mensaje": "Usuario eliminado"}



@router.put("/usuarios/{id}")
def actualizar_usuario(id: int, datos: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id_usuarios == id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario.nombre = datos.nombre
    usuario.email = datos.email
    usuario.password = datos.password
    usuario.rol = datos.rol

    db.commit()
    db.refresh(usuario)

    return usuario