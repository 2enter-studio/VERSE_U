-- create sequence "_analytics"."billing_accounts_id_seq";
--
-- create sequence "_analytics"."billing_counts_id_seq";
--
-- create sequence "_analytics"."endpoint_queries_id_seq";
--
-- create sequence "_analytics"."oauth_access_grants_id_seq";
--
-- create sequence "_analytics"."oauth_access_tokens_id_seq";
--
-- create sequence "_analytics"."oauth_applications_id_seq";
--
-- create sequence "_analytics"."partner_users_id_seq";
--
-- create sequence "_analytics"."partners_id_seq";
--
-- create sequence "_analytics"."payment_methods_id_seq";
--
-- create sequence "_analytics"."plans_id_seq";
--
-- create sequence "_analytics"."rules_id_seq";
--
-- create sequence "_analytics"."saved_search_counters_id_seq";
--
-- create sequence "_analytics"."saved_searches_id_seq";
--
-- create sequence "_analytics"."source_backends_id_seq";
--
-- create sequence "_analytics"."source_schemas_id_seq";
--
-- create sequence "_analytics"."sources_id_seq";
--
-- create sequence "_analytics"."system_metrics_id_seq";
--
-- create sequence "_analytics"."team_users_id_seq";
--
-- create sequence "_analytics"."teams_id_seq";
--
-- create sequence "_analytics"."users_id_seq";
--
-- create sequence "_analytics"."vercel_auths_id_seq";
--
-- create table "_analytics"."billing_accounts" (
--     "id" bigint not null default nextval('_analytics.billing_accounts_id_seq'::regclass),
--     "latest_successful_stripe_session" jsonb,
--     "stripe_customer" character varying(255),
--     "user_id" bigint,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null,
--     "stripe_subscriptions" jsonb,
--     "stripe_invoices" jsonb,
--     "lifetime_plan?" boolean default false,
--     "lifetime_plan_invoice" character varying(255),
--     "default_payment_method" character varying(255),
--     "custom_invoice_fields" jsonb[] default ARRAY[]::jsonb[],
--     "lifetime_plan" boolean not null default false
-- );
--
--
-- create table "_analytics"."billing_counts" (
--     "id" bigint not null default nextval('_analytics.billing_counts_id_seq'::regclass),
--     "node" character varying(255),
--     "count" integer,
--     "user_id" bigint,
--     "source_id" bigint,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null
-- );
--
--
-- create table "_analytics"."endpoint_queries" (
--     "id" bigint not null default nextval('_analytics.endpoint_queries_id_seq'::regclass),
--     "name" character varying(255),
--     "token" uuid,
--     "query" text,
--     "user_id" bigint,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null,
--     "source_mapping" jsonb not null default '{}'::jsonb,
--     "sandboxable" boolean default false,
--     "cache_duration_seconds" integer default 3600,
--     "proactive_requerying_seconds" integer default 1800,
--     "max_limit" integer default 1000,
--     "enable_auth" boolean default false,
--     "sandbox_query_id" bigint,
--     "language" character varying(255) not null
-- );
--
--
-- create table "_analytics"."log_events_20cc3a1c_5742_463d_a1ca_698f44f3e4f4" (
--     "id" character varying(255) not null,
--     "body" jsonb,
--     "event_message" text,
--     "timestamp" timestamp without time zone
-- );
--
--
-- create table "_analytics"."log_events_398d12cb_c7ad_4fe7_a549_f0b058f4863b" (
--     "id" character varying(255) not null,
--     "body" jsonb,
--     "event_message" text,
--     "timestamp" timestamp without time zone
-- );
--
--
-- create table "_analytics"."log_events_3ca54bef_fdce_4969_b093_d2771ad99d0f" (
--     "id" character varying(255) not null,
--     "body" jsonb,
--     "event_message" text,
--     "timestamp" timestamp without time zone
-- );
--
--
-- create table "_analytics"."log_events_6d2a6522_b325_4bc5_8dd9_2e50b52f66b5" (
--     "id" character varying(255) not null,
--     "body" jsonb,
--     "event_message" text,
--     "timestamp" timestamp without time zone
-- );
--
--
-- create table "_analytics"."log_events_7647dc1d_6e0a_46d3_a89a_aa9004adc36e" (
--     "id" character varying(255) not null,
--     "body" jsonb,
--     "event_message" text,
--     "timestamp" timestamp without time zone
-- );
--
--
-- create table "_analytics"."log_events_ab23136e_3468_45d6_b834_986f60343a8b" (
--     "id" character varying(255) not null,
--     "body" jsonb,
--     "event_message" text,
--     "timestamp" timestamp without time zone
-- );
--
--
-- create table "_analytics"."log_events_c1f18801_cc8e_45d1_9985_777ecc1868fe" (
--     "id" character varying(255) not null,
--     "body" jsonb,
--     "event_message" text,
--     "timestamp" timestamp without time zone
-- );
--
--
-- create table "_analytics"."log_events_d1099b66_b160_463b_b53c_864700dc8b5c" (
--     "id" character varying(255) not null,
--     "body" jsonb,
--     "event_message" text,
--     "timestamp" timestamp without time zone
-- );
--
--
-- create table "_analytics"."log_events_e6555d15_1d65_49d1_93b2_3d8ffcf1966d" (
--     "id" character varying(255) not null,
--     "body" jsonb,
--     "event_message" text,
--     "timestamp" timestamp without time zone
-- );
--
--
-- create table "_analytics"."oauth_access_grants" (
--     "id" bigint not null default nextval('_analytics.oauth_access_grants_id_seq'::regclass),
--     "resource_owner_id" integer not null,
--     "application_id" bigint,
--     "token" character varying(255) not null,
--     "expires_in" integer not null,
--     "redirect_uri" text not null,
--     "revoked_at" timestamp(0) without time zone,
--     "scopes" character varying(255),
--     "inserted_at" timestamp(0) without time zone not null
-- );
--
--
-- create table "_analytics"."oauth_access_tokens" (
--     "id" bigint not null default nextval('_analytics.oauth_access_tokens_id_seq'::regclass),
--     "application_id" bigint,
--     "resource_owner_id" integer,
--     "token" character varying(255) not null,
--     "refresh_token" character varying(255),
--     "expires_in" integer,
--     "revoked_at" timestamp(0) without time zone,
--     "scopes" character varying(255),
--     "previous_refresh_token" character varying(255) not null default ''::character varying,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null,
--     "description" text
-- );
--
--
-- create table "_analytics"."oauth_applications" (
--     "id" bigint not null default nextval('_analytics.oauth_applications_id_seq'::regclass),
--     "owner_id" integer not null,
--     "name" character varying(255) not null,
--     "uid" character varying(255) not null,
--     "secret" character varying(255) not null default ''::character varying,
--     "redirect_uri" character varying(255) not null,
--     "scopes" character varying(255) not null default ''::character varying,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null
-- );
--
--
-- create table "_analytics"."partner_users" (
--     "id" bigint not null default nextval('_analytics.partner_users_id_seq'::regclass),
--     "partner_id" bigint,
--     "user_id" bigint
-- );
--
--
-- create table "_analytics"."partners" (
--     "id" bigint not null default nextval('_analytics.partners_id_seq'::regclass),
--     "name" bytea,
--     "token" bytea
-- );
--
--
-- create table "_analytics"."payment_methods" (
--     "id" bigint not null default nextval('_analytics.payment_methods_id_seq'::regclass),
--     "stripe_id" character varying(255),
--     "price_id" character varying(255),
--     "last_four" character varying(255),
--     "brand" character varying(255),
--     "exp_year" integer,
--     "exp_month" integer,
--     "customer_id" character varying(255),
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null
-- );
--
--
-- create table "_analytics"."plans" (
--     "id" bigint not null default nextval('_analytics.plans_id_seq'::regclass),
--     "name" character varying(255),
--     "stripe_id" character varying(255),
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null,
--     "period" character varying(255),
--     "price" integer,
--     "limit_sources" integer,
--     "limit_rate_limit" integer,
--     "limit_alert_freq" integer,
--     "limit_source_rate_limit" integer,
--     "limit_saved_search_limit" integer,
--     "limit_team_users_limit" integer,
--     "limit_source_fields_limit" integer,
--     "limit_source_ttl" bigint default 259200000,
--     "type" character varying(255) default 'standard'::character varying
-- );
--
--
-- create table "_analytics"."rules" (
--     "id" bigint not null default nextval('_analytics.rules_id_seq'::regclass),
--     "regex" character varying(255),
--     "sink" uuid not null,
--     "source_id" bigint not null,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null,
--     "regex_struct" bytea,
--     "lql_string" text not null default ''::text,
--     "lql_filters" bytea not null default '\x836a'::bytea
-- );
--
--
-- create table "_analytics"."saved_search_counters" (
--     "id" bigint not null default nextval('_analytics.saved_search_counters_id_seq'::regclass),
--     "timestamp" timestamp without time zone not null,
--     "saved_search_id" bigint not null,
--     "granularity" text not null default 'day'::text,
--     "non_tailing_count" integer,
--     "tailing_count" integer
-- );
--
--
-- create table "_analytics"."saved_searches" (
--     "id" bigint not null default nextval('_analytics.saved_searches_id_seq'::regclass),
--     "querystring" text,
--     "source_id" bigint,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null,
--     "saved_by_user" boolean,
--     "lql_filters" jsonb,
--     "lql_charts" jsonb,
--     "tailing?" boolean not null default true,
--     "tailing" boolean not null default true
-- );
--
--
-- create table "_analytics"."schema_migrations" (
--     "version" bigint not null,
--     "inserted_at" timestamp(0) without time zone
-- );
--
--
-- create table "_analytics"."schema_migrations_20cc3a1c_5742_463d_a1ca_698f44f3e4f4" (
--     "version" bigint not null,
--     "inserted_at" timestamp(0) without time zone
-- );
--
--
-- create table "_analytics"."schema_migrations_398d12cb_c7ad_4fe7_a549_f0b058f4863b" (
--     "version" bigint not null,
--     "inserted_at" timestamp(0) without time zone
-- );
--
--
-- create table "_analytics"."schema_migrations_3ca54bef_fdce_4969_b093_d2771ad99d0f" (
--     "version" bigint not null,
--     "inserted_at" timestamp(0) without time zone
-- );
--
--
-- create table "_analytics"."schema_migrations_6d2a6522_b325_4bc5_8dd9_2e50b52f66b5" (
--     "version" bigint not null,
--     "inserted_at" timestamp(0) without time zone
-- );
--
--
-- create table "_analytics"."schema_migrations_7647dc1d_6e0a_46d3_a89a_aa9004adc36e" (
--     "version" bigint not null,
--     "inserted_at" timestamp(0) without time zone
-- );
--
--
-- create table "_analytics"."schema_migrations_ab23136e_3468_45d6_b834_986f60343a8b" (
--     "version" bigint not null,
--     "inserted_at" timestamp(0) without time zone
-- );
--
--
-- create table "_analytics"."schema_migrations_c1f18801_cc8e_45d1_9985_777ecc1868fe" (
--     "version" bigint not null,
--     "inserted_at" timestamp(0) without time zone
-- );
--
--
-- create table "_analytics"."schema_migrations_d1099b66_b160_463b_b53c_864700dc8b5c" (
--     "version" bigint not null,
--     "inserted_at" timestamp(0) without time zone
-- );
--
--
-- create table "_analytics"."schema_migrations_e6555d15_1d65_49d1_93b2_3d8ffcf1966d" (
--     "version" bigint not null,
--     "inserted_at" timestamp(0) without time zone
-- );
--
--
-- create table "_analytics"."source_backends" (
--     "id" bigint not null default nextval('_analytics.source_backends_id_seq'::regclass),
--     "source_id" bigint,
--     "type" character varying(255),
--     "config" jsonb,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null
-- );
--
--
-- create table "_analytics"."source_schemas" (
--     "id" bigint not null default nextval('_analytics.source_schemas_id_seq'::regclass),
--     "bigquery_schema" bytea,
--     "source_id" bigint,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null,
--     "schema_flat_map" bytea
-- );
--
--
-- create table "_analytics"."sources" (
--     "id" bigint not null default nextval('_analytics.sources_id_seq'::regclass),
--     "name" character varying(255),
--     "token" uuid not null,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null,
--     "user_id" integer not null,
--     "public_token" character varying(255),
--     "favorite" boolean not null default false,
--     "bigquery_table_ttl" integer,
--     "api_quota" integer not null default 5,
--     "webhook_notification_url" character varying(255),
--     "slack_hook_url" character varying(255),
--     "notifications" jsonb not null default '{"team_user_ids_for_sms": [], "team_user_ids_for_email": [], "user_text_notifications": false, "user_email_notifications": false, "other_email_notifications": null, "team_user_ids_for_schema_updates": [], "user_schema_update_notifications": true}'::jsonb,
--     "custom_event_message_keys" character varying(255),
--     "log_events_updated_at" timestamp(0) without time zone,
--     "bigquery_schema" bytea,
--     "notifications_every" integer default 14400000,
--     "bq_table_partition_type" text,
--     "lock_schema" boolean default false,
--     "validate_schema" boolean default true,
--     "drop_lql_filters" bytea not null default '\x836a'::bytea,
--     "drop_lql_string" character varying(255),
--     "v2_pipeline" boolean default false,
--     "suggested_keys" character varying(255) default ''::character varying
-- );
--
--
-- create table "_analytics"."system_metrics" (
--     "id" bigint not null default nextval('_analytics.system_metrics_id_seq'::regclass),
--     "all_logs_logged" bigint,
--     "node" character varying(255),
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null
-- );
--
--
-- create table "_analytics"."team_users" (
--     "id" bigint not null default nextval('_analytics.team_users_id_seq'::regclass),
--     "email" character varying(255),
--     "token" character varying(255),
--     "provider" character varying(255),
--     "email_preferred" character varying(255),
--     "name" character varying(255),
--     "image" character varying(255),
--     "email_me_product" boolean not null default false,
--     "phone" character varying(255),
--     "valid_google_account" boolean not null default false,
--     "provider_uid" character varying(255),
--     "team_id" bigint,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null,
--     "preferences" jsonb
-- );
--
--
-- create table "_analytics"."teams" (
--     "id" bigint not null default nextval('_analytics.teams_id_seq'::regclass),
--     "name" character varying(255),
--     "user_id" bigint,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null,
--     "token" character varying(255) default gen_random_uuid()
-- );
--
--
-- create table "_analytics"."users" (
--     "id" bigint not null default nextval('_analytics.users_id_seq'::regclass),
--     "email" character varying(255) not null,
--     "provider" character varying(255) not null,
--     "token" character varying(255) not null,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null,
--     "api_key" character varying(255) not null,
--     "old_api_key" character varying(255),
--     "email_preferred" character varying(255),
--     "name" character varying(255),
--     "image" character varying(255),
--     "email_me_product" boolean not null default true,
--     "admin" boolean not null default false,
--     "phone" character varying(255),
--     "bigquery_project_id" character varying(255),
--     "api_quota" integer not null default 125,
--     "bigquery_dataset_location" character varying(255),
--     "bigquery_dataset_id" character varying(255),
--     "valid_google_account" boolean,
--     "provider_uid" character varying(255),
--     "company" character varying(255),
--     "bigquery_udfs_hash" character varying(255) not null default ''::character varying,
--     "bigquery_processed_bytes_limit" bigint not null default '10000000000'::bigint,
--     "billing_enabled?" boolean not null default false,
--     "preferences" jsonb,
--     "billing_enabled" boolean not null default false,
--     "endpoints_beta" boolean default false
-- );
--
--
-- create table "_analytics"."vercel_auths" (
--     "id" bigint not null default nextval('_analytics.vercel_auths_id_seq'::regclass),
--     "access_token" character varying(255),
--     "installation_id" character varying(255),
--     "team_id" character varying(255),
--     "token_type" character varying(255),
--     "vercel_user_id" character varying(255),
--     "user_id" bigint,
--     "inserted_at" timestamp(0) without time zone not null,
--     "updated_at" timestamp(0) without time zone not null
-- );
--
--
-- alter sequence "_analytics"."billing_accounts_id_seq" owned by "_analytics"."billing_accounts"."id";
--
-- alter sequence "_analytics"."billing_counts_id_seq" owned by "_analytics"."billing_counts"."id";
--
-- alter sequence "_analytics"."endpoint_queries_id_seq" owned by "_analytics"."endpoint_queries"."id";
--
-- alter sequence "_analytics"."oauth_access_grants_id_seq" owned by "_analytics"."oauth_access_grants"."id";
--
-- alter sequence "_analytics"."oauth_access_tokens_id_seq" owned by "_analytics"."oauth_access_tokens"."id";
--
-- alter sequence "_analytics"."oauth_applications_id_seq" owned by "_analytics"."oauth_applications"."id";
--
-- alter sequence "_analytics"."partner_users_id_seq" owned by "_analytics"."partner_users"."id";
--
-- alter sequence "_analytics"."partners_id_seq" owned by "_analytics"."partners"."id";
--
-- alter sequence "_analytics"."payment_methods_id_seq" owned by "_analytics"."payment_methods"."id";
--
-- alter sequence "_analytics"."plans_id_seq" owned by "_analytics"."plans"."id";
--
-- alter sequence "_analytics"."rules_id_seq" owned by "_analytics"."rules"."id";
--
-- alter sequence "_analytics"."saved_search_counters_id_seq" owned by "_analytics"."saved_search_counters"."id";
--
-- alter sequence "_analytics"."saved_searches_id_seq" owned by "_analytics"."saved_searches"."id";
--
-- alter sequence "_analytics"."source_backends_id_seq" owned by "_analytics"."source_backends"."id";
--
-- alter sequence "_analytics"."source_schemas_id_seq" owned by "_analytics"."source_schemas"."id";
--
-- alter sequence "_analytics"."sources_id_seq" owned by "_analytics"."sources"."id";
--
-- alter sequence "_analytics"."system_metrics_id_seq" owned by "_analytics"."system_metrics"."id";
--
-- alter sequence "_analytics"."team_users_id_seq" owned by "_analytics"."team_users"."id";
--
-- alter sequence "_analytics"."teams_id_seq" owned by "_analytics"."teams"."id";
--
-- alter sequence "_analytics"."users_id_seq" owned by "_analytics"."users"."id";
--
-- alter sequence "_analytics"."vercel_auths_id_seq" owned by "_analytics"."vercel_auths"."id";
--
-- CREATE UNIQUE INDEX billing_accounts_pkey ON _analytics.billing_accounts USING btree (id);
--
-- CREATE UNIQUE INDEX billing_accounts_stripe_customer_index ON _analytics.billing_accounts USING btree (stripe_customer);
--
-- CREATE UNIQUE INDEX billing_accounts_user_id_index ON _analytics.billing_accounts USING btree (user_id);
--
-- CREATE INDEX billing_counts_inserted_at_index ON _analytics.billing_counts USING btree (inserted_at);
--
-- CREATE UNIQUE INDEX billing_counts_pkey ON _analytics.billing_counts USING btree (id);
--
-- CREATE INDEX billing_counts_source_id_index ON _analytics.billing_counts USING btree (source_id);
--
-- CREATE INDEX billing_counts_user_id_index ON _analytics.billing_counts USING btree (user_id);
--
-- CREATE UNIQUE INDEX endpoint_queries_pkey ON _analytics.endpoint_queries USING btree (id);
--
-- CREATE UNIQUE INDEX endpoint_queries_token_index ON _analytics.endpoint_queries USING btree (token);
--
-- CREATE INDEX endpoint_queries_user_id_index ON _analytics.endpoint_queries USING btree (user_id);
--
-- CREATE UNIQUE INDEX log_events_20cc3a1c_5742_463d_a1ca_698f44f3e4f4_pkey ON _analytics.log_events_20cc3a1c_5742_463d_a1ca_698f44f3e4f4 USING btree (id);
--
-- CREATE UNIQUE INDEX log_events_398d12cb_c7ad_4fe7_a549_f0b058f4863b_pkey ON _analytics.log_events_398d12cb_c7ad_4fe7_a549_f0b058f4863b USING btree (id);
--
-- CREATE UNIQUE INDEX log_events_3ca54bef_fdce_4969_b093_d2771ad99d0f_pkey ON _analytics.log_events_3ca54bef_fdce_4969_b093_d2771ad99d0f USING btree (id);
--
-- CREATE UNIQUE INDEX log_events_6d2a6522_b325_4bc5_8dd9_2e50b52f66b5_pkey ON _analytics.log_events_6d2a6522_b325_4bc5_8dd9_2e50b52f66b5 USING btree (id);
--
-- CREATE UNIQUE INDEX log_events_7647dc1d_6e0a_46d3_a89a_aa9004adc36e_pkey ON _analytics.log_events_7647dc1d_6e0a_46d3_a89a_aa9004adc36e USING btree (id);
--
-- CREATE UNIQUE INDEX log_events_ab23136e_3468_45d6_b834_986f60343a8b_pkey ON _analytics.log_events_ab23136e_3468_45d6_b834_986f60343a8b USING btree (id);
--
-- CREATE UNIQUE INDEX log_events_c1f18801_cc8e_45d1_9985_777ecc1868fe_pkey ON _analytics.log_events_c1f18801_cc8e_45d1_9985_777ecc1868fe USING btree (id);
--
-- CREATE UNIQUE INDEX log_events_d1099b66_b160_463b_b53c_864700dc8b5c_pkey ON _analytics.log_events_d1099b66_b160_463b_b53c_864700dc8b5c USING btree (id);
--
-- CREATE UNIQUE INDEX log_events_e6555d15_1d65_49d1_93b2_3d8ffcf1966d_pkey ON _analytics.log_events_e6555d15_1d65_49d1_93b2_3d8ffcf1966d USING btree (id);
--
-- CREATE UNIQUE INDEX oauth_access_grants_pkey ON _analytics.oauth_access_grants USING btree (id);
--
-- CREATE UNIQUE INDEX oauth_access_grants_token_index ON _analytics.oauth_access_grants USING btree (token);
--
-- CREATE UNIQUE INDEX oauth_access_tokens_pkey ON _analytics.oauth_access_tokens USING btree (id);
--
-- CREATE UNIQUE INDEX oauth_access_tokens_refresh_token_index ON _analytics.oauth_access_tokens USING btree (refresh_token);
--
-- CREATE INDEX oauth_access_tokens_resource_owner_id_index ON _analytics.oauth_access_tokens USING btree (resource_owner_id);
--
-- CREATE UNIQUE INDEX oauth_access_tokens_token_index ON _analytics.oauth_access_tokens USING btree (token);
--
-- CREATE INDEX oauth_applications_owner_id_index ON _analytics.oauth_applications USING btree (owner_id);
--
-- CREATE UNIQUE INDEX oauth_applications_pkey ON _analytics.oauth_applications USING btree (id);
--
-- CREATE UNIQUE INDEX oauth_applications_uid_index ON _analytics.oauth_applications USING btree (uid);
--
-- CREATE UNIQUE INDEX partner_users_partner_id_user_id_index ON _analytics.partner_users USING btree (partner_id, user_id);
--
-- CREATE UNIQUE INDEX partner_users_pkey ON _analytics.partner_users USING btree (id);
--
-- CREATE UNIQUE INDEX partners_pkey ON _analytics.partners USING btree (id);
--
-- CREATE INDEX payment_methods_customer_id_index ON _analytics.payment_methods USING btree (customer_id);
--
-- CREATE UNIQUE INDEX payment_methods_pkey ON _analytics.payment_methods USING btree (id);
--
-- CREATE UNIQUE INDEX payment_methods_stripe_id_index ON _analytics.payment_methods USING btree (stripe_id);
--
-- CREATE UNIQUE INDEX plans_pkey ON _analytics.plans USING btree (id);
--
-- CREATE UNIQUE INDEX rules_pkey ON _analytics.rules USING btree (id);
--
-- CREATE INDEX rules_source_id_index ON _analytics.rules USING btree (source_id);
--
-- CREATE UNIQUE INDEX saved_search_counters_pkey ON _analytics.saved_search_counters USING btree (id);
--
-- CREATE UNIQUE INDEX saved_search_counters_timestamp_saved_search_id_granularity_ind ON _analytics.saved_search_counters USING btree ("timestamp", saved_search_id, granularity);
--
-- CREATE UNIQUE INDEX saved_searches_pkey ON _analytics.saved_searches USING btree (id);
--
-- CREATE UNIQUE INDEX saved_searches_querystring_source_id_index ON _analytics.saved_searches USING btree (querystring, source_id);
--
-- CREATE UNIQUE INDEX schema_migrations_20cc3a1c_5742_463d_a1ca_698f44f3e4f4_pkey ON _analytics.schema_migrations_20cc3a1c_5742_463d_a1ca_698f44f3e4f4 USING btree (version);
--
-- CREATE UNIQUE INDEX schema_migrations_398d12cb_c7ad_4fe7_a549_f0b058f4863b_pkey ON _analytics.schema_migrations_398d12cb_c7ad_4fe7_a549_f0b058f4863b USING btree (version);
--
-- CREATE UNIQUE INDEX schema_migrations_3ca54bef_fdce_4969_b093_d2771ad99d0f_pkey ON _analytics.schema_migrations_3ca54bef_fdce_4969_b093_d2771ad99d0f USING btree (version);
--
-- CREATE UNIQUE INDEX schema_migrations_6d2a6522_b325_4bc5_8dd9_2e50b52f66b5_pkey ON _analytics.schema_migrations_6d2a6522_b325_4bc5_8dd9_2e50b52f66b5 USING btree (version);
--
-- CREATE UNIQUE INDEX schema_migrations_7647dc1d_6e0a_46d3_a89a_aa9004adc36e_pkey ON _analytics.schema_migrations_7647dc1d_6e0a_46d3_a89a_aa9004adc36e USING btree (version);
--
-- CREATE UNIQUE INDEX schema_migrations_ab23136e_3468_45d6_b834_986f60343a8b_pkey ON _analytics.schema_migrations_ab23136e_3468_45d6_b834_986f60343a8b USING btree (version);
--
-- CREATE UNIQUE INDEX schema_migrations_c1f18801_cc8e_45d1_9985_777ecc1868fe_pkey ON _analytics.schema_migrations_c1f18801_cc8e_45d1_9985_777ecc1868fe USING btree (version);
--
-- CREATE UNIQUE INDEX schema_migrations_d1099b66_b160_463b_b53c_864700dc8b5c_pkey ON _analytics.schema_migrations_d1099b66_b160_463b_b53c_864700dc8b5c USING btree (version);
--
-- CREATE UNIQUE INDEX schema_migrations_e6555d15_1d65_49d1_93b2_3d8ffcf1966d_pkey ON _analytics.schema_migrations_e6555d15_1d65_49d1_93b2_3d8ffcf1966d USING btree (version);
--
-- CREATE UNIQUE INDEX schema_migrations_pkey ON _analytics.schema_migrations USING btree (version);
--
-- CREATE UNIQUE INDEX source_backends_pkey ON _analytics.source_backends USING btree (id);
--
-- CREATE UNIQUE INDEX source_schemas_pkey ON _analytics.source_schemas USING btree (id);
--
-- CREATE UNIQUE INDEX source_schemas_source_id_index ON _analytics.source_schemas USING btree (source_id);
--
-- CREATE UNIQUE INDEX sources_name_index ON _analytics.sources USING btree (id, name);
--
-- CREATE UNIQUE INDEX sources_pkey ON _analytics.sources USING btree (id);
--
-- CREATE UNIQUE INDEX sources_public_token_index ON _analytics.sources USING btree (public_token);
--
-- CREATE UNIQUE INDEX sources_token_index ON _analytics.sources USING btree (token);
--
-- CREATE INDEX sources_user_id_index ON _analytics.sources USING btree (user_id);
--
-- CREATE INDEX system_metrics_node_index ON _analytics.system_metrics USING btree (node);
--
-- CREATE UNIQUE INDEX system_metrics_pkey ON _analytics.system_metrics USING btree (id);
--
-- CREATE UNIQUE INDEX team_users_pkey ON _analytics.team_users USING btree (id);
--
-- CREATE UNIQUE INDEX team_users_provider_uid_team_id_index ON _analytics.team_users USING btree (provider_uid, team_id);
--
-- CREATE INDEX team_users_team_id_index ON _analytics.team_users USING btree (team_id);
--
-- CREATE UNIQUE INDEX teams_pkey ON _analytics.teams USING btree (id);
--
-- CREATE UNIQUE INDEX teams_token_index ON _analytics.teams USING btree (token);
--
-- CREATE UNIQUE INDEX teams_user_id_index ON _analytics.teams USING btree (user_id);
--
-- CREATE INDEX users_api_key_index ON _analytics.users USING btree (api_key);
--
-- CREATE UNIQUE INDEX users_lower_email_index ON _analytics.users USING btree (lower((email)::text));
--
-- CREATE UNIQUE INDEX users_pkey ON _analytics.users USING btree (id);
--
-- CREATE UNIQUE INDEX vercel_auths_pkey ON _analytics.vercel_auths USING btree (id);
--
-- alter table "_analytics"."billing_accounts" add constraint "billing_accounts_pkey" PRIMARY KEY using index "billing_accounts_pkey";
--
-- alter table "_analytics"."billing_counts" add constraint "billing_counts_pkey" PRIMARY KEY using index "billing_counts_pkey";
--
-- alter table "_analytics"."endpoint_queries" add constraint "endpoint_queries_pkey" PRIMARY KEY using index "endpoint_queries_pkey";
--
-- alter table "_analytics"."log_events_20cc3a1c_5742_463d_a1ca_698f44f3e4f4" add constraint "log_events_20cc3a1c_5742_463d_a1ca_698f44f3e4f4_pkey" PRIMARY KEY using index "log_events_20cc3a1c_5742_463d_a1ca_698f44f3e4f4_pkey";
--
-- alter table "_analytics"."log_events_398d12cb_c7ad_4fe7_a549_f0b058f4863b" add constraint "log_events_398d12cb_c7ad_4fe7_a549_f0b058f4863b_pkey" PRIMARY KEY using index "log_events_398d12cb_c7ad_4fe7_a549_f0b058f4863b_pkey";
--
-- alter table "_analytics"."log_events_3ca54bef_fdce_4969_b093_d2771ad99d0f" add constraint "log_events_3ca54bef_fdce_4969_b093_d2771ad99d0f_pkey" PRIMARY KEY using index "log_events_3ca54bef_fdce_4969_b093_d2771ad99d0f_pkey";
--
-- alter table "_analytics"."log_events_6d2a6522_b325_4bc5_8dd9_2e50b52f66b5" add constraint "log_events_6d2a6522_b325_4bc5_8dd9_2e50b52f66b5_pkey" PRIMARY KEY using index "log_events_6d2a6522_b325_4bc5_8dd9_2e50b52f66b5_pkey";
--
-- alter table "_analytics"."log_events_7647dc1d_6e0a_46d3_a89a_aa9004adc36e" add constraint "log_events_7647dc1d_6e0a_46d3_a89a_aa9004adc36e_pkey" PRIMARY KEY using index "log_events_7647dc1d_6e0a_46d3_a89a_aa9004adc36e_pkey";
--
-- alter table "_analytics"."log_events_ab23136e_3468_45d6_b834_986f60343a8b" add constraint "log_events_ab23136e_3468_45d6_b834_986f60343a8b_pkey" PRIMARY KEY using index "log_events_ab23136e_3468_45d6_b834_986f60343a8b_pkey";
--
-- alter table "_analytics"."log_events_c1f18801_cc8e_45d1_9985_777ecc1868fe" add constraint "log_events_c1f18801_cc8e_45d1_9985_777ecc1868fe_pkey" PRIMARY KEY using index "log_events_c1f18801_cc8e_45d1_9985_777ecc1868fe_pkey";
--
-- alter table "_analytics"."log_events_d1099b66_b160_463b_b53c_864700dc8b5c" add constraint "log_events_d1099b66_b160_463b_b53c_864700dc8b5c_pkey" PRIMARY KEY using index "log_events_d1099b66_b160_463b_b53c_864700dc8b5c_pkey";
--
-- alter table "_analytics"."log_events_e6555d15_1d65_49d1_93b2_3d8ffcf1966d" add constraint "log_events_e6555d15_1d65_49d1_93b2_3d8ffcf1966d_pkey" PRIMARY KEY using index "log_events_e6555d15_1d65_49d1_93b2_3d8ffcf1966d_pkey";
--
-- alter table "_analytics"."oauth_access_grants" add constraint "oauth_access_grants_pkey" PRIMARY KEY using index "oauth_access_grants_pkey";
--
-- alter table "_analytics"."oauth_access_tokens" add constraint "oauth_access_tokens_pkey" PRIMARY KEY using index "oauth_access_tokens_pkey";
--
-- alter table "_analytics"."oauth_applications" add constraint "oauth_applications_pkey" PRIMARY KEY using index "oauth_applications_pkey";
--
-- alter table "_analytics"."partner_users" add constraint "partner_users_pkey" PRIMARY KEY using index "partner_users_pkey";
--
-- alter table "_analytics"."partners" add constraint "partners_pkey" PRIMARY KEY using index "partners_pkey";
--
-- alter table "_analytics"."payment_methods" add constraint "payment_methods_pkey" PRIMARY KEY using index "payment_methods_pkey";
--
-- alter table "_analytics"."plans" add constraint "plans_pkey" PRIMARY KEY using index "plans_pkey";
--
-- alter table "_analytics"."rules" add constraint "rules_pkey" PRIMARY KEY using index "rules_pkey";
--
-- alter table "_analytics"."saved_search_counters" add constraint "saved_search_counters_pkey" PRIMARY KEY using index "saved_search_counters_pkey";
--
-- alter table "_analytics"."saved_searches" add constraint "saved_searches_pkey" PRIMARY KEY using index "saved_searches_pkey";
--
-- alter table "_analytics"."schema_migrations" add constraint "schema_migrations_pkey" PRIMARY KEY using index "schema_migrations_pkey";
--
-- alter table "_analytics"."schema_migrations_20cc3a1c_5742_463d_a1ca_698f44f3e4f4" add constraint "schema_migrations_20cc3a1c_5742_463d_a1ca_698f44f3e4f4_pkey" PRIMARY KEY using index "schema_migrations_20cc3a1c_5742_463d_a1ca_698f44f3e4f4_pkey";
--
-- alter table "_analytics"."schema_migrations_398d12cb_c7ad_4fe7_a549_f0b058f4863b" add constraint "schema_migrations_398d12cb_c7ad_4fe7_a549_f0b058f4863b_pkey" PRIMARY KEY using index "schema_migrations_398d12cb_c7ad_4fe7_a549_f0b058f4863b_pkey";
--
-- alter table "_analytics"."schema_migrations_3ca54bef_fdce_4969_b093_d2771ad99d0f" add constraint "schema_migrations_3ca54bef_fdce_4969_b093_d2771ad99d0f_pkey" PRIMARY KEY using index "schema_migrations_3ca54bef_fdce_4969_b093_d2771ad99d0f_pkey";
--
-- alter table "_analytics"."schema_migrations_6d2a6522_b325_4bc5_8dd9_2e50b52f66b5" add constraint "schema_migrations_6d2a6522_b325_4bc5_8dd9_2e50b52f66b5_pkey" PRIMARY KEY using index "schema_migrations_6d2a6522_b325_4bc5_8dd9_2e50b52f66b5_pkey";
--
-- alter table "_analytics"."schema_migrations_7647dc1d_6e0a_46d3_a89a_aa9004adc36e" add constraint "schema_migrations_7647dc1d_6e0a_46d3_a89a_aa9004adc36e_pkey" PRIMARY KEY using index "schema_migrations_7647dc1d_6e0a_46d3_a89a_aa9004adc36e_pkey";
--
-- alter table "_analytics"."schema_migrations_ab23136e_3468_45d6_b834_986f60343a8b" add constraint "schema_migrations_ab23136e_3468_45d6_b834_986f60343a8b_pkey" PRIMARY KEY using index "schema_migrations_ab23136e_3468_45d6_b834_986f60343a8b_pkey";
--
-- alter table "_analytics"."schema_migrations_c1f18801_cc8e_45d1_9985_777ecc1868fe" add constraint "schema_migrations_c1f18801_cc8e_45d1_9985_777ecc1868fe_pkey" PRIMARY KEY using index "schema_migrations_c1f18801_cc8e_45d1_9985_777ecc1868fe_pkey";
--
-- alter table "_analytics"."schema_migrations_d1099b66_b160_463b_b53c_864700dc8b5c" add constraint "schema_migrations_d1099b66_b160_463b_b53c_864700dc8b5c_pkey" PRIMARY KEY using index "schema_migrations_d1099b66_b160_463b_b53c_864700dc8b5c_pkey";
--
-- alter table "_analytics"."schema_migrations_e6555d15_1d65_49d1_93b2_3d8ffcf1966d" add constraint "schema_migrations_e6555d15_1d65_49d1_93b2_3d8ffcf1966d_pkey" PRIMARY KEY using index "schema_migrations_e6555d15_1d65_49d1_93b2_3d8ffcf1966d_pkey";
--
-- alter table "_analytics"."source_backends" add constraint "source_backends_pkey" PRIMARY KEY using index "source_backends_pkey";
--
-- alter table "_analytics"."source_schemas" add constraint "source_schemas_pkey" PRIMARY KEY using index "source_schemas_pkey";
--
-- alter table "_analytics"."sources" add constraint "sources_pkey" PRIMARY KEY using index "sources_pkey";
--
-- alter table "_analytics"."system_metrics" add constraint "system_metrics_pkey" PRIMARY KEY using index "system_metrics_pkey";
--
-- alter table "_analytics"."team_users" add constraint "team_users_pkey" PRIMARY KEY using index "team_users_pkey";
--
-- alter table "_analytics"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";
--
-- alter table "_analytics"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";
--
-- alter table "_analytics"."vercel_auths" add constraint "vercel_auths_pkey" PRIMARY KEY using index "vercel_auths_pkey";
--
-- alter table "_analytics"."billing_accounts" add constraint "billing_accounts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) ON DELETE CASCADE not valid;
--
-- alter table "_analytics"."billing_accounts" validate constraint "billing_accounts_user_id_fkey";
--
-- alter table "_analytics"."billing_counts" add constraint "billing_counts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) ON DELETE CASCADE not valid;
--
-- alter table "_analytics"."billing_counts" validate constraint "billing_counts_user_id_fkey";
--
-- alter table "_analytics"."endpoint_queries" add constraint "endpoint_queries_sandbox_query_id_fkey" FOREIGN KEY (sandbox_query_id) REFERENCES _analytics.endpoint_queries(id) not valid;
--
-- alter table "_analytics"."endpoint_queries" validate constraint "endpoint_queries_sandbox_query_id_fkey";
--
-- alter table "_analytics"."endpoint_queries" add constraint "endpoint_queries_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) not valid;
--
-- alter table "_analytics"."endpoint_queries" validate constraint "endpoint_queries_user_id_fkey";
--
-- alter table "_analytics"."oauth_access_grants" add constraint "oauth_access_grants_application_id_fkey" FOREIGN KEY (application_id) REFERENCES _analytics.oauth_applications(id) not valid;
--
-- alter table "_analytics"."oauth_access_grants" validate constraint "oauth_access_grants_application_id_fkey";
--
-- alter table "_analytics"."oauth_access_tokens" add constraint "oauth_access_tokens_application_id_fkey" FOREIGN KEY (application_id) REFERENCES _analytics.oauth_applications(id) not valid;
--
-- alter table "_analytics"."oauth_access_tokens" validate constraint "oauth_access_tokens_application_id_fkey";
--
-- alter table "_analytics"."partner_users" add constraint "partner_users_partner_id_fkey" FOREIGN KEY (partner_id) REFERENCES _analytics.partners(id) not valid;
--
-- alter table "_analytics"."partner_users" validate constraint "partner_users_partner_id_fkey";
--
-- alter table "_analytics"."partner_users" add constraint "partner_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) not valid;
--
-- alter table "_analytics"."partner_users" validate constraint "partner_users_user_id_fkey";
--
-- alter table "_analytics"."payment_methods" add constraint "payment_methods_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES _analytics.billing_accounts(stripe_customer) ON DELETE CASCADE not valid;
--
-- alter table "_analytics"."payment_methods" validate constraint "payment_methods_customer_id_fkey";
--
-- alter table "_analytics"."rules" add constraint "rules_sink_fkey" FOREIGN KEY (sink) REFERENCES _analytics.sources(token) ON DELETE CASCADE not valid;
--
-- alter table "_analytics"."rules" validate constraint "rules_sink_fkey";
--
-- alter table "_analytics"."rules" add constraint "rules_source_id_fkey" FOREIGN KEY (source_id) REFERENCES _analytics.sources(id) ON DELETE CASCADE not valid;
--
-- alter table "_analytics"."rules" validate constraint "rules_source_id_fkey";
--
-- alter table "_analytics"."saved_search_counters" add constraint "saved_search_counters_saved_search_id_fkey" FOREIGN KEY (saved_search_id) REFERENCES _analytics.saved_searches(id) ON DELETE CASCADE not valid;
--
-- alter table "_analytics"."saved_search_counters" validate constraint "saved_search_counters_saved_search_id_fkey";
--
-- alter table "_analytics"."saved_searches" add constraint "saved_searches_source_id_fkey" FOREIGN KEY (source_id) REFERENCES _analytics.sources(id) ON DELETE CASCADE not valid;
--
-- alter table "_analytics"."saved_searches" validate constraint "saved_searches_source_id_fkey";
--
-- alter table "_analytics"."source_backends" add constraint "source_backends_source_id_fkey" FOREIGN KEY (source_id) REFERENCES _analytics.sources(id) not valid;
--
-- alter table "_analytics"."source_backends" validate constraint "source_backends_source_id_fkey";
--
-- alter table "_analytics"."source_schemas" add constraint "source_schemas_source_id_fkey" FOREIGN KEY (source_id) REFERENCES _analytics.sources(id) ON DELETE CASCADE not valid;
--
-- alter table "_analytics"."source_schemas" validate constraint "source_schemas_source_id_fkey";
--
-- alter table "_analytics"."sources" add constraint "sources_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) ON DELETE CASCADE not valid;
--
-- alter table "_analytics"."sources" validate constraint "sources_user_id_fkey";
--
-- alter table "_analytics"."team_users" add constraint "team_users_team_id_fkey" FOREIGN KEY (team_id) REFERENCES _analytics.teams(id) ON DELETE CASCADE not valid;
--
-- alter table "_analytics"."team_users" validate constraint "team_users_team_id_fkey";
--
-- alter table "_analytics"."teams" add constraint "teams_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) ON DELETE CASCADE not valid;
--
-- alter table "_analytics"."teams" validate constraint "teams_user_id_fkey";
--
-- alter table "_analytics"."vercel_auths" add constraint "vercel_auths_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) ON DELETE CASCADE not valid;
--
-- alter table "_analytics"."vercel_auths" validate constraint "vercel_auths_user_id_fkey";
--

