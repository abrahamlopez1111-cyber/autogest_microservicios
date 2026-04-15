<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 888a0433c32c88dc9f25d7d408f7a7fcccc7a3f1
--
-- PostgreSQL database dump
--

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

CREATE TABLE public.catalogo_repuestos (
    id integer NOT NULL,
    codigo_inventario character varying(50) NOT NULL,
    descripcion character varying(255) NOT NULL,
    requiere_lote boolean DEFAULT false,
    punto_pedido_global integer DEFAULT 0
);


ALTER TABLE public.catalogo_repuestos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16557)
-- Name: catalogo_repuestos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_repuestos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_repuestos_id_seq OWNER TO postgres;

--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 219
-- Name: catalogo_repuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_repuestos_id_seq OWNED BY public.catalogo_repuestos.id;


--
-- TOC entry 224 (class 1259 OID 16607)
-- Name: lotes_inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lotes_inventario (
    id_lotes integer NOT NULL,
    catalogo_repuestos_id integer NOT NULL,
    sucursal_id integer NOT NULL,
    codigo_lote character varying(100),
    fecha_caducidad date,
    cantidad_lote integer NOT NULL
);


ALTER TABLE public.lotes_inventario OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16606)
-- Name: lotes_inventario_id_lotes_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lotes_inventario_id_lotes_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lotes_inventario_id_lotes_seq OWNER TO postgres;

--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 223
-- Name: lotes_inventario_id_lotes_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lotes_inventario_id_lotes_seq OWNED BY public.lotes_inventario.id_lotes;


--
-- TOC entry 222 (class 1259 OID 16593)
-- Name: stock_sucursal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_sucursal (
    id integer NOT NULL,
    sucursal_id integer,
    catalogo_repuestos_id integer NOT NULL,
    cantidad_disponible integer
);


ALTER TABLE public.stock_sucursal OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16592)
-- Name: stock_sucursal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_sucursal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_sucursal_id_seq OWNER TO postgres;

--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 221
-- Name: stock_sucursal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_sucursal_id_seq OWNED BY public.stock_sucursal.id;


--
-- TOC entry 226 (class 1259 OID 16623)
-- Name: transferencias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transferencias (
    id_transferencias integer NOT NULL,
    catalogo_repuestos_id integer NOT NULL,
    sucursal_origen_id integer NOT NULL,
    sucursal_destino_id integer NOT NULL,
    cantidad integer NOT NULL,
    estado character varying(50) DEFAULT 'PENDIENTE'::character varying
);


ALTER TABLE public.transferencias OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16622)
-- Name: transferencias_id_transferencias_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transferencias_id_transferencias_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transferencias_id_transferencias_seq OWNER TO postgres;

--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 225
-- Name: transferencias_id_transferencias_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transferencias_id_transferencias_seq OWNED BY public.transferencias.id_transferencias;


--
-- TOC entry 4871 (class 2604 OID 16561)
-- Name: catalogo_repuestos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_repuestos ALTER COLUMN id SET DEFAULT nextval('public.catalogo_repuestos_id_seq'::regclass);


--
-- TOC entry 4875 (class 2604 OID 16610)
-- Name: lotes_inventario id_lotes; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lotes_inventario ALTER COLUMN id_lotes SET DEFAULT nextval('public.lotes_inventario_id_lotes_seq'::regclass);


--
-- TOC entry 4874 (class 2604 OID 16596)
-- Name: stock_sucursal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_sucursal ALTER COLUMN id SET DEFAULT nextval('public.stock_sucursal_id_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 16626)
-- Name: transferencias id_transferencias; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias ALTER COLUMN id_transferencias SET DEFAULT nextval('public.transferencias_id_transferencias_seq'::regclass);


--
-- TOC entry 5039 (class 0 OID 16558)
-- Dependencies: 220
-- Data for Name: catalogo_repuestos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_repuestos (id, codigo_inventario, descripcion, requiere_lote, punto_pedido_global) FROM stdin;
\.


--
-- TOC entry 5043 (class 0 OID 16607)
-- Dependencies: 224
-- Data for Name: lotes_inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lotes_inventario (id_lotes, catalogo_repuestos_id, sucursal_id, codigo_lote, fecha_caducidad, cantidad_lote) FROM stdin;
\.


--
-- TOC entry 5041 (class 0 OID 16593)
-- Dependencies: 222
-- Data for Name: stock_sucursal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_sucursal (id, sucursal_id, catalogo_repuestos_id, cantidad_disponible) FROM stdin;
\.


--
-- TOC entry 5045 (class 0 OID 16623)
-- Dependencies: 226
-- Data for Name: transferencias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transferencias (id_transferencias, catalogo_repuestos_id, sucursal_origen_id, sucursal_destino_id, cantidad, estado) FROM stdin;
\.


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 219
-- Name: catalogo_repuestos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_repuestos_id_seq', 1, false);


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 223
-- Name: lotes_inventario_id_lotes_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lotes_inventario_id_lotes_seq', 1, false);


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 221
-- Name: stock_sucursal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_sucursal_id_seq', 1, false);


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 225
-- Name: transferencias_id_transferencias_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transferencias_id_transferencias_seq', 1, false);


--
-- TOC entry 4887 (class 2606 OID 16634)
-- Name: transferencias PK_id_transferencias; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias
    ADD CONSTRAINT "PK_id_transferencias" PRIMARY KEY (id_transferencias);


--
-- TOC entry 4879 (class 2606 OID 16570)
-- Name: catalogo_repuestos codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_repuestos
    ADD CONSTRAINT codigo UNIQUE (codigo_inventario);


--
-- TOC entry 4881 (class 2606 OID 16568)
-- Name: catalogo_repuestos pk_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_repuestos
    ADD CONSTRAINT pk_id PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 16616)
