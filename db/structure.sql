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


--
-- Name: btree_gin; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gin WITH SCHEMA public;


--
-- Name: EXTENSION btree_gin; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION btree_gin IS 'support for indexing common datatypes in GIN';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


SET search_path = public, pg_catalog;

--
-- Name: array_distinct(anyarray); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION array_distinct(anyarray) RETURNS anyarray
    LANGUAGE sql
    AS $_$
                SELECT ARRAY(SELECT DISTINCT unnest($1))
                $_$;


--
-- Name: array_subtraction(anyarray, anyarray); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION array_subtraction(anyarray, anyarray) RETURNS anyarray
    LANGUAGE sql
    AS $_$
                SELECT ARRAY(SELECT unnest($1)
                             EXCEPT
                             SELECT unnest($2))
                $_$;


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
    default_user_role_id integer,
    users_count integer DEFAULT 0,
    places_count integer DEFAULT 0,
    beacon_configurations_count integer DEFAULT 0,
    searchable_beacon_configurations_count integer DEFAULT 0,
    searchable_places_count integer DEFAULT 0,
    account_invites_count integer DEFAULT 0,
    gimbal_places_count integer DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    customers_count integer DEFAULT 0,
    message_limits hstore[] DEFAULT '{}'::hstore[],
    proximity_message_templates_draft_count integer DEFAULT 0,
    proximity_message_templates_published_count integer DEFAULT 0,
    proximity_message_templates_archived_count integer DEFAULT 0,
    ios_platform_name character varying,
    android_platform_name character varying
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
-- Name: active_configuration_uuids; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE active_configuration_uuids (
    id integer NOT NULL,
    account_id integer,
    type character varying,
    configuration_uuids character varying[] DEFAULT '{}'::character varying[]
);


--
-- Name: active_configuration_uuids_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE active_configuration_uuids_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: active_configuration_uuids_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE active_configuration_uuids_id_seq OWNED BY active_configuration_uuids.id;


--
-- Name: active_tags; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE active_tags (
    id integer NOT NULL,
    account_id integer,
    type character varying,
    tags character varying[] DEFAULT '{}'::character varying[]
);


--
-- Name: active_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE active_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: active_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE active_tags_id_seq OWNED BY active_tags.id;