revoke delete on table "public"."avatars" from "anon";

revoke insert on table "public"."avatars" from "anon";

revoke references on table "public"."avatars" from "anon";

revoke select on table "public"."avatars" from "anon";

revoke trigger on table "public"."avatars" from "anon";

revoke truncate on table "public"."avatars" from "anon";

revoke update on table "public"."avatars" from "anon";

revoke delete on table "public"."avatars" from "authenticated";

revoke insert on table "public"."avatars" from "authenticated";

revoke references on table "public"."avatars" from "authenticated";

revoke select on table "public"."avatars" from "authenticated";

revoke trigger on table "public"."avatars" from "authenticated";

revoke truncate on table "public"."avatars" from "authenticated";

revoke update on table "public"."avatars" from "authenticated";

revoke delete on table "public"."avatars" from "service_role";

revoke insert on table "public"."avatars" from "service_role";

revoke references on table "public"."avatars" from "service_role";

revoke select on table "public"."avatars" from "service_role";

revoke trigger on table "public"."avatars" from "service_role";

revoke truncate on table "public"."avatars" from "service_role";

revoke update on table "public"."avatars" from "service_role";

revoke delete on table "public"."character_assets" from "anon";

revoke insert on table "public"."character_assets" from "anon";

revoke references on table "public"."character_assets" from "anon";