-- Name: lotes_inventario pk_id_lotes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lotes_inventario
    ADD CONSTRAINT pk_id_lotes PRIMARY KEY (id_lotes);


--
-- TOC entry 4883 (class 2606 OID 16600)
-- Name: stock_sucursal pk_id_stock; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_sucursal
    ADD CONSTRAINT pk_id_stock PRIMARY KEY (id);


--
-- TOC entry 4888 (class 2606 OID 16601)
-- Name: stock_sucursal fk_catalogo_repuestos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_sucursal
    ADD CONSTRAINT fk_catalogo_repuestos FOREIGN KEY (catalogo_repuestos_id) REFERENCES public.catalogo_repuestos(id);


--
-- TOC entry 4889 (class 2606 OID 16617)
-- Name: lotes_inventario fk_catalogo_repuestos_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lotes_inventario
    ADD CONSTRAINT fk_catalogo_repuestos_id FOREIGN KEY (catalogo_repuestos_id) REFERENCES public.catalogo_repuestos(id);


--
-- TOC entry 4890 (class 2606 OID 16635)
-- Name: transferencias fk_catalogo_repuestos_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias
    ADD CONSTRAINT fk_catalogo_repuestos_id FOREIGN KEY (catalogo_repuestos_id) REFERENCES public.catalogo_repuestos(id);


-- Completed on 2026-03-22 08:47:37

--
-- PostgreSQL database dump complete
--



<<<<<<< HEAD
=======
-- =========================
-- ESTRUCTURA BASE DE DATOS
-- MICROSERVICIO HISTORIAL
-- =========================

-- =========================
-- TABLA VEHICULOS
-- =========================
=======

-- 
-- ESTRUCTURA BASE DE DATOS
-- MICROSERVICIO HISTORIAL
-- 

-- 
-- TABLA VEHICULOS
-- 
>>>>>>> 888a0433c32c88dc9f25d7d408f7a7fcccc7a3f1
CREATE TABLE vehiculos (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(10) NOT NULL UNIQUE,
    propietario VARCHAR(100) NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    anio INTEGER,
    color VARCHAR(50)
);

<<<<<<< HEAD
-- =========================
-- TABLA TIPOS DE SERVICIO
-- =========================
=======
-- 
-- TABLA TIPOS DE SERVICIO
-- 
>>>>>>> 888a0433c32c88dc9f25d7d408f7a7fcccc7a3f1
CREATE TABLE tipos_servicio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

<<<<<<< HEAD
-- =========================
-- TABLA HISTORIAL
-- =========================
=======
-- 
-- TABLA HISTORIAL
-- 
>>>>>>> 888a0433c32c88dc9f25d7d408f7a7fcccc7a3f1
CREATE TABLE historial (
    id SERIAL PRIMARY KEY,
    vehiculo_id INTEGER NOT NULL,
    tipo_servicio_id INTEGER NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vehiculo
        FOREIGN KEY (vehiculo_id)
        REFERENCES vehiculos(id),

    CONSTRAINT fk_tipo_servicio
        FOREIGN KEY (tipo_servicio_id)
        REFERENCES tipos_servicio(id)
);

<<<<<<< HEAD
-- =========================
-- DATOS DE PRUEBA
-- =========================
=======
-- 
-- DATOS DE PRUEBA
-- 
>>>>>>> 888a0433c32c88dc9f25d7d408f7a7fcccc7a3f1

-- VEHICULOS
INSERT INTO vehiculos (placa, propietario, marca, modelo, anio, color)
VALUES
('ABC123', 'Juan Perez', 'Toyota', 'Corolla', 2020, 'Rojo'),
('XYZ789', 'Maria Gomez', 'Chevrolet', 'Spark', 2018, 'Blanco'),
('LMN456', 'Carlos Ruiz', 'Mazda', 'CX-5', 2022, 'Negro');

-- TIPOS DE SERVICIO
INSERT INTO tipos_servicio (nombre)
VALUES
('Mantenimiento'),
('Reparación'),
('Inspección');

-- HISTORIAL
INSERT INTO historial (
    vehiculo_id,
    tipo_servicio_id,
    descripcion
)
VALUES
(1, 1, 'Cambio de aceite'),
(2, 2, 'Reparación de frenos'),
(3, 3, 'Revisión general');
<<<<<<< HEAD
>>>>>>> 693fb39 (Microservicios con historial de vehiculos y clientes con 8 endpoints)
=======

>>>>>>> 888a0433c32c88dc9f25d7d408f7a7fcccc7a3f1
