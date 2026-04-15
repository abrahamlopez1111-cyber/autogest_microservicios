
CREATE TABLE public.detalles_repuestos (
    id integer NOT NULL,
    servicio_id integer NOT NULL,
    repuesto_id integer NOT NULL,
    cantidad integer NOT NULL
);


ALTER TABLE public.detalles_repuestos OWNER TO postgres;

CREATE SEQUENCE public.detalles_repuestos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalles_repuestos_id_seq OWNER TO postgres;

ALTER SEQUENCE public.detalles_repuestos_id_seq OWNED BY public.detalles_repuestos.id;


CREATE TABLE public.servicios_historicos (
    id integer NOT NULL,
    vehiculo_id integer NOT NULL,
    sucursal_id integer NOT NULL,
    fecha_servicio date NOT NULL,
    kilometraje integer,
    observaciones text
);


ALTER TABLE public.servicios_historicos OWNER TO postgres;

CREATE SEQUENCE public.servicios_historicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicios_historicos_id_seq OWNER TO postgres;

ALTER SEQUENCE public.servicios_historicos_id_seq OWNED BY public.servicios_historicos.id;



CREATE TABLE public.vehiculos (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    placa character varying(20) NOT NULL,
    marca character varying(50) NOT NULL,
    anio_fabricacion integer,
    modelo character varying(50)
);


ALTER TABLE public.vehiculos OWNER TO postgres;


CREATE SEQUENCE public.vehiculos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehiculos_id_seq OWNER TO postgres;


ALTER SEQUENCE public.vehiculos_id_seq OWNED BY public.vehiculos.id;


ALTER TABLE ONLY public.detalles_repuestos ALTER COLUMN id SET DEFAULT nextval('public.detalles_repuestos_id_seq'::regclass);



ALTER TABLE ONLY public.servicios_historicos ALTER COLUMN id SET DEFAULT nextval('public.servicios_historicos_id_seq'::regclass);



ALTER TABLE ONLY public.vehiculos ALTER COLUMN id SET DEFAULT nextval('public.vehiculos_id_seq'::regclass);


COPY public.detalles_repuestos (id, servicio_id, repuesto_id, cantidad) FROM stdin;
\.



COPY public.servicios_historicos (id, vehiculo_id, sucursal_id, fecha_servicio, kilometraje, observaciones) FROM stdin;
\.



COPY public.vehiculos (id, usuario_id, placa, marca, anio_fabricacion) FROM stdin;
\.



SELECT pg_catalog.setval('public.detalles_repuestos_id_seq', 1, false);



SELECT pg_catalog.setval('public.servicios_historicos_id_seq', 1, false);


SELECT pg_catalog.setval('public.vehiculos_id_seq', 1, false);


ALTER TABLE ONLY public.detalles_repuestos
    ADD CONSTRAINT "PK_id_detalle_r" PRIMARY KEY (id);


ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT "PK_id_vehiculo" PRIMARY KEY (id);


ALTER TABLE ONLY public.servicios_historicos
    ADD CONSTRAINT "PK_id_vehiculos" PRIMARY KEY (id);


ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT placa_unique UNIQUE (placa);


ALTER TABLE ONLY public.detalles_repuestos
    ADD CONSTRAINT "FK_id_servicio" FOREIGN KEY (servicio_id) REFERENCES public.servicios_historicos(id);


ALTER TABLE ONLY public.servicios_historicos
    ADD CONSTRAINT "FK_vehiculo_id" FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id);

