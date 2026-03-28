--
-- PostgreSQL database dump
-

--
-- TOC entry 226 (class 1259 OID 16522)
-- Name: citas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.citas (
    id integer NOT NULL,
    sucursal_id integer NOT NULL,
    mecanico_id integer NOT NULL,
    vehiculo_id integer NOT NULL,
    contrato_flota_id integer,
    fecha_hora_inicio timestamp with time zone NOT NULL,
    fecha_hora_fin timestamp with time zone NOT NULL,
    estado character varying(50) DEFAULT 'programada'::character varying NOT NULL
);


ALTER TABLE public.citas OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16521)
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
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 225
-- Name: citas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.citas_id_seq OWNED BY public.citas.id;


--
-- TOC entry 222 (class 1259 OID 16470)
-- Name: contrato_flota; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contrato_flota (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    politica_autorizacion text
);


ALTER TABLE public.contrato_flota OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16469)
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
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 221
-- Name: contrato_flota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contrato_flota_id_seq OWNED BY public.contrato_flota.id;


--
-- TOC entry 224 (class 1259 OID 16481)
-- Name: mecanicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mecanicos (
    id integer NOT NULL,
    sucursal_id integer NOT NULL,
    activo boolean DEFAULT true,
    usuario_id integer NOT NULL
);


ALTER TABLE public.mecanicos OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16480)
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
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 223
-- Name: mecanicos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mecanicos_id_seq OWNED BY public.mecanicos.id;


--
-- TOC entry 220 (class 1259 OID 16459)
-- Name: sucursales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sucursales (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    pais character varying(100) NOT NULL,
    capacidad_elevadores integer NOT NULL
);


ALTER TABLE public.sucursales OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16458)
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
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 219
-- Name: sucursales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sucursales_id_seq OWNED BY public.sucursales.id;


--
-- TOC entry 4875 (class 2604 OID 16525)
-- Name: citas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas ALTER COLUMN id SET DEFAULT nextval('public.citas_id_seq'::regclass);


--
-- TOC entry 4872 (class 2604 OID 16473)
-- Name: contrato_flota id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrato_flota ALTER COLUMN id SET DEFAULT nextval('public.contrato_flota_id_seq'::regclass);


--
-- TOC entry 4873 (class 2604 OID 16484)
-- Name: mecanicos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mecanicos ALTER COLUMN id SET DEFAULT nextval('public.mecanicos_id_seq'::regclass);


--
-- TOC entry 4871 (class 2604 OID 16462)
-- Name: sucursales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales ALTER COLUMN id SET DEFAULT nextval('public.sucursales_id_seq'::regclass);


--
-- TOC entry 5045 (class 0 OID 16522)
-- Dependencies: 226
-- Data for Name: citas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.citas (id, sucursal_id, mecanico_id, vehiculo_id, contrato_flota_id, fecha_hora_inicio, fecha_hora_fin, estado) FROM stdin;
\.


--
-- TOC entry 5041 (class 0 OID 16470)
-- Dependencies: 222
-- Data for Name: contrato_flota; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contrato_flota (id, cliente_id, politica_autorizacion) FROM stdin;
\.


--
-- TOC entry 5043 (class 0 OID 16481)
-- Dependencies: 224
-- Data for Name: mecanicos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mecanicos (id, sucursal_id, activo, usuario_id) FROM stdin;
\.


--
-- TOC entry 5039 (class 0 OID 16459)
-- Dependencies: 220
-- Data for Name: sucursales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sucursales (id, nombre, pais, capacidad_elevadores) FROM stdin;
\.


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 225
-- Name: citas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.citas_id_seq', 1, false);


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 221
-- Name: contrato_flota_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contrato_flota_id_seq', 1, false);


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 223
-- Name: mecanicos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mecanicos_id_seq', 1, false);


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 219
-- Name: sucursales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sucursales_id_seq', 1, false);


--
-- TOC entry 4886 (class 2606 OID 16535)
-- Name: citas pk_id_citas; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT pk_id_citas PRIMARY KEY (id);


--
-- TOC entry 4880 (class 2606 OID 16479)
-- Name: contrato_flota pk_id_contratos; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrato_flota
    ADD CONSTRAINT pk_id_contratos PRIMARY KEY (id);


--
-- TOC entry 4882 (class 2606 OID 16490)
-- Name: mecanicos pk_id_mecanicos; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mecanicos
    ADD CONSTRAINT pk_id_mecanicos PRIMARY KEY (id);


--
-- TOC entry 4878 (class 2606 OID 16468)
-- Name: sucursales pk_id_sucursales; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT pk_id_sucursales PRIMARY KEY (id);


--
-- TOC entry 4884 (class 2606 OID 16657)
-- Name: mecanicos unique_usuario; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mecanicos
    ADD CONSTRAINT unique_usuario UNIQUE (usuario_id);


--
-- TOC entry 4888 (class 2606 OID 16546)
-- Name: citas fk_contrato; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT fk_contrato FOREIGN KEY (contrato_flota_id) REFERENCES public.contrato_flota(id);


--
-- TOC entry 4889 (class 2606 OID 16541)
-- Name: citas fk_mecanico; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT fk_mecanico FOREIGN KEY (mecanico_id) REFERENCES public.mecanicos(id);


--
-- TOC entry 4887 (class 2606 OID 16491)
-- Name: mecanicos fk_mecanico_sucursal; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mecanicos
    ADD CONSTRAINT fk_mecanico_sucursal FOREIGN KEY (sucursal_id) REFERENCES public.sucursales(id);


--
-- TOC entry 4890 (class 2606 OID 16536)
-- Name: citas fk_sucursal; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT fk_sucursal FOREIGN KEY (sucursal_id) REFERENCES public.sucursales(id);


-- Completed on 2026-03-28 12:13:43

--
-- PostgreSQL database dump complete
