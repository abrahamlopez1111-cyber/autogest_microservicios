-- =========================
-- ESTRUCTURA BASE DE DATOS
-- =========================

CREATE TABLE sucursales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    capacidad_elevadores INTEGER NOT NULL
);

CREATE TABLE contrato_flota (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    politica_autorizacion TEXT
);

CREATE TABLE mecanicos (
    id SERIAL PRIMARY KEY,
    sucursal_id INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_mecanico_sucursal
        FOREIGN KEY (sucursal_id)
        REFERENCES sucursales(id)
);

CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    sucursal_id INTEGER NOT NULL,
    mecanico_id INTEGER NOT NULL,
    vehiculo_id INTEGER NOT NULL,
    contrato_flota_id INTEGER,
    fecha_hora_inicio TIMESTAMPTZ NOT NULL,
    fecha_hora_fin TIMESTAMPTZ NOT NULL,
    estado VARCHAR(50) DEFAULT 'programada',

    CONSTRAINT fk_sucursal
        FOREIGN KEY (sucursal_id)
        REFERENCES sucursales(id),

    CONSTRAINT fk_mecanico
        FOREIGN KEY (mecanico_id)
        REFERENCES mecanicos(id),

    CONSTRAINT fk_contrato
        FOREIGN KEY (contrato_flota_id)
        REFERENCES contrato_flota(id)
);

-- =========================
-- DATOS DE PRUEBA
-- =========================

INSERT INTO sucursales (nombre, pais, capacidad_elevadores)
VALUES
('Sucursal Centro', 'Colombia', 5),
('Sucursal Norte', 'Colombia', 3);

INSERT INTO mecanicos (sucursal_id, nombre)
VALUES
(1, 'Carlos Perez'),
(1, 'Juan Martinez'),
(2, 'Pedro Ramirez');

INSERT INTO contrato_flota (cliente_id, politica_autorizacion)
VALUES
(101, 'Autorización automática'),
(102, 'Requiere aprobación');

-- =========================
-- EJEMPLO DE CITA
-- =========================

INSERT INTO citas (
    sucursal_id,
    mecanico_id,
    vehiculo_id,
    contrato_flota_id,
    fecha_hora_inicio,
    fecha_hora_fin
)
VALUES
(
    1,
    1,
    5001,
    1,
    NOW() + INTERVAL '1 hour',
    NOW() + INTERVAL '2 hour'
);