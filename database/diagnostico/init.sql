

CREATE TABLE public.diagnostico_repuestos (
    id integer NOT NULL,
    diagnostico_id integer NOT NULL,
    repuesto_id integer NOT NULL,
    cantidad integer NOT NULL
);


ALTER TABLE public.diagnostico_repuestos OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16395)
-- Name: diagnostico_repuestos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.diagnostico_repuestos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.diagnostico_repuestos_id_seq OWNER TO postgres;

--
-- TOC entry 3428 (class 0 OID 0)
-- Dependencies: 216
-- Name: diagnostico_repuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.diagnostico_repuestos_id_seq OWNED BY public.diagnostico_repuestos.id;


--
-- TOC entry 215 (class 1259 OID 16386)
-- Name: diagnosticos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnosticos (
    id integer NOT NULL,
    cita_id integer NOT NULL,
    descripcion_falla character varying NOT NULL,
    reparacion_realizada character varying,
    mano_obra double precision,
    estado character varying,
    fecha_creacion timestamp without time zone
);


ALTER TABLE public.diagnosticos OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16385)
-- Name: diagnosticos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.diagnosticos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.diagnosticos_id_seq OWNER TO postgres;

--
-- TOC entry 3429 (class 0 OID 0)
-- Dependencies: 214
-- Name: diagnosticos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.diagnosticos_id_seq OWNED BY public.diagnosticos.id;


--
-- TOC entry 3269 (class 2604 OID 16399)
-- Name: diagnostico_repuestos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnostico_repuestos ALTER COLUMN id SET DEFAULT nextval('public.diagnostico_repuestos_id_seq'::regclass);


--
-- TOC entry 3268 (class 2604 OID 16389)
-- Name: diagnosticos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosticos ALTER COLUMN id SET DEFAULT nextval('public.diagnosticos_id_seq'::regclass);


--
-- TOC entry 3422 (class 0 OID 16396)
-- Dependencies: 217
-- Data for Name: diagnostico_repuestos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnostico_repuestos (id, diagnostico_id, repuesto_id, cantidad) FROM stdin;
\.


--
-- TOC entry 3420 (class 0 OID 16386)
-- Dependencies: 215
-- Data for Name: diagnosticos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnosticos (id, cita_id, descripcion_falla, reparacion_realizada, mano_obra, estado, fecha_creacion) FROM stdin;
\.


--
-- TOC entry 3430 (class 0 OID 0)
-- Dependencies: 216
-- Name: diagnostico_repuestos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.diagnostico_repuestos_id_seq', 1, false);


--
-- TOC entry 3431 (class 0 OID 0)
-- Dependencies: 214
-- Name: diagnosticos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.diagnosticos_id_seq', 1, false);


--
-- TOC entry 3274 (class 2606 OID 16401)
-- Name: diagnostico_repuestos diagnostico_repuestos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnostico_repuestos
    ADD CONSTRAINT diagnostico_repuestos_pkey PRIMARY KEY (id);


--
-- TOC entry 3271 (class 2606 OID 16393)
-- Name: diagnosticos diagnosticos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosticos
    ADD CONSTRAINT diagnosticos_pkey PRIMARY KEY (id);


--
-- TOC entry 3275 (class 1259 OID 16407)
-- Name: ix_diagnostico_repuestos_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_diagnostico_repuestos_id ON public.diagnostico_repuestos USING btree (id);


--
-- TOC entry 3272 (class 1259 OID 16394)
-- Name: ix_diagnosticos_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_diagnosticos_id ON public.diagnosticos USING btree (id);


--
-- TOC entry 3276 (class 2606 OID 16402)
-- Name: diagnostico_repuestos diagnostico_repuestos_diagnostico_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnostico_repuestos
    ADD CONSTRAINT diagnostico_repuestos_diagnostico_id_fkey FOREIGN KEY (diagnostico_id) REFERENCES public.diagnosticos(id);