revoke select on table "public"."character_assets" from "anon";

revoke trigger on table "public"."character_assets" from "anon";

revoke truncate on table "public"."character_assets" from "anon";

revoke update on table "public"."character_assets" from "anon";

revoke delete on table "public"."character_assets" from "authenticated";

revoke insert on table "public"."character_assets" from "authenticated";

revoke references on table "public"."character_assets" from "authenticated";

revoke select on table "public"."character_assets" from "authenticated";

revoke trigger on table "public"."character_assets" from "authenticated";

revoke truncate on table "public"."character_assets" from "authenticated";

revoke update on table "public"."character_assets" from "authenticated";

revoke delete on table "public"."character_assets" from "service_role";

revoke insert on table "public"."character_assets" from "service_role";

revoke references on table "public"."character_assets" from "service_role";

revoke select on table "public"."character_assets" from "service_role";

revoke trigger on table "public"."character_assets" from "service_role";

revoke truncate on table "public"."character_assets" from "service_role";

revoke update on table "public"."character_assets" from "service_role";

revoke delete on table "public"."j-avatars-stickers" from "anon";

revoke insert on table "public"."j-avatars-stickers" from "anon";

revoke references on table "public"."j-avatars-stickers" from "anon";

revoke select on table "public"."j-avatars-stickers" from "anon";

