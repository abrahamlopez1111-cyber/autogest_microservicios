from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, database, models

router = APIRouter(prefix="", tags=["Usuarios"])


# =========================
# 🔌 DB
# =========================
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# 🔹 CREAR USUARIO
# =========================
@router.post("/usuarios", response_model=schemas.UsuarioOut)
def crear_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):

    # 🔥 valor por defecto
    if not usuario.rol:
        usuario.rol = "cliente"

    return crud.crear_usuario(db, usuario)


# =========================
# 🔹 LISTAR USUARIOS
# =========================
@router.get("/usuarios", response_model=list[schemas.UsuarioOut])
def listar_usuarios(db: Session = Depends(get_db)):
    return crud.obtener_usuarios(db)


# =========================
# 🔹 LOGIN
# =========================
@router.post("/login")
def login(data: schemas.Login, db: Session = Depends(get_db)):
    user = crud.login(db, data.email, data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    return {
        "mensaje": "Login exitoso",
        "usuario": {
            "id": user.id_usuarios,  # 🔥 CONSISTENTE
            "id_usuarios": user.id_usuarios,  # 🔥 clave para frontend
            "nombre": user.nombre,
            "email": user.email,
            "rol": user.rol.lower()
        }
    }


# =========================
# 🔹 OBTENER USUARIO POR ID
# =========================
@router.get("/usuarios/{id}")
def obtener_usuario(id: int, db: Session = Depends(get_db)):
    usuario = crud.obtener_usuario_por_id(db, id)

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 🔥 IMPORTANTE: devolver formato consistente
    return {
        "id": usuario.id_usuarios,
        "id_usuarios": usuario.id_usuarios,
        "nombre": usuario.nombre,
        "email": usuario.email,
        "rol": usuario.rol.lower()
    }


# =========================
# 🔹 ACTUALIZAR USUARIO
# =========================
@router.put("/usuarios/{id}", response_model=schemas.UsuarioOut)
def actualizar_usuario(id: int, datos: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(
        models.Usuario.id_usuarios == id
    ).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario.nombre = datos.nombre
    usuario.email = datos.email
    usuario.password = datos.password
    usuario.rol = datos.rol

    db.commit()
    db.refresh(usuario)

    return usuario


# =========================
# 🔹 ELIMINAR USUARIO
# =========================
@router.delete("/usuarios/{id}")
def eliminar_usuario(id: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(
        models.Usuario.id_usuarios == id
    ).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(usuario)
    db.commit()

    return {"mensaje": "Usuario eliminado"}


# =========================
# 🔥 VALIDACIÓN PARA MICROSERVICIOS
# =========================
@router.get("/usuarios/{id}/es-mecanico")
def es_mecanico(id: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(
        models.Usuario.id_usuarios == id
    ).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return {
        "id": usuario.id_usuarios,
        "es_mecanico": usuario.rol.lower() == "mecanico"
    }