from sqlalchemy import and_
from sqlalchemy.orm import Session
import models
import schemas
from datetime import datetime, date
from zoneinfo import ZoneInfo  # 🔥 para manejar zona horaria
import requests

# =========================
# 📅 AGENDA
# =========================
def obtener_agenda_hoy(db: Session):
    hoy = date.today()

    return db.query(models.Cita).filter(
        models.Cita.fecha_hora_inicio >= hoy
    ).all()

# =========================
# 🚀 CREAR CITA
# =========================
def crear_cita(db: Session, cita: schemas.CitaCreate):

    if not cita.usuario_id:
        raise ValueError("El usuario_id es obligatorio")

    # 🔥 VALIDAR SOLAPAMIENTO
    cita_existente = db.query(models.Cita).filter(
        and_(
            models.Cita.mecanico_id == cita.mecanico_id,
            models.Cita.fecha_hora_inicio < cita.fecha_hora_fin,
            models.Cita.fecha_hora_fin > cita.fecha_hora_inicio
        )
    ).first()

    if cita_existente:
        raise ValueError("El mecánico ya tiene una cita en ese horario")

    db_cita = models.Cita(
        sucursal_id=cita.sucursal_id,
        mecanico_id=cita.mecanico_id,
        vehiculo_id=cita.vehiculo_id,
        usuario_id=cita.usuario_id,
        contrato_flota_id=cita.contrato_flota_id,
        fecha_hora_inicio=cita.fecha_hora_inicio,
        fecha_hora_fin=cita.fecha_hora_fin,
        estado=cita.estado
    )

    db.add(db_cita)
    db.commit()
    db.refresh(db_cita)

    return db_cita

# =========================
# 📋 CONSULTAS
# =========================
def obtener_citas(db: Session):
    return db.query(models.Cita).all()

def obtener_cita_por_id(db: Session, cita_id: int):
    return db.query(models.Cita).filter(models.Cita.id == cita_id).first()

def obtener_citas_por_mecanico(db: Session, mecanico_id: int):
    return db.query(models.Cita).filter(models.Cita.mecanico_id == mecanico_id).all()

def obtener_citas_por_fecha(db: Session, fecha):
    return db.query(models.Cita).filter(models.Cita.fecha_hora_inicio >= fecha).all()

# =========================
# ✏️ ACTUALIZAR / CANCELAR
# =========================
def actualizar_cita(db: Session, cita_id: int, cita: schemas.CitaCreate):
    db_cita = db.query(models.Cita).filter(models.Cita.id == cita_id).first()

    if db_cita:
        for key, value in cita.dict().items():
            setattr(db_cita, key, value)

        db.commit()
        db.refresh(db_cita)

    return db_cita

def eliminar_cita(db: Session, cita_id: int):
    cita = db.query(models.Cita).filter(models.Cita.id == cita_id).first()

    if not cita:
        return None

    db.delete(cita)
    db.commit()

    return cita

# =========================
# 🏢 SUCURSALES
# =========================
def obtener_sucursales(db: Session):
    return db.query(models.Sucursal).all()

def crear_sucursal(db: Session, sucursal):
    nueva = models.Sucursal(**sucursal.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

# =========================
# 🔧 MECÁNICOS
# =========================
def obtener_mecanicos(db: Session):
    return db.query(models.Mecanico).all()



def crear_mecanico(db: Session, mecanico):
    
    # 🔥 VALIDAR CONTRA MICROSERVICIO USUARIOS
    try:
        res = requests.get(f"http://usuarios_service:8002/usuarios/{mecanico.usuario_id}")
        usuario = res.json()
    except:
        raise ValueError("Error consultando usuario")

    if usuario.get("rol") != "mecanico":
        raise ValueError("Solo usuarios con rol mecanico pueden ser asignados")

    nuevo = models.Mecanico(**mecanico.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def eliminar_mecanico(db: Session, mecanico_id: int):
    mecanico = db.query(models.Mecanico).filter(models.Mecanico.id == mecanico_id).first()

    if not mecanico:
        return None

    db.delete(mecanico)
    db.commit()

    return mecanico


# =========================
# ⏰ DISPONIBILIDAD
# =========================
HORAS_TRABAJO = [8, 9, 10, 11, 14, 15, 16, 17]

def obtener_horas_ocupadas(db: Session, mecanico_id: int, fecha: str):
    fecha_inicio = datetime.strptime(fecha, "%Y-%m-%d")
    fecha_fin = fecha_inicio.replace(hour=23, minute=59, second=59)

    citas = db.query(models.Cita).filter(
        models.Cita.mecanico_id == mecanico_id,
        models.Cita.fecha_hora_inicio >= fecha_inicio,
        models.Cita.fecha_hora_inicio <= fecha_fin
    ).all()

    horas = []

    for c in citas:
        # 🔥 CONVERSIÓN CORRECTA UTC → COLOMBIA
        hora_local = c.fecha_hora_inicio.astimezone(ZoneInfo("America/Bogota"))
        horas.append(hora_local.hour)

    return horas

def obtener_disponibilidad(db: Session, mecanico_id: int, fecha: str):

    horas_ocupadas = obtener_horas_ocupadas(db, mecanico_id, fecha)

    horas_disponibles = [
        h for h in HORAS_TRABAJO if h not in horas_ocupadas
    ]

    return {
        "ocupadas": horas_ocupadas,
        "disponibles": horas_disponibles
    }