revoke trigger on table "public"."j-avatars-stickers" from "anon";

revoke truncate on table "public"."j-avatars-stickers" from "anon";

revoke update on table "public"."j-avatars-stickers" from "anon";

revoke delete on table "public"."j-avatars-stickers" from "authenticated";

revoke insert on table "public"."j-avatars-stickers" from "authenticated";

revoke references on table "public"."j-avatars-stickers" from "authenticated";

revoke select on table "public"."j-avatars-stickers" from "authenticated";

revoke trigger on table "public"."j-avatars-stickers" from "authenticated";

revoke truncate on table "public"."j-avatars-stickers" from "authenticated";

revoke update on table "public"."j-avatars-stickers" from "authenticated";

revoke delete on table "public"."j-avatars-stickers" from "service_role";

revoke insert on table "public"."j-avatars-stickers" from "service_role";

revoke references on table "public"."j-avatars-stickers" from "service_role";

revoke select on table "public"."j-avatars-stickers" from "service_role";

revoke trigger on table "public"."j-avatars-stickers" from "service_role";

revoke truncate on table "public"."j-avatars-stickers" from "service_role";

revoke update on table "public"."j-avatars-stickers" from "service_role";

revoke delete on table "public"."j-avatars-wearings" from "anon";

revoke insert on table "public"."j-avatars-wearings" from "anon";

