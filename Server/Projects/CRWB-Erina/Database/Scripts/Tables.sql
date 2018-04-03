
CREATE SEQUENCE public.emails_id_email_seq;

CREATE TABLE public.emails (
                id_email BIGINT NOT NULL DEFAULT nextval('public.emails_id_email_seq'),
                email TEXT NOT NULL,
                CONSTRAINT emails_pk PRIMARY KEY (id_email)
);


ALTER SEQUENCE public.emails_id_email_seq OWNED BY public.emails.id_email;

CREATE SEQUENCE public.pictures_id_picture_seq;

CREATE TABLE public.pictures (
                id_picture BIGINT NOT NULL DEFAULT nextval('public.pictures_id_picture_seq'),
                data BYTEA NOT NULL,
                timestamp TIMESTAMP NOT NULL,
                CONSTRAINT pictures_pk PRIMARY KEY (id_picture)
);


ALTER SEQUENCE public.pictures_id_picture_seq OWNED BY public.pictures.id_picture;

CREATE SEQUENCE public.groups_id_group_seq;

CREATE TABLE public.groups (
                id_group BIGINT NOT NULL DEFAULT nextval('public.groups_id_group_seq'),
                name TEXT NOT NULL,
                CONSTRAINT groups_pk PRIMARY KEY (id_group)
);


ALTER SEQUENCE public.groups_id_group_seq OWNED BY public.groups.id_group;

CREATE SEQUENCE public.legal_persons_id_legal_person_seq;

CREATE TABLE public.legal_persons (
                id_legal_person INTEGER NOT NULL DEFAULT nextval('public.legal_persons_id_legal_person_seq'),
                legal_person TEXT NOT NULL,
                CONSTRAINT legal_persons_pk PRIMARY KEY (id_legal_person)
);


ALTER SEQUENCE public.legal_persons_id_legal_person_seq OWNED BY public.legal_persons.id_legal_person;

CREATE SEQUENCE public.persons_id_person_seq;

CREATE TABLE public.persons (
                id_person BIGINT NOT NULL DEFAULT nextval('public.persons_id_person_seq'),
                id_legal_person INTEGER NOT NULL,
                CONSTRAINT persons_pk PRIMARY KEY (id_person)
);


ALTER SEQUENCE public.persons_id_person_seq OWNED BY public.persons.id_person;

CREATE TABLE public.aliases (
                id_person BIGINT NOT NULL,
                alias TEXT NOT NULL,
                CONSTRAINT aliases_pk PRIMARY KEY (id_person, alias)
);


CREATE TABLE public.persons_emails (
                id_person BIGINT NOT NULL,
                id_email BIGINT NOT NULL,
                CONSTRAINT persons_emails_pk PRIMARY KEY (id_person, id_email)
);


CREATE TABLE public.persons_groups (
                id_person BIGINT NOT NULL,
                id_group BIGINT NOT NULL,
                CONSTRAINT persons_groups_pk PRIMARY KEY (id_person, id_group)
);


CREATE TABLE public.persons_pictures (
                id_person BIGINT NOT NULL,
                id_picture BIGINT NOT NULL,
                CONSTRAINT persons_pictures_pk PRIMARY KEY (id_person, id_picture)
);


CREATE TABLE public.natural_persons (
                id_natural_person BIGINT NOT NULL,
                name TEXT NOT NULL,
                surname TEXT NOT NULL,
                CONSTRAINT natural_persons_pk PRIMARY KEY (id_natural_person)
);


CREATE TABLE public.accounts (
                id_account BIGINT NOT NULL,
                password TEXT NOT NULL,
                CONSTRAINT accounts_pk PRIMARY KEY (id_account)
);


ALTER TABLE public.persons_emails ADD CONSTRAINT emails_persons_emails_fk
FOREIGN KEY (id_email)
REFERENCES public.emails (id_email)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.persons_pictures ADD CONSTRAINT pictures_new_table_fk
FOREIGN KEY (id_picture)
REFERENCES public.pictures (id_picture)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.persons_groups ADD CONSTRAINT groups_persons_groups_fk
FOREIGN KEY (id_group)
REFERENCES public.groups (id_group)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.persons ADD CONSTRAINT legal_persons_persons_fk
FOREIGN KEY (id_legal_person)
REFERENCES public.legal_persons (id_legal_person)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.natural_persons ADD CONSTRAINT persons_natural_persons_fk
FOREIGN KEY (id_natural_person)
REFERENCES public.persons (id_person)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.persons_pictures ADD CONSTRAINT persons_new_table_fk
FOREIGN KEY (id_person)
REFERENCES public.persons (id_person)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.persons_groups ADD CONSTRAINT persons_persons_groups_fk
FOREIGN KEY (id_person)
REFERENCES public.persons (id_person)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.persons_emails ADD CONSTRAINT persons_persons_emails_fk
FOREIGN KEY (id_person)
REFERENCES public.persons (id_person)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.aliases ADD CONSTRAINT persons_aliases_fk
FOREIGN KEY (id_person)
REFERENCES public.persons (id_person)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.accounts ADD CONSTRAINT natural_persons_accounts_fk
FOREIGN KEY (id_account)
REFERENCES public.natural_persons (id_natural_person)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;
