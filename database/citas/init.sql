--
-- PostgreSQL database dump
--

\restrict VqHw0DwJ7WqnjBedQXbvxs8ueBERGsU4ypGW1uoUa7jMOtNNXqcAekOxyu9PQw9

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-27 17:30:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16418)
-- Name: citas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.citas (
    id integer NOT NULL,
    sucursal_id integer NOT NULL,
    mecanico_id integer NOT NULL,
    vehiculo_id integer NOT NULL,
    usuario_id integer NOT NULL,
    contrato_flota_id integer,
    fecha_hora_inicio timestamp with time zone NOT NULL,
    fecha_hora_fin timestamp with time zone NOT NULL,
    estado character varying(50) DEFAULT 'programada'::character varying,
    observacion_cliente text,
    CONSTRAINT citas_check CHECK ((fecha_hora_fin > fecha_hora_inicio)),
    CONSTRAINT citas_estado_check CHECK (((estado)::text = ANY ((ARRAY['programada'::character varying, 'cancelada'::character varying, 'finalizada'::character varying])::text[])))
);


ALTER TABLE public.citas OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16417)
-- Name: citas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.citas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.citas_id_seq OWNER TO postgres;

--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 220
-- Name: citas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.citas_id_seq OWNED BY public.citas.id;


--
-- TOC entry 217 (class 1259 OID 16394)
-- Name: contrato_flota; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contrato_flota (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    politica_autorizacion text
);


ALTER TABLE public.contrato_flota OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16393)
-- Name: contrato_flota_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contrato_flota_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contrato_flota_id_seq OWNER TO postgres;

--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 216
-- Name: contrato_flota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contrato_flota_id_seq OWNED BY public.contrato_flota.id;


--
-- TOC entry 219 (class 1259 OID 16403)
-- Name: mecanicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mecanicos (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    sucursal_id integer NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE public.mecanicos OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16402)
-- Name: mecanicos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mecanicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mecanicos_id_seq OWNER TO postgres;

--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 218
-- Name: mecanicos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mecanicos_id_seq OWNED BY public.mecanicos.id;


--
-- TOC entry 223 (class 1259 OID 24641)
-- Name: recepcion_citas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recepcion_citas (
    id_citas_recepcion integer NOT NULL,
    cita_id integer NOT NULL,
    kilometraje integer,
    observaciones text
);


ALTER TABLE public.recepcion_citas OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24640)
-- Name: recepcion_citas_id_citas_recepcion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recepcion_citas_id_citas_recepcion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recepcion_citas_id_citas_recepcion_seq OWNER TO postgres;

--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 222
-- Name: recepcion_citas_id_citas_recepcion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recepcion_citas_id_citas_recepcion_seq OWNED BY public.recepcion_citas.id_citas_recepcion;


--
-- TOC entry 225 (class 1259 OID 24655)
-- Name: recepcionistas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recepcionistas (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    sucursal_id integer NOT NULL
);


ALTER TABLE public.recepcionistas OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24654)
-- Name: recepcionistas_id_recepcionistas_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recepcionistas_id_recepcionistas_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recepcionistas_id_recepcionistas_seq OWNER TO postgres;

--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 224
-- Name: recepcionistas_id_recepcionistas_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recepcionistas_id_recepcionistas_seq OWNED BY public.recepcionistas.id;


--
-- TOC entry 215 (class 1259 OID 16386)
-- Name: sucursales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sucursales (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    pais character varying(100) NOT NULL,
    capacidad_elevadores integer NOT NULL,
    CONSTRAINT sucursales_capacidad_elevadores_check CHECK ((capacidad_elevadores > 0))
);


ALTER TABLE public.sucursales OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16385)
-- Name: sucursales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sucursales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sucursales_id_seq OWNER TO postgres;

--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 214
-- Name: sucursales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sucursales_id_seq OWNED BY public.sucursales.id;


--
-- TOC entry 3292 (class 2604 OID 16421)
-- Name: citas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas ALTER COLUMN id SET DEFAULT nextval('public.citas_id_seq'::regclass);


