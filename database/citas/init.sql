-- =====================================
-- INIT.SQL - AUTOGEST CITAS
-- =====================================

-- =========================
-- LIMPIEZA (opcional)
-- =========================
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS mecanicos CASCADE;
DROP TABLE IF EXISTS contrato_flota CASCADE;
DROP TABLE IF EXISTS sucursales CASCADE;

-- =========================
-- TABLAS
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
    usuario_id INTEGER NOT NULL UNIQUE,
    sucursal_id INTEGER NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id)
);

CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    sucursal_id INTEGER NOT NULL,
    mecanico_id INTEGER NOT NULL,
    vehiculo_id INTEGER NOT NULL,
    usuario_id INTEGER,
    contrato_flota_id INTEGER,
    fecha_hora_inicio TIMESTAMPTZ NOT NULL,
    fecha_hora_fin TIMESTAMPTZ NOT NULL,
    estado VARCHAR(50) DEFAULT 'programada',
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id),
    FOREIGN KEY (mecanico_id) REFERENCES mecanicos(id),
    FOREIGN KEY (contrato_flota_id) REFERENCES contrato_flota(id)
);

-- =========================
-- DATOS DE PRUEBA
-- =========================

INSERT INTO sucursales (nombre, pais, capacidad_elevadores)
VALUES
('Sucursal Centro', 'Colombia', 5),
('Sucursal Norte', 'Colombia', 3);

INSERT INTO contrato_flota (cliente_id, politica_autorizacion)
VALUES
(101, 'Autorización automática'),
(102, 'Requiere aprobación');

INSERT INTO mecanicos (usuario_id, sucursal_id)
VALUES
(1, 1),
(2, 1);