--
-- Name: android_platforms; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE android_platforms (
    id integer NOT NULL,
    account_id integer NOT NULL,
    title character varying,
    package_name character varying,
    encrypted_credentials text,
    encrypted_credentials_salt text,
    encrypted_credentials_iv text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: android_platforms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE android_platforms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: android_platforms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE android_platforms_id_seq OWNED BY android_platforms.id;


--
-- Name: beacon_configurations; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE beacon_configurations (
    id integer NOT NULL,
    account_id integer NOT NULL,
    place_id integer,
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
    updated_at timestamp without time zone,
    registered_with_google boolean DEFAULT false,
    has_pending_google_updates boolean DEFAULT false,
    indoor_level character varying,
    google_beacon_name character varying,
    google_sync_error boolean DEFAULT false
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
    account_id integer NOT NULL,
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
-- Name: customer_active_traits; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE customer_active_traits (
    id integer NOT NULL,
    account_id integer NOT NULL,
    trait_key character varying,
    trait_type character varying
);


--
-- Name: customer_active_traits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE customer_active_traits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_active_traits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE customer_active_traits_id_seq OWNED BY customer_active_traits.id;


--
-- Name: customer_devices; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE customer_devices (
    id integer NOT NULL,
    account_id integer NOT NULL,
    customer_id integer NOT NULL,
    udid uuid NOT NULL,
    token character varying,
    locale_lang character varying,
    locale_region character varying,
    time_zone character varying,
    sdk_version character varying,
    platform character varying,
    os_name character varying,
    os_version character varying,
    model character varying,
    manufacturer character varying,
    carrier character varying,
    aid character varying,
    background_enabled boolean,
    local_notifications_enabled boolean,
    remote_notifications_enabled boolean,
    location_monitoring_enabled boolean,
    bluetooth_enabled boolean
);


--
-- Name: customer_devices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE customer_devices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE customer_devices_id_seq OWNED BY customer_devices.id;


--
-- Name: customer_segments; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE customer_segments (
    id integer NOT NULL,
    account_id integer NOT NULL,
    title character varying,
    filters jsonb[] DEFAULT '{}'::jsonb[],
    approximate_customers_count integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: customer_segments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE customer_segments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_segments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE customer_segments_id_seq OWNED BY customer_segments.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE customers (
    id integer NOT NULL,
    account_id integer NOT NULL,
    identifier character varying,
    name character varying,
    email character varying,
    phone_number character varying,
    tags character varying[] DEFAULT '{}'::character varying[],
    traits jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE customers_id_seq OWNED BY customers.id;


--
-- Name: gimbal_places; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE gimbal_places (
    account_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: ios_platforms; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE ios_platforms (
    id integer NOT NULL,
    account_id integer NOT NULL,
    title character varying,
    bundle_id character varying,
    encrypted_credentials text,
    encrypted_credentials_salt text,
    encrypted_credentials_iv text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: ios_platforms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE ios_platforms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ios_platforms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE ios_platforms_id_seq OWNED BY ios_platforms.id;


--
-- Name: message_templates; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE message_templates (
    id integer NOT NULL,
    account_id integer NOT NULL,
    type character varying NOT NULL,
    title character varying,
    tags character varying[],
    notification_text text,
    published boolean DEFAULT false,
    archived boolean DEFAULT false,
    save_to_inbox boolean DEFAULT true,
    date_schedule int4range DEFAULT '(,)'::int4range,
    time_schedule int4range DEFAULT '[0,1441)'::int4range,
    schedule_monday boolean DEFAULT true,
    schedule_tuesday boolean DEFAULT true,
    schedule_wednesday boolean DEFAULT true,
    schedule_thursday boolean DEFAULT true,
    schedule_friday boolean DEFAULT true,
    schedule_saturday boolean DEFAULT true,
    schedule_sunday boolean DEFAULT true,
    trigger_event_id integer,
    dwell_time_in_seconds integer,
    customer_segment_id integer,
    limits hstore[],
    filter_beacon_configuration_tags character varying[],
    filter_beacon_configuration_ids integer[],
    filter_place_tags character varying[],
    filter_place_ids integer[],
    filter_gimbal_place_id character varying,
    content_type character varying,
    website_url character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    scheduled_at timestamp without time zone,
    scheduled_local_time boolean DEFAULT false,
    scheduled_token character varying,
    ios_title character varying,
    android_title character varying,
    android_collapse_key character varying,
    ios_sound_file character varying,
    android_sound_file character varying,
    time_to_live integer,
    landing_page_template jsonb,
    properties jsonb,
    deeplink_url character varying
);


--
-- Name: message_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE message_templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE message_templates_id_seq OWNED BY message_templates.id;


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
-- Name: places; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE places (
    id integer NOT NULL,
    account_id integer NOT NULL,
    title character varying,
    address text,
    city text,
    province text,
    country character varying,
    postal_code character varying,
    latitude numeric(10,6),
    longitude numeric(10,6),
    radius integer DEFAULT 50,
    tags text[] DEFAULT '{}'::text[],
    google_place_id text,
    enabled boolean DEFAULT true,
    shared boolean DEFAULT false,
    beacon_configurations_count integer DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: places_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE places_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: places_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE places_id_seq OWNED BY places.id;


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
    token character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
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
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    type character varying,
    stats jsonb DEFAULT '{}'::jsonb
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
    updated_at timestamp without time zone NOT NULL,
    third_party_integration_sync_jobs_count integer DEFAULT 0,
    google_project_id character varying
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
    id integer NOT NULL,
    user_id integer NOT NULL,
    user_role_ids integer[] DEFAULT '{}'::integer[],
    account_show boolean DEFAULT true,
    account_create boolean DEFAULT true,
    account_update boolean DEFAULT true,
    account_destroy boolean DEFAULT true,
    user_show boolean DEFAULT true,
    user_create boolean DEFAULT true,
    user_update boolean DEFAULT true,
    user_destroy boolean DEFAULT true,
    beacon_configuration_show boolean DEFAULT true,
    beacon_configuration_create boolean DEFAULT true,
    beacon_configuration_update boolean DEFAULT true,
    beacon_configuration_destroy boolean DEFAULT true,
    place_show boolean DEFAULT true,
    place_create boolean DEFAULT true,
    place_update boolean DEFAULT true,
    place_destroy boolean DEFAULT true,
    customer_show boolean DEFAULT true,
    customer_create boolean DEFAULT true,
    customer_update boolean DEFAULT true,
    customer_destroy boolean DEFAULT true,
    customer_segment_show boolean DEFAULT true,
    customer_segment_create boolean DEFAULT true,
    customer_segment_update boolean DEFAULT true,
    customer_segment_destroy boolean DEFAULT true,
    proximity_message_template_show boolean DEFAULT true,
    proximity_message_template_create boolean DEFAULT true,
    proximity_message_template_update boolean DEFAULT true,
    proximity_message_template_destroy boolean DEFAULT true,
    scheduled_message_template_show boolean DEFAULT true,
    scheduled_message_template_create boolean DEFAULT true,
    scheduled_message_template_update boolean DEFAULT true,
    scheduled_message_template_destroy boolean DEFAULT true,
    automated_message_template_show boolean DEFAULT true,
    automated_message_template_create boolean DEFAULT true,
    automated_message_template_update boolean DEFAULT true,
    automated_message_template_destroy boolean DEFAULT true,
    third_party_integration_show boolean DEFAULT true,
    third_party_integration_create boolean DEFAULT true,
    third_party_integration_update boolean DEFAULT true,
    third_party_integration_destroy boolean DEFAULT true,
    account_invite_show boolean DEFAULT true,
    account_invite_create boolean DEFAULT true,
    account_invite_update boolean DEFAULT true,
    account_invite_destroy boolean DEFAULT true,
    user_acl_show boolean DEFAULT true,
    user_acl_create boolean DEFAULT true,
    user_acl_update boolean DEFAULT true,
    user_acl_destroy boolean DEFAULT true,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    platform_show boolean DEFAULT true,
    platform_create boolean DEFAULT true,
    platform_update boolean DEFAULT true,
    platform_destroy boolean DEFAULT true
);


--
-- Name: user_acls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_acls_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_acls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE user_acls_id_seq OWNED BY user_acls.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE user_roles (
    id integer NOT NULL,
    account_id integer NOT NULL,
    title character varying,
    description text,
    account_show boolean DEFAULT true,
    account_create boolean DEFAULT true,
    account_update boolean DEFAULT true,
    account_destroy boolean DEFAULT true,
    user_show boolean DEFAULT true,
    user_create boolean DEFAULT true,
    user_update boolean DEFAULT true,
    user_destroy boolean DEFAULT true,
    beacon_configuration_show boolean DEFAULT true,
    beacon_configuration_create boolean DEFAULT true,
    beacon_configuration_update boolean DEFAULT true,
    beacon_configuration_destroy boolean DEFAULT true,
    place_show boolean DEFAULT true,
    place_create boolean DEFAULT true,
    place_update boolean DEFAULT true,
    place_destroy boolean DEFAULT true,
    customer_show boolean DEFAULT true,
    customer_create boolean DEFAULT true,
    customer_update boolean DEFAULT true,
    customer_destroy boolean DEFAULT true,
    customer_segment_show boolean DEFAULT true,
    customer_segment_create boolean DEFAULT true,
    customer_segment_update boolean DEFAULT true,
    customer_segment_destroy boolean DEFAULT true,
    proximity_message_template_show boolean DEFAULT true,
    proximity_message_template_create boolean DEFAULT true,
    proximity_message_template_update boolean DEFAULT true,
    proximity_message_template_destroy boolean DEFAULT true,
    scheduled_message_template_show boolean DEFAULT true,
    scheduled_message_template_create boolean DEFAULT true,
    scheduled_message_template_update boolean DEFAULT true,
    scheduled_message_template_destroy boolean DEFAULT true,
    automated_message_template_show boolean DEFAULT true,
    automated_message_template_create boolean DEFAULT true,
    automated_message_template_update boolean DEFAULT true,
    automated_message_template_destroy boolean DEFAULT true,
    third_party_integration_show boolean DEFAULT true,
    third_party_integration_create boolean DEFAULT true,
    third_party_integration_update boolean DEFAULT true,
    third_party_integration_destroy boolean DEFAULT true,
    account_invite_show boolean DEFAULT true,
    account_invite_create boolean DEFAULT true,
    account_invite_update boolean DEFAULT true,
    account_invite_destroy boolean DEFAULT true,
    user_acl_show boolean DEFAULT true,
    user_acl_create boolean DEFAULT true,
    user_acl_update boolean DEFAULT true,
    user_acl_destroy boolean DEFAULT true,
    user_ids integer[] DEFAULT '{}'::integer[],
    platform_show boolean DEFAULT true,
    platform_create boolean DEFAULT true,
    platform_update boolean DEFAULT true,
    platform_destroy boolean DEFAULT true
);


--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE user_roles_id_seq OWNED BY user_roles.id;


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
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    user_acl_id integer,
    user_acl_updated_at timestamp without time zone
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

ALTER TABLE ONLY active_configuration_uuids ALTER COLUMN id SET DEFAULT nextval('active_configuration_uuids_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY active_tags ALTER COLUMN id SET DEFAULT nextval('active_tags_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY android_platforms ALTER COLUMN id SET DEFAULT nextval('android_platforms_id_seq'::regclass);


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

ALTER TABLE ONLY customer_active_traits ALTER COLUMN id SET DEFAULT nextval('customer_active_traits_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY customer_devices ALTER COLUMN id SET DEFAULT nextval('customer_devices_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY customer_segments ALTER COLUMN id SET DEFAULT nextval('customer_segments_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY customers ALTER COLUMN id SET DEFAULT nextval('customers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY ios_platforms ALTER COLUMN id SET DEFAULT nextval('ios_platforms_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY message_templates ALTER COLUMN id SET DEFAULT nextval('message_templates_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY password_resets ALTER COLUMN id SET DEFAULT nextval('password_resets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY places ALTER COLUMN id SET DEFAULT nextval('places_id_seq'::regclass);


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

ALTER TABLE ONLY user_acls ALTER COLUMN id SET DEFAULT nextval('user_acls_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_roles ALTER COLUMN id SET DEFAULT nextval('user_roles_id_seq'::regclass);


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
-- Name: active_configuration_uuids_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY active_configuration_uuids
    ADD CONSTRAINT active_configuration_uuids_pkey PRIMARY KEY (id);


--
-- Name: active_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY active_tags
    ADD CONSTRAINT active_tags_pkey PRIMARY KEY (id);


--
-- Name: android_platforms_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY android_platforms
    ADD CONSTRAINT android_platforms_pkey PRIMARY KEY (id);


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
-- Name: customer_active_traits_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY customer_active_traits
    ADD CONSTRAINT customer_active_traits_pkey PRIMARY KEY (id);


--
-- Name: customer_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY customer_devices
    ADD CONSTRAINT customer_devices_pkey PRIMARY KEY (id);


--
-- Name: customer_segments_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY customer_segments
    ADD CONSTRAINT customer_segments_pkey PRIMARY KEY (id);


--
-- Name: customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: ios_platforms_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY ios_platforms
    ADD CONSTRAINT ios_platforms_pkey PRIMARY KEY (id);


--
-- Name: message_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY message_templates
    ADD CONSTRAINT message_templates_pkey PRIMARY KEY (id);


--
-- Name: password_resets_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY password_resets
    ADD CONSTRAINT password_resets_pkey PRIMARY KEY (id);


--
-- Name: places_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY places
    ADD CONSTRAINT places_pkey PRIMARY KEY (id);


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
-- Name: user_acls_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY user_acls
    ADD CONSTRAINT user_acls_pkey PRIMARY KEY (id);


--
-- Name: user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: account_eddystone_namespace_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX account_eddystone_namespace_index ON beacon_configurations USING btree (account_id, namespace, instance_id);


--
-- Name: account_ibeacon_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX account_ibeacon_index ON beacon_configurations USING btree (account_id, uuid, major, minor);


--
-- Name: beacon_configurations_pending_google_updates; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX beacon_configurations_pending_google_updates ON beacon_configurations USING btree (account_id, has_pending_google_updates);


--
-- Name: beacon_configurations_registered_with_google; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX beacon_configurations_registered_with_google ON beacon_configurations USING btree (account_id, registered_with_google);


--
-- Name: beacon_configurations_type_created_at_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX beacon_configurations_type_created_at_index ON beacon_configurations USING btree (account_id, type, created_at);


--
-- Name: index_account_eddystone_devices; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_account_eddystone_devices ON beacon_devices USING btree (account_id, namespace, instance_id);


--
-- Name: index_account_ibeacon_devices; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_account_ibeacon_devices ON beacon_devices USING btree (account_id, uuid, major, minor);


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
-- Name: index_active_configuration_uuids_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_active_configuration_uuids_on_account_id ON active_configuration_uuids USING btree (account_id);


--
-- Name: index_active_configuration_uuids_on_account_id_and_type; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_active_configuration_uuids_on_account_id_and_type ON active_configuration_uuids USING btree (account_id, type);


--
-- Name: index_active_tags_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_active_tags_on_account_id ON active_tags USING btree (account_id);


--
-- Name: index_active_tags_on_account_id_and_type; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_active_tags_on_account_id_and_type ON active_tags USING btree (account_id, type);


--
-- Name: index_android_platforms_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_android_platforms_on_account_id ON android_platforms USING btree (account_id);


--
-- Name: index_beacon_configurations_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_configurations_on_account_id ON beacon_configurations USING btree (account_id);


--
-- Name: index_beacon_configurations_on_account_id_and_tags; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_configurations_on_account_id_and_tags ON beacon_configurations USING gin (account_id, tags);


--
-- Name: index_beacon_configurations_on_account_id_and_type; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_configurations_on_account_id_and_type ON beacon_configurations USING btree (account_id, type);


--
-- Name: index_beacon_configurations_on_google_beacon_name; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_configurations_on_google_beacon_name ON beacon_configurations USING btree (google_beacon_name);


--
-- Name: index_beacon_configurations_on_place_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_configurations_on_place_id ON beacon_configurations USING btree (place_id);


--
-- Name: index_beacon_configurations_on_url; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_beacon_configurations_on_url ON beacon_configurations USING btree (url);


--
-- Name: index_beacon_configurations_on_uuid; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_configurations_on_uuid ON beacon_configurations USING btree (uuid);


--
-- Name: index_beacon_devices_on_account_id_and_manufacturer_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_beacon_devices_on_account_id_and_manufacturer_id ON beacon_devices USING btree (account_id, manufacturer_id);


--
-- Name: index_beacon_devices_on_account_id_and_url; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_devices_on_account_id_and_url ON beacon_devices USING btree (account_id, url);


--
-- Name: index_beacon_devices_on_third_party_integration_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_beacon_devices_on_third_party_integration_id ON beacon_devices USING btree (third_party_integration_id);


--
-- Name: index_customer_active_traits_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_customer_active_traits_on_account_id ON customer_active_traits USING btree (account_id);


--
-- Name: index_customer_active_traits_on_account_id_and_trait_key; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_customer_active_traits_on_account_id_and_trait_key ON customer_active_traits USING btree (account_id, trait_key);


--
-- Name: index_customer_devices_on_udid; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_customer_devices_on_udid ON customer_devices USING btree (udid);


--
-- Name: index_customer_segments_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_customer_segments_on_account_id ON customer_segments USING btree (account_id);


--
-- Name: index_customers_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_customers_on_account_id ON customers USING btree (account_id);


--
-- Name: index_customers_on_account_id_and_identifier; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_customers_on_account_id_and_identifier ON customers USING btree (account_id, identifier);


--
-- Name: index_customers_on_account_id_and_traits; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_customers_on_account_id_and_traits ON customers USING gin (account_id, traits);


--
-- Name: index_gimbal_places_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_gimbal_places_on_account_id ON gimbal_places USING btree (account_id);


--
-- Name: index_gimbal_places_on_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_gimbal_places_on_id ON gimbal_places USING btree (id);


--
-- Name: index_ios_platforms_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_ios_platforms_on_account_id ON ios_platforms USING btree (account_id);


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
-- Name: index_places_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_places_on_account_id ON places USING btree (account_id);


--
-- Name: index_places_on_account_id_and_latitude_and_longitude; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_places_on_account_id_and_latitude_and_longitude ON places USING btree (account_id, latitude, longitude);


--
-- Name: index_places_on_account_id_and_tags; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_places_on_account_id_and_tags ON places USING gin (account_id, tags);


--
-- Name: index_published_proximity_messages_by_trigger_event_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_published_proximity_messages_by_trigger_event_id ON message_templates USING btree (account_id, type, published, trigger_event_id) WHERE ((published = true) AND ((type)::text = 'ProximityMessageTemplate'::text));


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
-- Name: index_third_party_integrations_on_google_project_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_third_party_integrations_on_google_project_id ON third_party_integrations USING btree (google_project_id);


--
-- Name: index_user_acls_on_user_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_user_acls_on_user_id ON user_acls USING btree (user_id);


--
-- Name: index_user_roles_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_user_roles_on_account_id ON user_roles USING btree (account_id);


--
-- Name: index_users_on_account_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_users_on_account_id ON users USING btree (account_id);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_users_on_email ON users USING btree (email);


--
-- Name: integration_sync_job_integration_created_at_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX integration_sync_job_integration_created_at_index ON third_party_integration_sync_jobs USING btree (created_at DESC NULLS LAST);


--
-- Name: integration_sync_job_integration_finished_at_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX integration_sync_job_integration_finished_at_index ON third_party_integration_sync_jobs USING btree (finished_at DESC NULLS LAST);


--
-- Name: integration_sync_job_integration_id_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX integration_sync_job_integration_id_index ON third_party_integration_sync_jobs USING btree (third_party_integration_id);


--
-- Name: integration_sync_job_integration_started_at_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX integration_sync_job_integration_started_at_index ON third_party_integration_sync_jobs USING btree (started_at DESC NULLS LAST);


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

INSERT INTO schema_migrations (version) VALUES ('20160107180658');

INSERT INTO schema_migrations (version) VALUES ('20160113155223');

INSERT INTO schema_migrations (version) VALUES ('20160115015155');

INSERT INTO schema_migrations (version) VALUES ('20160119151429');

INSERT INTO schema_migrations (version) VALUES ('20160120003440');

INSERT INTO schema_migrations (version) VALUES ('20160121135943');

INSERT INTO schema_migrations (version) VALUES ('20160125152740');

INSERT INTO schema_migrations (version) VALUES ('20160125174600');

INSERT INTO schema_migrations (version) VALUES ('20160127133932');

INSERT INTO schema_migrations (version) VALUES ('20160204155417');

INSERT INTO schema_migrations (version) VALUES ('20160204155855');

INSERT INTO schema_migrations (version) VALUES ('20160211141152');

INSERT INTO schema_migrations (version) VALUES ('20160211142442');

INSERT INTO schema_migrations (version) VALUES ('20160211151337');

INSERT INTO schema_migrations (version) VALUES ('20160211180935');

INSERT INTO schema_migrations (version) VALUES ('20160211200011');

INSERT INTO schema_migrations (version) VALUES ('20160211202819');

INSERT INTO schema_migrations (version) VALUES ('20160225140703');

INSERT INTO schema_migrations (version) VALUES ('20160301142503');

INSERT INTO schema_migrations (version) VALUES ('20160318144534');

INSERT INTO schema_migrations (version) VALUES ('20160405134656');

INSERT INTO schema_migrations (version) VALUES ('20160406145542');

INSERT INTO schema_migrations (version) VALUES ('20160413141311');

INSERT INTO schema_migrations (version) VALUES ('20160413142302');

INSERT INTO schema_migrations (version) VALUES ('20160413142757');

INSERT INTO schema_migrations (version) VALUES ('20160414122442');

INSERT INTO schema_migrations (version) VALUES ('20160420150128');

INSERT INTO schema_migrations (version) VALUES ('20160420194109');

INSERT INTO schema_migrations (version) VALUES ('20160420194351');

INSERT INTO schema_migrations (version) VALUES ('20160420194403');

INSERT INTO schema_migrations (version) VALUES ('20160421130901');

INSERT INTO schema_migrations (version) VALUES ('20160421134707');

INSERT INTO schema_migrations (version) VALUES ('20160421140310');

INSERT INTO schema_migrations (version) VALUES ('20160421173623');

INSERT INTO schema_migrations (version) VALUES ('20160422184350');

INSERT INTO schema_migrations (version) VALUES ('20160423104812');

INSERT INTO schema_migrations (version) VALUES ('20160505164431');

INSERT INTO schema_migrations (version) VALUES ('20160512153039');

INSERT INTO schema_migrations (version) VALUES ('20160517195421');

INSERT INTO schema_migrations (version) VALUES ('20160524125136');

INSERT INTO schema_migrations (version) VALUES ('20160603194911');

INSERT INTO schema_migrations (version) VALUES ('20160607185656');

INSERT INTO schema_migrations (version) VALUES ('20160608143038');

INSERT INTO schema_migrations (version) VALUES ('20160608200150');

INSERT INTO schema_migrations (version) VALUES ('20160609142610');

INSERT INTO schema_migrations (version) VALUES ('20160610152917');

