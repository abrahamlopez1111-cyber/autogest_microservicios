

CREATE TABLE public.catalogo_repuestos (
    id integer NOT NULL,
    codigo_inventario character varying(50) NOT NULL,
    nombre character varying(255) NOT NULL,
    requiere_lote boolean DEFAULT false,
    punto_pedido_global integer DEFAULT 0,
    precio integer NOT NULL
);


ALTER TABLE public.catalogo_repuestos OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16390)
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
-- TOC entry 3456 (class 0 OID 0)
-- Dependencies: 215
-- Name: catalogo_repuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_repuestos_id_seq OWNED BY public.catalogo_repuestos.id;


--
-- TOC entry 216 (class 1259 OID 16391)
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
-- TOC entry 217 (class 1259 OID 16394)
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
-- TOC entry 3457 (class 0 OID 0)
-- Dependencies: 217
-- Name: lotes_inventario_id_lotes_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lotes_inventario_id_lotes_seq OWNED BY public.lotes_inventario.id_lotes;


--
-- TOC entry 218 (class 1259 OID 16395)
-- Name: stock_sucursal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_sucursal (
    id integer NOT NULL,
    sucursal_id integer NOT NULL,
    catalogo_repuestos_id integer NOT NULL,
    cantidad_disponible integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.stock_sucursal OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16398)
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
-- TOC entry 3458 (class 0 OID 0)
-- Dependencies: 219
-- Name: stock_sucursal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_sucursal_id_seq OWNED BY public.stock_sucursal.id;


--
-- TOC entry 220 (class 1259 OID 16399)
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
-- TOC entry 221 (class 1259 OID 16403)
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
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 221
-- Name: transferencias_id_transferencias_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transferencias_id_transferencias_seq OWNED BY public.transferencias.id_transferencias;


--
-- TOC entry 3278 (class 2604 OID 16404)
-- Name: catalogo_repuestos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_repuestos ALTER COLUMN id SET DEFAULT nextval('public.catalogo_repuestos_id_seq'::regclass);


--
-- TOC entry 3281 (class 2604 OID 16405)
-- Name: lotes_inventario id_lotes; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lotes_inventario ALTER COLUMN id_lotes SET DEFAULT nextval('public.lotes_inventario_id_lotes_seq'::regclass);


--
-- TOC entry 3282 (class 2604 OID 16406)
-- Name: stock_sucursal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_sucursal ALTER COLUMN id SET DEFAULT nextval('public.stock_sucursal_id_seq'::regclass);


--
-- TOC entry 3284 (class 2604 OID 16407)
-- Name: transferencias id_transferencias; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias ALTER COLUMN id_transferencias SET DEFAULT nextval('public.transferencias_id_transferencias_seq'::regclass);


--
-- TOC entry 3443 (class 0 OID 16385)
-- Dependencies: 214
-- Data for Name: catalogo_repuestos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_repuestos (id, codigo_inventario, nombre, requiere_lote, punto_pedido_global, precio) FROM stdin;
\.


--
-- TOC entry 3445 (class 0 OID 16391)
-- Dependencies: 216
-- Data for Name: lotes_inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lotes_inventario (id_lotes, catalogo_repuestos_id, sucursal_id, codigo_lote, fecha_caducidad, cantidad_lote) FROM stdin;
\.


--
-- TOC entry 3447 (class 0 OID 16395)
-- Dependencies: 218
-- Data for Name: stock_sucursal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_sucursal (id, sucursal_id, catalogo_repuestos_id, cantidad_disponible) FROM stdin;
\.


--
-- TOC entry 3449 (class 0 OID 16399)
-- Dependencies: 220
-- Data for Name: transferencias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transferencias (id_transferencias, catalogo_repuestos_id, sucursal_origen_id, sucursal_destino_id, cantidad, estado) FROM stdin;
\.


--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 215
-- Name: catalogo_repuestos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_repuestos_id_seq', 1, false);


--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 217
-- Name: lotes_inventario_id_lotes_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lotes_inventario_id_lotes_seq', 1, false);


--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 219
-- Name: stock_sucursal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_sucursal_id_seq', 1, false);


--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 221
-- Name: transferencias_id_transferencias_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transferencias_id_transferencias_seq', 1, false);


--
-- TOC entry 3297 (class 2606 OID 16409)
-- Name: transferencias PK_id_transferencias; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias
    ADD CONSTRAINT "PK_id_transferencias" PRIMARY KEY (id_transferencias);


--
-- TOC entry 3287 (class 2606 OID 16411)
-- Name: catalogo_repuestos codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_repuestos
    ADD CONSTRAINT codigo UNIQUE (codigo_inventario);


--
-- TOC entry 3289 (class 2606 OID 16413)
-- Name: catalogo_repuestos pk_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_repuestos
    ADD CONSTRAINT pk_id PRIMARY KEY (id);


--
-- TOC entry 3291 (class 2606 OID 16415)
-- Name: lotes_inventario pk_id_lotes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lotes_inventario
    ADD CONSTRAINT pk_id_lotes PRIMARY KEY (id_lotes);


--
-- TOC entry 3293 (class 2606 OID 16417)
-- Name: stock_sucursal pk_id_stock; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_sucursal
    ADD CONSTRAINT pk_id_stock PRIMARY KEY (id);


--
-- TOC entry 3295 (class 2606 OID 24627)
-- Name: stock_sucursal unique_stock; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_sucursal
    ADD CONSTRAINT unique_stock UNIQUE (sucursal_id);


--
-- TOC entry 3299 (class 2606 OID 16418)
-- Name: stock_sucursal fk_catalogo_repuestos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_sucursal
    ADD CONSTRAINT fk_catalogo_repuestos FOREIGN KEY (catalogo_repuestos_id) REFERENCES public.catalogo_repuestos(id);


--
-- TOC entry 3298 (class 2606 OID 16423)
-- Name: lotes_inventario fk_catalogo_repuestos_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lotes_inventario
    ADD CONSTRAINT fk_catalogo_repuestos_id FOREIGN KEY (catalogo_repuestos_id) REFERENCES public.catalogo_repuestos(id);


--
-- TOC entry 3300 (class 2606 OID 16428)
-- Name: transferencias fk_catalogo_repuestos_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias
    ADD CONSTRAINT fk_catalogo_repuestos_id FOREIGN KEY (catalogo_repuestos_id) REFERENCES public.catalogo_repuestos(id);


