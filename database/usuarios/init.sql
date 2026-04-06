
CREATE TABLE public.perfil_usuario (
    id_personal integer NOT NULL,
    usuario_id integer,
    telefono character varying(20),
    direccion character varying(100),
    ciudad character varying(50),
    documento character varying(20),
    fecha_nacimiento date
);


ALTER TABLE public.perfil_usuario OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16729)
-- Name: perfil_usuario_id_personal_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfil_usuario_id_personal_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perfil_usuario_id_personal_seq OWNER TO postgres;

--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 221
-- Name: perfil_usuario_id_personal_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfil_usuario_id_personal_seq OWNED BY public.perfil_usuario.id_personal;


--
-- TOC entry 220 (class 1259 OID 16642)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuarios integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    rol character varying(50) NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16641)
-- Name: usuarios_id_usuarios_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuarios_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuarios_seq OWNER TO postgres;

--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_usuarios_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuarios_seq OWNED BY public.usuarios.id_usuarios;


--
-- TOC entry 4862 (class 2604 OID 16733)
-- Name: perfil_usuario id_personal; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_usuario ALTER COLUMN id_personal SET DEFAULT nextval('public.perfil_usuario_id_personal_seq'::regclass);


--
-- TOC entry 4861 (class 2604 OID 16645)
-- Name: usuarios id_usuarios; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuarios SET DEFAULT nextval('public.usuarios_id_usuarios_seq'::regclass);


--
-- TOC entry 5022 (class 0 OID 16730)
-- Dependencies: 222
-- Data for Name: perfil_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfil_usuario (id_personal, usuario_id, telefono, direccion, ciudad, documento, fecha_nacimiento) FROM stdin;
\.


--
-- TOC entry 5020 (class 0 OID 16642)
-- Dependencies: 220
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuarios, nombre, email, password, rol) FROM stdin;
\.


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 221
-- Name: perfil_usuario_id_personal_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.perfil_usuario_id_personal_seq', 1, false);


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_usuarios_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuarios_seq', 1, false);


--
-- TOC entry 4864 (class 2606 OID 16652)
-- Name: usuarios PK_id_usuarios; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_id_usuarios" PRIMARY KEY (id_usuarios);


--
-- TOC entry 4866 (class 2606 OID 16654)
-- Name: usuarios email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT email UNIQUE (email);


--
-- TOC entry 4868 (class 2606 OID 16738)
-- Name: perfil_usuario id_usuario; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_usuario
    ADD CONSTRAINT id_usuario UNIQUE (usuario_id);


--
-- TOC entry 4870 (class 2606 OID 16736)
-- Name: perfil_usuario pk_id_perfil_personal; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_usuario
    ADD CONSTRAINT pk_id_perfil_personal PRIMARY KEY (id_personal);


--
-- TOC entry 4871 (class 2606 OID 16739)
-- Name: perfil_usuario fk_id_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_usuario
    ADD CONSTRAINT fk_id_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuarios);


