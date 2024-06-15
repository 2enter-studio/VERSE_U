revoke delete on table "public"."sticker" from "anon";
revoke insert on table "public"."sticker" from "anon";
revoke references on table "public"."sticker" from "anon";
revoke select on table "public"."sticker" from "anon";
revoke trigger on table "public"."sticker" from "anon";
revoke truncate on table "public"."sticker" from "anon";
revoke update on table "public"."sticker" from "anon";
revoke delete on table "public"."sticker" from "authenticated";
revoke insert on table "public"."sticker" from "authenticated";
revoke references on table "public"."sticker" from "authenticated";
revoke select on table "public"."sticker" from "authenticated";
revoke trigger on table "public"."sticker" from "authenticated";
revoke truncate on table "public"."sticker" from "authenticated";
revoke update on table "public"."sticker" from "authenticated";
revoke delete on table "public"."sticker" from "service_role";
revoke insert on table "public"."sticker" from "service_role";
revoke references on table "public"."sticker" from "service_role";
revoke select on table "public"."sticker" from "service_role";
revoke trigger on table "public"."sticker" from "service_role";
revoke truncate on table "public"."sticker" from "service_role";
revoke update on table "public"."sticker" from "service_role";
alter table "public"."j-avatars-stickers" drop constraint "public_r_avatar_sticker_sticker_fkey";
alter table "public"."sticker" drop constraint "sticker_pkey";
drop index if exists "public"."sticker_pkey";
drop table "public"."sticker";
create table "public"."owned_wearings" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "owner" uuid not null default auth.uid(),
    "wearing" uuid not null,
    "equipped" boolean not null default false
);
alter table "public"."owned_wearings" enable row level security;
create table "public"."stickers" (
    "created_at" timestamp with time zone not null default now(),
    "id" uuid not null default gen_random_uuid(),
    "updated_at" timestamp with time zone not null default now()
);
alter table "public"."stickers" enable row level security;
alter table "public"."avatars" alter column "user" set default auth.uid();
alter table "public"."chat_messages" alter column "sender" set default auth.uid();
alter table "public"."profiles" alter column "user" set default auth.uid();
alter table "public"."trips" alter column "user" set default auth.uid();
alter table "public"."wearings" alter column "mesh" set default '37dbcd60-b604-4460-91e1-6c4687b0411c'::uuid;
CREATE UNIQUE INDEX owned_wearings_id_key ON public.owned_wearings USING btree (id);
CREATE UNIQUE INDEX owned_wearings_pkey ON public.owned_wearings USING btree (wearing, owner);
CREATE UNIQUE INDEX sticker_pkey ON public.stickers USING btree (id);
alter table "public"."owned_wearings" add constraint "owned_wearings_pkey" PRIMARY KEY using index "owned_wearings_pkey";
alter table "public"."stickers" add constraint "sticker_pkey" PRIMARY KEY using index "sticker_pkey";
alter table "public"."owned_wearings" add constraint "owned_wearings_id_key" UNIQUE using index "owned_wearings_id_key";
alter table "public"."owned_wearings" add constraint "owned_wearings_owner_fkey" FOREIGN KEY (owner) REFERENCES profiles("user") not valid;
alter table "public"."owned_wearings" validate constraint "owned_wearings_owner_fkey";
alter table "public"."owned_wearings" add constraint "owned_wearings_wearing_fkey" FOREIGN KEY (wearing) REFERENCES wearings(id) not valid;
alter table "public"."owned_wearings" validate constraint "owned_wearings_wearing_fkey";
alter table "public"."j-avatars-stickers" add constraint "public_r_avatar_sticker_sticker_fkey" FOREIGN KEY (sticker) REFERENCES stickers(id) not valid;
alter table "public"."j-avatars-stickers" validate constraint "public_r_avatar_sticker_sticker_fkey";
grant delete on table "public"."owned_wearings" to "anon";
grant insert on table "public"."owned_wearings" to "anon";
grant references on table "public"."owned_wearings" to "anon";
grant select on table "public"."owned_wearings" to "anon";
grant trigger on table "public"."owned_wearings" to "anon";
grant truncate on table "public"."owned_wearings" to "anon";
grant update on table "public"."owned_wearings" to "anon";
grant delete on table "public"."owned_wearings" to "authenticated";
grant insert on table "public"."owned_wearings" to "authenticated";
grant references on table "public"."owned_wearings" to "authenticated";
grant select on table "public"."owned_wearings" to "authenticated";
grant trigger on table "public"."owned_wearings" to "authenticated";
grant truncate on table "public"."owned_wearings" to "authenticated";
grant update on table "public"."owned_wearings" to "authenticated";
grant delete on table "public"."owned_wearings" to "service_role";
grant insert on table "public"."owned_wearings" to "service_role";
grant references on table "public"."owned_wearings" to "service_role";
grant select on table "public"."owned_wearings" to "service_role";
grant trigger on table "public"."owned_wearings" to "service_role";
grant truncate on table "public"."owned_wearings" to "service_role";
grant update on table "public"."owned_wearings" to "service_role";
grant delete on table "public"."stickers" to "anon";
grant insert on table "public"."stickers" to "anon";
grant references on table "public"."stickers" to "anon";
grant select on table "public"."stickers" to "anon";
grant trigger on table "public"."stickers" to "anon";
grant truncate on table "public"."stickers" to "anon";
grant update on table "public"."stickers" to "anon";
grant delete on table "public"."stickers" to "authenticated";
grant insert on table "public"."stickers" to "authenticated";
grant references on table "public"."stickers" to "authenticated";
grant select on table "public"."stickers" to "authenticated";
grant trigger on table "public"."stickers" to "authenticated";
grant truncate on table "public"."stickers" to "authenticated";
grant update on table "public"."stickers" to "authenticated";
grant delete on table "public"."stickers" to "service_role";
grant insert on table "public"."stickers" to "service_role";
grant references on table "public"."stickers" to "service_role";
grant select on table "public"."stickers" to "service_role";
grant trigger on table "public"."stickers" to "service_role";
grant truncate on table "public"."stickers" to "service_role";
grant update on table "public"."stickers" to "service_role";
create policy "Enable select for authenticated users only"
on "public"."body_parts"
as permissive
for select
to authenticated
using (true);
create policy "Enable select for authenticated users only"
on "public"."j-wearings-body_parts"
as permissive
for select
to authenticated
using (true);
create policy "Enable select for authenticated users only"
on "public"."j-wearings-texture_types"
as permissive
for select
to authenticated
using (true);
create policy "Enable select for authenticated users only"
on "public"."j-wearings-wearing_types"
as permissive
for select
to authenticated
using (true);
create policy "Users can select their wearings or every equipped wearings"
on "public"."owned_wearings"
as permissive
for select
to authenticated
using (((auth.uid() = owner) OR (equipped = true)));
create policy "Enable select for authenticated users only"
on "public"."texture_types"
as permissive
for select
to authenticated
using (true);
create policy "Enable select for authenticated users only"
on "public"."wearing_types"
as permissive
for select
to authenticated
using (true);
create policy "All authenticated users can select all wearings"
on "public"."wearings"
as permissive
for select
to authenticated
using (true);
