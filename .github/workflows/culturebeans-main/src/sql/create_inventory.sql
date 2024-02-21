CREATE TABLE IF NOT EXISTS public.inventory
(
    id integer NOT NULL DEFAULT nextval('inventory_id_seq'::regclass),
    process_id integer,
    process processes,
    item text COLLATE pg_catalog."default",
    amount numeric,
    package_size numeric,
    total numeric GENERATED ALWAYS AS ((amount * package_size)) STORED,
    unit text COLLATE pg_catalog."default",
    CONSTRAINT inventory_pkey PRIMARY KEY (id)
)