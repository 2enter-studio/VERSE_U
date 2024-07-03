drop policy "Enable select for authenticated users only" on "public"."j-wearings-body_parts";

revoke delete on table "public"."j-wearings-body_parts" from "anon";

revoke insert on table "public"."j-wearings-body_parts" from "anon";

revoke references on table "public"."j-wearings-body_parts" from "anon";

revoke select on table "public"."j-wearings-body_parts" from "anon";

revoke trigger on table "public"."j-wearings-body_parts" from "anon";

revoke truncate on table "public"."j-wearings-body_parts" from "anon";

revoke update on table "public"."j-wearings-body_parts" from "anon";

revoke delete on table "public"."j-wearings-body_parts" from "authenticated";

revoke insert on table "public"."j-wearings-body_parts" from "authenticated";

revoke references on table "public"."j-wearings-body_parts" from "authenticated";

revoke select on table "public"."j-wearings-body_parts" from "authenticated";

revoke trigger on table "public"."j-wearings-body_parts" from "authenticated";

revoke truncate on table "public"."j-wearings-body_parts" from "authenticated";

revoke update on table "public"."j-wearings-body_parts" from "authenticated";

revoke delete on table "public"."j-wearings-body_parts" from "service_role";

revoke insert on table "public"."j-wearings-body_parts" from "service_role";

revoke references on table "public"."j-wearings-body_parts" from "service_role";

revoke select on table "public"."j-wearings-body_parts" from "service_role";

revoke trigger on table "public"."j-wearings-body_parts" from "service_role";

revoke truncate on table "public"."j-wearings-body_parts" from "service_role";

revoke update on table "public"."j-wearings-body_parts" from "service_role";

alter table "public"."j-wearings-body_parts" drop constraint "j-wearings-body_parts_id_key";

alter table "public"."j-wearings-body_parts" drop constraint "public_j-wearings-body_parts_base_fkey";

alter table "public"."j-wearings-body_parts" drop constraint "public_j-wearings-body_parts_related_fkey";

alter table "public"."j-wearings-body_parts" drop constraint "j-wearings-body_parts_pkey";

drop index if exists "public"."j-wearings-body_parts_pkey";

drop index if exists "public"."j-wearings-body_parts_id_key";

drop table "public"."j-wearings-body_parts";

create table "public"."j-meshes-body_parts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "mesh" uuid not null,
    "body_part" uuid not null
);


alter table "public"."j-meshes-body_parts" enable row level security;

CREATE UNIQUE INDEX "j-meshes-body_parts_pkey" ON public."j-meshes-body_parts" USING btree (mesh, body_part);

CREATE UNIQUE INDEX "j-wearings-body_parts_id_key" ON public."j-meshes-body_parts" USING btree (id);

alter table "public"."j-meshes-body_parts" add constraint "j-meshes-body_parts_pkey" PRIMARY KEY using index "j-meshes-body_parts_pkey";

alter table "public"."j-meshes-body_parts" add constraint "j-wearings-body_parts_id_key" UNIQUE using index "j-wearings-body_parts_id_key";

alter table "public"."j-meshes-body_parts" add constraint "public_j-meshes-body_parts_mesh_fkey" FOREIGN KEY (mesh) REFERENCES meshes(id) ON DELETE CASCADE not valid;

alter table "public"."j-meshes-body_parts" validate constraint "public_j-meshes-body_parts_mesh_fkey";

alter table "public"."j-meshes-body_parts" add constraint "public_j-wearings-body_parts_related_fkey" FOREIGN KEY (body_part) REFERENCES body_parts(id) not valid;

alter table "public"."j-meshes-body_parts" validate constraint "public_j-wearings-body_parts_related_fkey";

grant delete on table "public"."j-meshes-body_parts" to "anon";

grant insert on table "public"."j-meshes-body_parts" to "anon";

grant references on table "public"."j-meshes-body_parts" to "anon";

grant select on table "public"."j-meshes-body_parts" to "anon";

grant trigger on table "public"."j-meshes-body_parts" to "anon";

grant truncate on table "public"."j-meshes-body_parts" to "anon";

grant update on table "public"."j-meshes-body_parts" to "anon";

grant delete on table "public"."j-meshes-body_parts" to "authenticated";

grant insert on table "public"."j-meshes-body_parts" to "authenticated";

grant references on table "public"."j-meshes-body_parts" to "authenticated";

grant select on table "public"."j-meshes-body_parts" to "authenticated";

grant trigger on table "public"."j-meshes-body_parts" to "authenticated";

grant truncate on table "public"."j-meshes-body_parts" to "authenticated";

grant update on table "public"."j-meshes-body_parts" to "authenticated";

grant delete on table "public"."j-meshes-body_parts" to "service_role";

grant insert on table "public"."j-meshes-body_parts" to "service_role";

grant references on table "public"."j-meshes-body_parts" to "service_role";

grant select on table "public"."j-meshes-body_parts" to "service_role";

grant trigger on table "public"."j-meshes-body_parts" to "service_role";

grant truncate on table "public"."j-meshes-body_parts" to "service_role";

grant update on table "public"."j-meshes-body_parts" to "service_role";

create policy "Enable select for authenticated users only"
on "public"."j-meshes-body_parts"
as permissive
for select
to authenticated
using (true);



