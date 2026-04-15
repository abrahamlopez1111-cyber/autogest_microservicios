CREATE DATABASE inventario;

\c inventario;

DROP TABLE IF EXISTS catalogo_repuestos;

CREATE TABLE catalogo_repuestos (
    id SERIAL PRIMARY KEY,
    codigo_inventario VARCHAR(50),
    nombre VARCHAR(100),
    descripcion VARCHAR(100),
    cantidad INT,
    precio DECIMAL
);