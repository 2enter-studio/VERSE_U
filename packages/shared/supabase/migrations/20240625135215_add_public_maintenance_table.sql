alter table "public"."app_versions" drop constraint "both_or_none_null";

create table "public"."maintenance" (
    "id" uuid not null default gen_random_uuid(),
    "start" timestamp with time zone not null default now(),
    "end" timestamp with time zone not null default now()
);


alter table "public"."maintenance" enable row level security;

alter table "public"."app_versions" drop column "maintenance_end";

alter table "public"."app_versions" drop column "maintenance_start";

CREATE UNIQUE INDEX maintenance_end_key ON public.maintenance USING btree ("end");

CREATE UNIQUE INDEX maintenance_pkey ON public.maintenance USING btree (id);

CREATE UNIQUE INDEX maintenance_start_key ON public.maintenance USING btree (start);

alter table "public"."maintenance" add constraint "maintenance_pkey" PRIMARY KEY using index "maintenance_pkey";

alter table "public"."maintenance" add constraint "maintenance_end_key" UNIQUE using index "maintenance_end_key";

alter table "public"."maintenance" add constraint "maintenance_start_key" UNIQUE using index "maintenance_start_key";

grant delete on table "public"."maintenance" to "anon";

grant insert on table "public"."maintenance" to "anon";

grant references on table "public"."maintenance" to "anon";

grant select on table "public"."maintenance" to "anon";

grant trigger on table "public"."maintenance" to "anon";

grant truncate on table "public"."maintenance" to "anon";

grant update on table "public"."maintenance" to "anon";

grant delete on table "public"."maintenance" to "authenticated";

grant insert on table "public"."maintenance" to "authenticated";

grant references on table "public"."maintenance" to "authenticated";

grant select on table "public"."maintenance" to "authenticated";

grant trigger on table "public"."maintenance" to "authenticated";

grant truncate on table "public"."maintenance" to "authenticated";

grant update on table "public"."maintenance" to "authenticated";

grant delete on table "public"."maintenance" to "service_role";

grant insert on table "public"."maintenance" to "service_role";

grant references on table "public"."maintenance" to "service_role";

grant select on table "public"."maintenance" to "service_role";

grant trigger on table "public"."maintenance" to "service_role";

grant truncate on table "public"."maintenance" to "service_role";

grant update on table "public"."maintenance" to "service_role";

create policy "Enable read access for all users"
on "public"."app_versions"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."maintenance"
as permissive
for select
to public
using (true);



