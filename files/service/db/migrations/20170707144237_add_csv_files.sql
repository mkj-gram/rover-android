-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied

--
-- Name: csv_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE csv_files (
    id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    filename TEXT,
    generated_filename TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    num_rows INTEGER NOT NULL,
    samples TEXT[][],
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);


--
-- Name: csv_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE csv_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: csv_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE csv_files_id_seq OWNED BY csv_files.id;

--
-- Name: csv_files id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY csv_files ALTER COLUMN id SET DEFAULT nextval('csv_files_id_seq'::regclass);

--
-- Name: csv_files csv_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY csv_files ADD CONSTRAINT csv_files_pkey PRIMARY KEY (id);

--
-- Name: csv_files_account_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX csv_files_account_id_index ON csv_files USING btree (account_id);

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back

DROP TABLE csv_files;
DROP SEQUENCE IF EXISTS csv_files_id_seq;
DROP INDEX IF EXISTS csv_files_account_id_index ;
