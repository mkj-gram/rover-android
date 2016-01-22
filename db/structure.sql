--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: account_invites; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE account_invites (
    id integer NOT NULL,
    account_id integer NOT NULL,
    issuer_id integer NOT NULL,
    invited_email text NOT NULL,
    token text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: account_invites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE account_invites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_invites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE account_invites_id_seq OWNED BY account_invites.id;


--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE accounts (
    id integer NOT NULL,
    title text,
    primary_user_id integer,
    token text NOT NULL,
    share_key text NOT NULL,
    users_count integer DEFAULT 0,
    locations_count integer DEFAULT 0,
    searchable_beacon_configurations_count integer DEFAULT 0,
    account_invites_count integer DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE accounts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE accounts_id_seq OWNED BY accounts.id;


--
-- Name: beacon_configuration_active_tags_indices; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE beacon_configuration_active_tags_indices (
    id integer NOT NULL,
    account_id integer NOT NULL,
    tags character varying[] DEFAULT '{}'::character varying[]
);


--
-- Name: beacon_configuration_active_tags_indices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE beacon_configuration_active_tags_indices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: beacon_configuration_active_tags_indices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE beacon_configuration_active_tags_indices_id_seq OWNED BY beacon_configuration_active_tags_indices.id;


--
-- Name: beacon_configurations; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE beacon_configurations (
    id integer NOT NULL,
    account_id integer NOT NULL,
    location_id integer,
    type character varying NOT NULL,
    title text,
    tags character varying[] DEFAULT '{}'::character varying[],
    enabled boolean DEFAULT true,
    shared boolean DEFAULT false,
    uuid character varying,
    major integer,
    minor integer,
    namespace character varying,
    instance_id character varying,
    url text,
    beacon_devices_updated_at timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: beacon_configurations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE beacon_configurations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: beacon_configurations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE beacon_configurations_id_seq OWNED BY beacon_configurations.id;


--
-- Name: beacon_devices; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE beacon_devices (
    id integer NOT NULL,
    third_party_integration_id integer NOT NULL,
    manufacturer_id character varying NOT NULL,
    type character varying NOT NULL,
    uuid character varying,
    major integer,
    minor integer,
    namespace character varying,
    instance_id character varying,
    url text,
    device_data jsonb DEFAULT '{}'::jsonb
);


--
-- Name: beacon_devices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE beacon_devices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: beacon_devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE beacon_devices_id_seq OWNED BY beacon_devices.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE locations (
    id integer NOT NULL,
    account_id integer NOT NULL,
    name text,
    address text,
    city text,
    province_state text,
    postal_zip text,
    country text,
    latitude numeric,
    longitude numeric,
    radius integer,
    google_place_id text,
    tags text[] DEFAULT '{}'::text[],
    beacon_configurations_count integer DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE locations_id_seq OWNED BY locations.id;


--
-- Name: password_resets; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE password_resets (
    id integer NOT NULL,
    user_id integer NOT NULL,
    email text NOT NULL,
    token text NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


--
-- Name: password_resets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE password_resets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: password_resets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE password_resets_id_seq OWNED BY password_resets.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE schema_migrations (
    version character varying NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE sessions (
    id integer NOT NULL,
    account_id integer,
    user_id integer,
    token character varying
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE sessions_id_seq OWNED BY sessions.id;


--
-- Name: shared_beacon_configurations; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE shared_beacon_configurations (
    id integer NOT NULL,
    owner_account_id integer,
    shared_account_id integer,
    beacon_configuration_id integer
);


--
-- Name: shared_beacon_configurations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE shared_beacon_configurations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shared_beacon_configurations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE shared_beacon_configurations_id_seq OWNED BY shared_beacon_configurations.id;


--
-- Name: third_party_integration_sync_jobs; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE third_party_integration_sync_jobs (
    id integer NOT NULL,
    third_party_integration_id integer NOT NULL,
    status integer DEFAULT 0,
    started_at timestamp without time zone,
    finished_at timestamp without time zone,
    error_message text,
    added_devices_count integer DEFAULT 0,
    modified_devices_count integer DEFAULT 0,
    removed_devices_count integer DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: third_party_integration_sync_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE third_party_integration_sync_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: third_party_integration_sync_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE third_party_integration_sync_jobs_id_seq OWNED BY third_party_integration_sync_jobs.id;


--
-- Name: third_party_integrations; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE third_party_integrations (
    id integer NOT NULL,
    account_id integer NOT NULL,
    type character varying NOT NULL,
    syncing boolean DEFAULT false,
    enabled boolean DEFAULT true,
    encrypted_credentials character varying,
    encrypted_credentials_salt character varying,
    encrypted_credentials_iv character varying,
    average_sync_time_in_ms integer DEFAULT 0,
    last_synced_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: third_party_integrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE third_party_integrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: third_party_integrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE third_party_integrations_id_seq OWNED BY third_party_integrations.id;


--
-- Name: user_acls; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE user_acls (
    user_id integer NOT NULL,
    admin boolean DEFAULT false,
    users_index boolean DEFAULT true,
    users_show boolean DEFAULT true,
    users_create boolean DEFAULT true,
    users_update boolean DEFAULT false,
    users_destroy boolean DEFAULT false,
    locations_index boolean DEFAULT true,
    locations_show boolean DEFAULT true,
    locations_create boolean DEFAULT true,
    locations_update boolean DEFAULT true,
    locations_destroy boolean DEFAULT false
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    name character varying,
    email character varying NOT NULL,
    password_digest character varying NOT NULL,
    account_id integer NOT NULL,
    account_owner boolean DEFAULT false,
    acl_updated_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY account_invites ALTER COLUMN id SET DEFAULT nextval('account_invites_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY accounts ALTER COLUMN id SET DEFAULT nextval('accounts_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY beacon_configuration_active_tags_indices ALTER COLUMN id SET DEFAULT nextval('beacon_configuration_active_tags_indices_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY beacon_configurations ALTER COLUMN id SET DEFAULT nextval('beacon_configurations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY beacon_devices ALTER COLUMN id SET DEFAULT nextval('beacon_devices_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY locations ALTER COLUMN id SET DEFAULT nextval('locations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY password_resets ALTER COLUMN id SET DEFAULT nextval('password_resets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY sessions ALTER COLUMN id SET DEFAULT nextval('sessions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY shared_beacon_configurations ALTER COLUMN id SET DEFAULT nextval('shared_beacon_configurations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY third_party_integration_sync_jobs ALTER COLUMN id SET DEFAULT nextval('third_party_integration_sync_jobs_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY third_party_integrations ALTER COLUMN id SET DEFAULT nextval('third_party_integrations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: account_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY account_invites
    ADD CONSTRAINT account_invites_pkey PRIMARY KEY (id);


--
-- Name: accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: beacon_configuration_active_tags_indices_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY beacon_configuration_active_tags_indices
    ADD CONSTRAINT beacon_configuration_active_tags_indices_pkey PRIMARY KEY (id);


--
-- Name: beacon_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY beacon_configurations
    ADD CONSTRAINT beacon_configurations_pkey PRIMARY KEY (id);


--
-- Name: beacon_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY beacon_devices
    ADD CONSTRAINT beacon_devices_pkey PRIMARY KEY (id);


--
-- Name: locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: password_resets_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY password_resets
    ADD CONSTRAINT password_resets_pkey PRIMARY KEY (id);


--
-- Name: sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: shared_beacon_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY shared_beacon_configurations
    ADD CONSTRAINT shared_beacon_configurations_pkey PRIMARY KEY (id);


--
-- Name: third_party_integration_sync_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY third_party_integration_sync_jobs
    ADD CONSTRAINT third_party_integration_sync_jobs_pkey PRIMARY KEY (id);


--
-- Name: third_party_integrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY third_party_integrations
    ADD CONSTRAINT third_party_integrations_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: account_eddystone_namespace_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX account_eddystone_namespace_index ON beacon_configurations USING btree (account_id, namespace, instance_id);


--
-- Name: account_ibeacon_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX account_ibeacon_index ON beacon_configurations USING btree (account_id, uuid, major, minor);


--
-- Name: beacon_configurations_type_created_at_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX beacon_configurations_type_created_at_index ON beacon_configurations USING btree (account_id, type, created_at);


--
-- Name: eddystone_namespace_unique_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX eddystone_namespace_unique_index ON beacon_configurations USING btree (namespace, instance_id);


--
-- Name: ibeacon_unique_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX ibeacon_unique_index ON beacon_configurations USING btree (uuid, major, minor);


--
-- Name: index_account_invites_on_invited_email; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_account_invites_on_invited_email ON account_invites USING btree (invited_email);


--
-- Name: index_account_invites_on_token; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_account_invites_on_token ON account_invites USING btree (token);


--
-- Name: index_accounts_on_share_key; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_accounts_on_share_key ON accounts USING btree (share_key);


--
-- Name: index_accounts_on_token; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_accounts_on_token ON accounts USING btree (token);


--
-- Name: index_beacon_configuration_active_tags_indices_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_beacon_configuration_active_tags_indices_on_account_id ON beacon_configuration_active_tags_indices USING btree (account_id);


--
-- Name: index_beacon_configuration_active_tags_indices_on_tags; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_configuration_active_tags_indices_on_tags ON beacon_configuration_active_tags_indices USING gin (tags);


--
-- Name: index_beacon_configurations_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_configurations_on_account_id ON beacon_configurations USING btree (account_id);


--
-- Name: index_beacon_configurations_on_account_id_and_type; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_configurations_on_account_id_and_type ON beacon_configurations USING btree (account_id, type);


--
-- Name: index_beacon_configurations_on_location_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_configurations_on_location_id ON beacon_configurations USING btree (location_id);


--
-- Name: index_beacon_configurations_on_url; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_beacon_configurations_on_url ON beacon_configurations USING btree (url);


--
-- Name: index_beacon_configurations_on_uuid; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_configurations_on_uuid ON beacon_configurations USING btree (uuid);


--
-- Name: index_beacon_devices_on_manufacturer_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_beacon_devices_on_manufacturer_id ON beacon_devices USING btree (manufacturer_id);


--
-- Name: index_beacon_devices_on_namespace_and_instance_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_devices_on_namespace_and_instance_id ON beacon_devices USING btree (namespace, instance_id);


--
-- Name: index_beacon_devices_on_third_party_integration_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_devices_on_third_party_integration_id ON beacon_devices USING btree (third_party_integration_id);


--
-- Name: index_beacon_devices_on_url; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_devices_on_url ON beacon_devices USING btree (url);


--
-- Name: index_beacon_devices_on_uuid_and_major_and_minor; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_devices_on_uuid_and_major_and_minor ON beacon_devices USING btree (uuid, major, minor);


--
-- Name: index_locations_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_locations_on_account_id ON locations USING btree (account_id);


--
-- Name: index_password_resets_on_email; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_password_resets_on_email ON password_resets USING btree (email);


--
-- Name: index_password_resets_on_token; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_password_resets_on_token ON password_resets USING btree (token);


--
-- Name: index_password_resets_on_user_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_password_resets_on_user_id ON password_resets USING btree (user_id);


--
-- Name: index_sessions_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_sessions_on_account_id ON sessions USING btree (account_id);


--
-- Name: index_sessions_on_token; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_sessions_on_token ON sessions USING btree (token);


--
-- Name: index_shared_beacon_configurations_on_owner_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_shared_beacon_configurations_on_owner_account_id ON shared_beacon_configurations USING btree (owner_account_id);


--
-- Name: index_shared_beacon_configurations_on_shared_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_shared_beacon_configurations_on_shared_account_id ON shared_beacon_configurations USING btree (shared_account_id);


--
-- Name: index_third_party_integrations_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_third_party_integrations_on_account_id ON third_party_integrations USING btree (account_id);


--
-- Name: index_third_party_integrations_on_account_id_and_enabled; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_third_party_integrations_on_account_id_and_enabled ON third_party_integrations USING btree (account_id, enabled);


--
-- Name: index_third_party_integrations_on_account_id_and_type; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_third_party_integrations_on_account_id_and_type ON third_party_integrations USING btree (account_id, type);


--
-- Name: index_user_acls_on_user_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_user_acls_on_user_id ON user_acls USING btree (user_id);


--
-- Name: index_users_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_users_on_account_id ON users USING btree (account_id);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_users_on_email ON users USING btree (email);


--
-- Name: integration_sync_job_integration_id_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX integration_sync_job_integration_id_index ON third_party_integration_sync_jobs USING btree (third_party_integration_id);


--
-- Name: unique_schema_migrations; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX unique_schema_migrations ON schema_migrations USING btree (version);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user",public;

INSERT INTO schema_migrations (version) VALUES ('20151229224601');

INSERT INTO schema_migrations (version) VALUES ('20151229224818');

INSERT INTO schema_migrations (version) VALUES ('20151230184006');

INSERT INTO schema_migrations (version) VALUES ('20151230194352');

INSERT INTO schema_migrations (version) VALUES ('20151231222124');

INSERT INTO schema_migrations (version) VALUES ('20160102004249');

INSERT INTO schema_migrations (version) VALUES ('20160102004639');

INSERT INTO schema_migrations (version) VALUES ('20160102124353');

INSERT INTO schema_migrations (version) VALUES ('20160107180658');

INSERT INTO schema_migrations (version) VALUES ('20160113155223');

INSERT INTO schema_migrations (version) VALUES ('20160115015155');

INSERT INTO schema_migrations (version) VALUES ('20160118182842');

INSERT INTO schema_migrations (version) VALUES ('20160119151429');

INSERT INTO schema_migrations (version) VALUES ('20160120003440');

INSERT INTO schema_migrations (version) VALUES ('20160121135943');

