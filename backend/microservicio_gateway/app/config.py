import os

SERVICIOS = {
    "usuarios": os.getenv("USUARIOS_URL"),
    "citas": os.getenv("CITAS_URL"),
    "historial": os.getenv("HISTORIAL_URL"),
    "inventario": os.getenv("INVENTARIO_URL"),
    "diagnostico": os.getenv("DIAGNOSTICO_URL"),
    "facturacion": os.getenv("FACTURACION_URL"),
}