--
-- TOC entry 3289 (class 2604 OID 16397)
-- Name: contrato_flota id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrato_flota ALTER COLUMN id SET DEFAULT nextval('public.contrato_flota_id_seq'::regclass);


--
-- TOC entry 3290 (class 2604 OID 16406)
-- Name: mecanicos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mecanicos ALTER COLUMN id SET DEFAULT nextval('public.mecanicos_id_seq'::regclass);


--
-- TOC entry 3294 (class 2604 OID 24644)
-- Name: recepcion_citas id_citas_recepcion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_citas ALTER COLUMN id_citas_recepcion SET DEFAULT nextval('public.recepcion_citas_id_citas_recepcion_seq'::regclass);


--
-- TOC entry 3295 (class 2604 OID 24658)
-- Name: recepcionistas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcionistas ALTER COLUMN id SET DEFAULT nextval('public.recepcionistas_id_recepcionistas_seq'::regclass);


--
-- TOC entry 3288 (class 2604 OID 16389)
-- Name: sucursales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales ALTER COLUMN id SET DEFAULT nextval('public.sucursales_id_seq'::regclass);


--
-- TOC entry 3472 (class 0 OID 16418)
-- Dependencies: 221
-- Data for Name: citas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.citas (id, sucursal_id, mecanico_id, vehiculo_id, usuario_id, contrato_flota_id, fecha_hora_inicio, fecha_hora_fin, estado, observacion_cliente) FROM stdin;
1	1	1	1	4	\N	2026-04-27 22:00:00+00	2026-04-27 23:00:00+00	programada	cambio de bujia
5	1	1	1	4	\N	2026-04-25 04:00:00+00	2026-04-25 04:59:00+00	programada	probando
6	1	1	1	4	\N	2026-04-26 04:00:00+00	2026-04-26 04:59:00+00	programada	probando
7	1	1	1	4	\N	2026-04-26 14:00:00+00	2026-04-26 15:00:00+00	programada	Prueba desde swagger
\.


--
-- TOC entry 3468 (class 0 OID 16394)
-- Dependencies: 217
-- Data for Name: contrato_flota; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contrato_flota (id, cliente_id, politica_autorizacion) FROM stdin;
1	101	Autorización automática
2	102	Requiere aprobación
\.


--
-- TOC entry 3470 (class 0 OID 16403)
-- Dependencies: 219
-- Data for Name: mecanicos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mecanicos (id, usuario_id, sucursal_id, activo) FROM stdin;
1	2	1	t
\.


--
-- TOC entry 3474 (class 0 OID 24641)
-- Dependencies: 223
-- Data for Name: recepcion_citas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recepcion_citas (id_citas_recepcion, cita_id, kilometraje, observaciones) FROM stdin;
\.


--
-- TOC entry 3476 (class 0 OID 24655)
-- Dependencies: 225
-- Data for Name: recepcionistas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recepcionistas (id, usuario_id, sucursal_id) FROM stdin;
\.


--
-- TOC entry 3466 (class 0 OID 16386)
-- Dependencies: 215
-- Data for Name: sucursales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sucursales (id, nombre, pais, capacidad_elevadores) FROM stdin;
1	Sucursal Centro	Colombia	5
2	Sucursal Norte	Colombia	3
\.


--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 220
-- Name: citas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.citas_id_seq', 7, true);


--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 216
-- Name: contrato_flota_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contrato_flota_id_seq', 2, true);


--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 218
-- Name: mecanicos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mecanicos_id_seq', 1, true);


--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 222
-- Name: recepcion_citas_id_citas_recepcion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recepcion_citas_id_citas_recepcion_seq', 1, false);


--
-- TOC entry 3492 (class 0 OID 0)
-- Dependencies: 224
-- Name: recepcionistas_id_recepcionistas_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recepcionistas_id_recepcionistas_seq', 1, false);


--
-- TOC entry 3493 (class 0 OID 0)
-- Dependencies: 214
-- Name: sucursales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sucursales_id_seq', 2, true);