revoke references on table "public"."j-avatars-wearings" from "anon";

revoke select on table "public"."j-avatars-wearings" from "anon";

revoke trigger on table "public"."j-avatars-wearings" from "anon";

revoke truncate on table "public"."j-avatars-wearings" from "anon";

revoke update on table "public"."j-avatars-wearings" from "anon";

revoke delete on table "public"."j-avatars-wearings" from "authenticated";

revoke insert on table "public"."j-avatars-wearings" from "authenticated";

revoke references on table "public"."j-avatars-wearings" from "authenticated";

revoke select on table "public"."j-avatars-wearings" from "authenticated";

revoke trigger on table "public"."j-avatars-wearings" from "authenticated";

revoke truncate on table "public"."j-avatars-wearings" from "authenticated";

revoke update on table "public"."j-avatars-wearings" from "authenticated";

revoke delete on table "public"."j-avatars-wearings" from "service_role";

revoke insert on table "public"."j-avatars-wearings" from "service_role";

revoke references on table "public"."j-avatars-wearings" from "service_role";

revoke select on table "public"."j-avatars-wearings" from "service_role";

revoke trigger on table "public"."j-avatars-wearings" from "service_role";

revoke truncate on table "public"."j-avatars-wearings" from "service_role";

revoke update on table "public"."j-avatars-wearings" from "service_role";

