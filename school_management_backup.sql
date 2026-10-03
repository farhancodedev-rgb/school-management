--
-- PostgreSQL database dump
--

\restrict 02UAet3s1wLsqCeEcIENDLk2ARaoSCHrdDdMMplNkfEDPW7Ue2bWoGvwvhx9Zps

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

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
-- Name: attendance; Type: TABLE; Schema: public; Owner: u0_a362
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    studentid integer,
    date date,
    status text
);


ALTER TABLE public.attendance OWNER TO u0_a362;

--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: u0_a362
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_id_seq OWNER TO u0_a362;

--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u0_a362
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: classes; Type: TABLE; Schema: public; Owner: u0_a362
--

CREATE TABLE public.classes (
    id integer NOT NULL,
    classname text NOT NULL,
    section text
);


ALTER TABLE public.classes OWNER TO u0_a362;

--
-- Name: classes_id_seq; Type: SEQUENCE; Schema: public; Owner: u0_a362
--

CREATE SEQUENCE public.classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.classes_id_seq OWNER TO u0_a362;

--
-- Name: classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u0_a362
--

ALTER SEQUENCE public.classes_id_seq OWNED BY public.classes.id;


--
-- Name: fees; Type: TABLE; Schema: public; Owner: u0_a362
--

CREATE TABLE public.fees (
    id integer NOT NULL,
    studentid integer,
    totalfees numeric,
    paidamount numeric,
    remaining numeric,
    paymentdate date
);


ALTER TABLE public.fees OWNER TO u0_a362;

--
-- Name: fees_id_seq; Type: SEQUENCE; Schema: public; Owner: u0_a362
--

CREATE SEQUENCE public.fees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fees_id_seq OWNER TO u0_a362;

--
-- Name: fees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u0_a362
--

ALTER SEQUENCE public.fees_id_seq OWNED BY public.fees.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: u0_a362
--

CREATE TABLE public.sessions (
    id text NOT NULL
);


ALTER TABLE public.sessions OWNER TO u0_a362;

--
-- Name: students; Type: TABLE; Schema: public; Owner: u0_a362
--

CREATE TABLE public.students (
    id integer NOT NULL,
    name text NOT NULL,
    father text,
    classname text,
    roll text
);


ALTER TABLE public.students OWNER TO u0_a362;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: u0_a362
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO u0_a362;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u0_a362
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: teachers; Type: TABLE; Schema: public; Owner: u0_a362
--

CREATE TABLE public.teachers (
    id integer NOT NULL,
    name text NOT NULL,
    father text,
    subject text,
    phone text
);


ALTER TABLE public.teachers OWNER TO u0_a362;

--
-- Name: teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: u0_a362
--

CREATE SEQUENCE public.teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teachers_id_seq OWNER TO u0_a362;

--
-- Name: teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u0_a362
--

ALTER SEQUENCE public.teachers_id_seq OWNED BY public.teachers.id;


--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: classes id; Type: DEFAULT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.classes ALTER COLUMN id SET DEFAULT nextval('public.classes_id_seq'::regclass);


--
-- Name: fees id; Type: DEFAULT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.fees ALTER COLUMN id SET DEFAULT nextval('public.fees_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: teachers id; Type: DEFAULT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.teachers ALTER COLUMN id SET DEFAULT nextval('public.teachers_id_seq'::regclass);


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: u0_a362
--

COPY public.attendance (id, studentid, date, status) FROM stdin;
\.


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: u0_a362
--

COPY public.classes (id, classname, section) FROM stdin;
\.


--
-- Data for Name: fees; Type: TABLE DATA; Schema: public; Owner: u0_a362
--

COPY public.fees (id, studentid, totalfees, paidamount, remaining, paymentdate) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: u0_a362
--

COPY public.sessions (id) FROM stdin;
cdc0cf02d66888af5710c91db912a41bcc22af7b796031e3d58c53d2da174474
9731273f4b08ec8bb39b9f97f2815e4951b3f2302f35e5b8b38592ad34551e74
675d9af0bc6c5bdd11013794495d30ab57ab1cca8663bfd9c05f19e2d83b8e8c
8dd6f4b853eb81892d9636100de221c725c246dcedba8ca44c2aabeb9011ec56
78adbf2af7792c8aebf98aa3199d0e35e5a7959034d8e1f4b25d4f146d4daff4
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: u0_a362
--

COPY public.students (id, name, father, classname, roll) FROM stdin;
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: u0_a362
--

COPY public.teachers (id, name, father, subject, phone) FROM stdin;
\.


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: u0_a362
--

SELECT pg_catalog.setval('public.attendance_id_seq', 1, false);


--
-- Name: classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: u0_a362
--

SELECT pg_catalog.setval('public.classes_id_seq', 1, false);


--
-- Name: fees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: u0_a362
--

SELECT pg_catalog.setval('public.fees_id_seq', 1, false);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: u0_a362
--

SELECT pg_catalog.setval('public.students_id_seq', 1, false);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: u0_a362
--

SELECT pg_catalog.setval('public.teachers_id_seq', 1, false);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: fees fees_pkey; Type: CONSTRAINT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: attendance attendance_studentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_studentid_fkey FOREIGN KEY (studentid) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: fees fees_studentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: u0_a362
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_studentid_fkey FOREIGN KEY (studentid) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 02UAet3s1wLsqCeEcIENDLk2ARaoSCHrdDdMMplNkfEDPW7Ue2bWoGvwvhx9Zps