--
-- TOC entry 3314 (class 2606 OID 24648)
-- Name: recepcion_citas PK_id_citas_recpcionista; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_citas
    ADD CONSTRAINT "PK_id_citas_recpcionista" PRIMARY KEY (id_citas_recepcion);


--
-- TOC entry 3316 (class 2606 OID 24660)
-- Name: recepcionistas PK_id_recepcionista; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcionistas
    ADD CONSTRAINT "PK_id_recepcionista" PRIMARY KEY (id);


--
-- TOC entry 3309 (class 2606 OID 16428)
-- Name: citas citas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_pkey PRIMARY KEY (id);


--
-- TOC entry 3302 (class 2606 OID 16401)
-- Name: contrato_flota contrato_flota_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrato_flota
    ADD CONSTRAINT contrato_flota_pkey PRIMARY KEY (id);


--
-- TOC entry 3305 (class 2606 OID 16409)
-- Name: mecanicos mecanicos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mecanicos
    ADD CONSTRAINT mecanicos_pkey PRIMARY KEY (id);


--
-- TOC entry 3307 (class 2606 OID 16411)
-- Name: mecanicos mecanicos_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mecanicos
    ADD CONSTRAINT mecanicos_usuario_id_key UNIQUE (usuario_id);


--
-- TOC entry 3300 (class 2606 OID 16392)
-- Name: sucursales sucursales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT sucursales_pkey PRIMARY KEY (id);


--
-- TOC entry 3310 (class 1259 OID 16444)
-- Name: idx_citas_mecanico_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_citas_mecanico_fecha ON public.citas USING btree (mecanico_id, fecha_hora_inicio);


--
-- TOC entry 3311 (class 1259 OID 16445)
-- Name: idx_citas_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_citas_usuario ON public.citas USING btree (usuario_id);


--
-- TOC entry 3303 (class 1259 OID 16446)
-- Name: idx_mecanicos_sucursal; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mecanicos_sucursal ON public.mecanicos USING btree (sucursal_id);


--
-- TOC entry 3312 (class 1259 OID 16447)
-- Name: unique_cita_exacta; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_cita_exacta ON public.citas USING btree (mecanico_id, fecha_hora_inicio);


--
-- TOC entry 3321 (class 2606 OID 24649)
-- Name: recepcion_citas FK_id_cita_recepcionista; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_citas
    ADD CONSTRAINT "FK_id_cita_recepcionista" FOREIGN KEY (cita_id) REFERENCES public.citas(id);


--
-- TOC entry 3322 (class 2606 OID 24661)
-- Name: recepcionistas FK_id_sucursal; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcionistas
    ADD CONSTRAINT "FK_id_sucursal" FOREIGN KEY (sucursal_id) REFERENCES public.sucursales(id);


--
-- TOC entry 3318 (class 2606 OID 16439)
-- Name: citas citas_contrato_flota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_contrato_flota_id_fkey FOREIGN KEY (contrato_flota_id) REFERENCES public.contrato_flota(id) ON DELETE SET NULL;


--
-- TOC entry 3319 (class 2606 OID 16434)
-- Name: citas citas_mecanico_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_mecanico_id_fkey FOREIGN KEY (mecanico_id) REFERENCES public.mecanicos(id) ON DELETE CASCADE;


--
-- TOC entry 3320 (class 2606 OID 16429)
-- Name: citas citas_sucursal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_sucursal_id_fkey FOREIGN KEY (sucursal_id) REFERENCES public.sucursales(id) ON DELETE CASCADE;


--
-- TOC entry 3317 (class 2606 OID 16412)
-- Name: mecanicos mecanicos_sucursal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mecanicos
    ADD CONSTRAINT mecanicos_sucursal_id_fkey FOREIGN KEY (sucursal_id) REFERENCES public.sucursales(id) ON DELETE CASCADE;


-- Completed on 2026-04-27 17:30:51

--
-- PostgreSQL database dump complete
--

\unrestrict VqHw0DwJ7WqnjBedQXbvxs8ueBERGsU4ypGW1uoUa7jMOtNNXqcAekOxyu9PQw9

