-- =========================
-- TABLA HISTORIAL VEHICULOS
-- =========================

CREATE TABLE IF NOT EXISTS historial_vehiculos (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(10) NOT NULL,
    propietario VARCHAR(100) NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    anio INT,
    color VARCHAR(30),
    tipo_servicio VARCHAR(50),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- DATOS DE PRUEBA
-- =========================

INSERT INTO historial_vehiculos 
(placa, propietario, marca, modelo, anio, color, tipo_servicio)
VALUES
('ABC123', 'Juan Perez', 'Toyota', 'Corolla', 2020, 'Rojo', 'Mantenimiento'),
('XYZ789', 'Maria Gomez', 'Chevrolet', 'Spark', 2018, 'Blanco', 'Reparación'),
('LMN456', 'Carlos Ruiz', 'Mazda', 'CX-5', 2022, 'Negro', 'Inspección');