revoke delete on table "public"."app_updates" from "anon";

revoke insert on table "public"."app_updates" from "anon";

revoke references on table "public"."app_updates" from "anon";

revoke select on table "public"."app_updates" from "anon";

revoke trigger on table "public"."app_updates" from "anon";

revoke truncate on table "public"."app_updates" from "anon";

revoke update on table "public"."app_updates" from "anon";

revoke delete on table "public"."app_updates" from "authenticated";

revoke insert on table "public"."app_updates" from "authenticated";

revoke references on table "public"."app_updates" from "authenticated";

revoke select on table "public"."app_updates" from "authenticated";

revoke trigger on table "public"."app_updates" from "authenticated";

revoke truncate on table "public"."app_updates" from "authenticated";

revoke update on table "public"."app_updates" from "authenticated";

revoke delete on table "public"."app_updates" from "service_role";

revoke insert on table "public"."app_updates" from "service_role";

revoke references on table "public"."app_updates" from "service_role";

revoke select on table "public"."app_updates" from "service_role";

revoke trigger on table "public"."app_updates" from "service_role";

revoke truncate on table "public"."app_updates" from "service_role";

revoke update on table "public"."app_updates" from "service_role";

alter table "public"."app_updates" drop constraint "app_updates_id_key";

alter table "public"."app_updates" drop constraint "app_updates_version_key";

alter table "public"."app_updates" drop constraint "both_or_none_null";

alter table "public"."app_updates" drop constraint "app_updates_pkey";

drop index if exists "public"."app_updates_pkey";

drop index if exists "public"."app_updates_id_key";

drop index if exists "public"."app_updates_version_key";

drop table "public"."app_updates";

create table "public"."app_versions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "value" text not null,
    "maintenance_start" timestamp with time zone,
    "maintenance_end" timestamp with time zone
);


alter table "public"."app_versions" enable row level security;

CREATE UNIQUE INDEX app_versions_pkey ON public.app_versions USING btree (value);

CREATE UNIQUE INDEX app_updates_id_key ON public.app_versions USING btree (id);

CREATE UNIQUE INDEX app_updates_version_key ON public.app_versions USING btree (value);

alter table "public"."app_versions" add constraint "app_versions_pkey" PRIMARY KEY using index "app_versions_pkey";

alter table "public"."app_versions" add constraint "app_updates_id_key" UNIQUE using index "app_updates_id_key";

alter table "public"."app_versions" add constraint "app_updates_version_key" UNIQUE using index "app_updates_version_key";

alter table "public"."app_versions" add constraint "both_or_none_null" CHECK ((((maintenance_start IS NULL) AND (maintenance_end IS NULL)) OR ((maintenance_start IS NOT NULL) AND (maintenance_end IS NOT NULL)))) not valid;

alter table "public"."app_versions" validate constraint "both_or_none_null";

grant delete on table "public"."app_versions" to "anon";

grant insert on table "public"."app_versions" to "anon";

grant references on table "public"."app_versions" to "anon";

grant select on table "public"."app_versions" to "anon";

grant trigger on table "public"."app_versions" to "anon";

grant truncate on table "public"."app_versions" to "anon";

grant update on table "public"."app_versions" to "anon";

grant delete on table "public"."app_versions" to "authenticated";

grant insert on table "public"."app_versions" to "authenticated";

grant references on table "public"."app_versions" to "authenticated";

grant select on table "public"."app_versions" to "authenticated";

grant trigger on table "public"."app_versions" to "authenticated";

grant truncate on table "public"."app_versions" to "authenticated";

grant update on table "public"."app_versions" to "authenticated";

grant delete on table "public"."app_versions" to "service_role";

grant insert on table "public"."app_versions" to "service_role";

grant references on table "public"."app_versions" to "service_role";

grant select on table "public"."app_versions" to "service_role";

grant trigger on table "public"."app_versions" to "service_role";

grant truncate on table "public"."app_versions" to "service_role";

grant update on table "public"."app_versions" to "service_role";