revoke delete on table "public"."vehicles" from "anon";

revoke insert on table "public"."vehicles" from "anon";

revoke references on table "public"."vehicles" from "anon";

revoke select on table "public"."vehicles" from "anon";

revoke trigger on table "public"."vehicles" from "anon";

revoke truncate on table "public"."vehicles" from "anon";

revoke update on table "public"."vehicles" from "anon";

revoke delete on table "public"."vehicles" from "authenticated";

revoke insert on table "public"."vehicles" from "authenticated";

revoke references on table "public"."vehicles" from "authenticated";

revoke select on table "public"."vehicles" from "authenticated";

revoke trigger on table "public"."vehicles" from "authenticated";

revoke truncate on table "public"."vehicles" from "authenticated";

revoke update on table "public"."vehicles" from "authenticated";

revoke delete on table "public"."vehicles" from "service_role";

revoke insert on table "public"."vehicles" from "service_role";

revoke references on table "public"."vehicles" from "service_role";

revoke select on table "public"."vehicles" from "service_role";

revoke trigger on table "public"."vehicles" from "service_role";

revoke truncate on table "public"."vehicles" from "service_role";

revoke update on table "public"."vehicles" from "service_role";

alter table "public"."character_assets" drop constraint "character_assets_id_key";

alter table "public"."character_assets" drop constraint "public_character_assets_user_fkey";

