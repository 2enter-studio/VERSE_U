create table "public"."app_updates" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "version" text not null,
    "maintenance_start" timestamp with time zone,
    "maintenance_end" timestamp with time zone
);


alter table "public"."app_updates" enable row level security;

CREATE UNIQUE INDEX app_updates_id_key ON public.app_updates USING btree (id);

CREATE UNIQUE INDEX app_updates_pkey ON public.app_updates USING btree (version);

CREATE UNIQUE INDEX app_updates_version_key ON public.app_updates USING btree (version);

alter table "public"."app_updates" add constraint "app_updates_pkey" PRIMARY KEY using index "app_updates_pkey";

alter table "public"."app_updates" add constraint "app_updates_id_key" UNIQUE using index "app_updates_id_key";

alter table "public"."app_updates" add constraint "app_updates_version_key" UNIQUE using index "app_updates_version_key";

alter table "public"."app_updates" add constraint "both_or_none_null" CHECK ((((maintenance_start IS NULL) AND (maintenance_end IS NULL)) OR ((maintenance_start IS NOT NULL) AND (maintenance_end IS NOT NULL)))) not valid;

alter table "public"."app_updates" validate constraint "both_or_none_null";

grant delete on table "public"."app_updates" to "anon";

grant insert on table "public"."app_updates" to "anon";

grant references on table "public"."app_updates" to "anon";

grant select on table "public"."app_updates" to "anon";

grant trigger on table "public"."app_updates" to "anon";

grant truncate on table "public"."app_updates" to "anon";

grant update on table "public"."app_updates" to "anon";

grant delete on table "public"."app_updates" to "authenticated";

grant insert on table "public"."app_updates" to "authenticated";

grant references on table "public"."app_updates" to "authenticated";

grant select on table "public"."app_updates" to "authenticated";

grant trigger on table "public"."app_updates" to "authenticated";

grant truncate on table "public"."app_updates" to "authenticated";

grant update on table "public"."app_updates" to "authenticated";

grant delete on table "public"."app_updates" to "service_role";

grant insert on table "public"."app_updates" to "service_role";

grant references on table "public"."app_updates" to "service_role";

grant select on table "public"."app_updates" to "service_role";

grant trigger on table "public"."app_updates" to "service_role";

grant truncate on table "public"."app_updates" to "service_role";

grant update on table "public"."app_updates" to "service_role";


