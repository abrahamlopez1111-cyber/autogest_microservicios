FROM python:3.11

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar dependencias
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código
COPY . .

# Puerto donde corre FastAPI
EXPOSE 8000

# Comando para ejecutar la API
CMD ["sh", "-c", "sleep 10 && uvicorn main:app --host 0.0.0.0 --port 8000"]