alter table "public"."character_assets" drop constraint "public_character_assets_vehicle_fkey";

alter table "public"."j-avatars-stickers" drop constraint "public_r_avatar_sticker_avatar_fkey";

alter table "public"."j-avatars-stickers" drop constraint "public_r_avatar_sticker_sticker_fkey";

alter table "public"."j-avatars-stickers" drop constraint "r_avatar_sticker_id_key";

alter table "public"."j-avatars-wearings" drop constraint "public_r-avatar-wearing_avatar_fkey";

alter table "public"."j-avatars-wearings" drop constraint "public_r-avatar-wearing_wearing_fkey";

alter table "public"."j-avatars-wearings" drop constraint "r_avatar_wearing_id_key";

alter table "public"."avatars" drop constraint "avatars_id_key";

alter table "public"."avatars" drop constraint "public_avatars_user_fkey";

alter table "public"."avatars" drop constraint "avatars_pkey";

alter table "public"."character_assets" drop constraint "character_assets_pkey";

alter table "public"."j-avatars-stickers" drop constraint "j-avatars-stickers_pkey";

alter table "public"."j-avatars-wearings" drop constraint "j-avatars-wearings_pkey";

alter table "public"."vehicles" drop constraint "vehicles_pkey";

drop index if exists "public"."avatars_id_key";

drop index if exists "public"."avatars_pkey";

drop index if exists "public"."character_assets_id_key";

drop index if exists "public"."character_assets_pkey";

drop index if exists "public"."j-avatars-stickers_pkey";

drop index if exists "public"."j-avatars-wearings_pkey";

drop index if exists "public"."r_avatar_sticker_id_key";

drop index if exists "public"."r_avatar_wearing_id_key";

drop index if exists "public"."vehicles_pkey";

drop table "public"."avatars";

drop table "public"."character_assets";

drop table "public"."j-avatars-stickers";

drop table "public"."j-avatars-wearings";

drop table "public"."vehicles";

