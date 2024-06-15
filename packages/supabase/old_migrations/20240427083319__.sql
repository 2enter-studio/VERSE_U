-- alter table "_realtime"."tenants" drop column "enable_authorization";


drop policy "Users can see their chat members" on "public"."j-chats-users";
drop policy "Enable select for authenticated users only" on "public"."trips";
revoke delete on table "public"."j-chats-users" from "anon";
revoke insert on table "public"."j-chats-users" from "anon";
revoke references on table "public"."j-chats-users" from "anon";
revoke select on table "public"."j-chats-users" from "anon";
revoke trigger on table "public"."j-chats-users" from "anon";
revoke truncate on table "public"."j-chats-users" from "anon";
revoke update on table "public"."j-chats-users" from "anon";
revoke delete on table "public"."j-chats-users" from "authenticated";
revoke insert on table "public"."j-chats-users" from "authenticated";
revoke references on table "public"."j-chats-users" from "authenticated";
revoke select on table "public"."j-chats-users" from "authenticated";
revoke trigger on table "public"."j-chats-users" from "authenticated";
revoke truncate on table "public"."j-chats-users" from "authenticated";
revoke update on table "public"."j-chats-users" from "authenticated";
revoke delete on table "public"."j-chats-users" from "service_role";
revoke insert on table "public"."j-chats-users" from "service_role";
revoke references on table "public"."j-chats-users" from "service_role";
revoke select on table "public"."j-chats-users" from "service_role";
revoke trigger on table "public"."j-chats-users" from "service_role";
revoke truncate on table "public"."j-chats-users" from "service_role";
revoke update on table "public"."j-chats-users" from "service_role";
alter table "public"."j-chats-users" drop constraint "public_j-chats-users_user_fkey";
alter table "public"."j-chats-users" drop constraint "public_r_chat_members_chat_fkey";
alter table "public"."j-chats-users" drop constraint "r_chat_members_id_key";
alter table "public"."j-chats-users" drop constraint "j-chats-users_pkey";
alter table "public"."trips" drop constraint "trips_pkey";
drop index if exists "public"."j-chats-users_pkey";
drop index if exists "public"."r_chat_members_id_key";
drop index if exists "public"."trips_pkey";
drop table "public"."j-chats-users";
create table "public"."chat_members" (
    "created_at" timestamp with time zone not null default now(),
    "id" uuid not null default gen_random_uuid(),
    "chat" uuid not null,
    "user" uuid not null,
    "agree" boolean not null default false
);
alter table "public"."chat_members" enable row level security;
CREATE UNIQUE INDEX trips_id_key ON public.trips USING btree (id);
CREATE UNIQUE INDEX trips_user_key ON public.trips USING btree ("user");
CREATE UNIQUE INDEX "j-chats-users_pkey" ON public.chat_members USING btree (chat, "user");
CREATE UNIQUE INDEX r_chat_members_id_key ON public.chat_members USING btree (id);
CREATE UNIQUE INDEX trips_pkey ON public.trips USING btree ("user", "from", "to");
alter table "public"."chat_members" add constraint "j-chats-users_pkey" PRIMARY KEY using index "j-chats-users_pkey";
alter table "public"."trips" add constraint "trips_pkey" PRIMARY KEY using index "trips_pkey";
alter table "public"."chat_members" add constraint "public_j-chats-users_user_fkey" FOREIGN KEY ("user") REFERENCES profiles("user") not valid;
alter table "public"."chat_members" validate constraint "public_j-chats-users_user_fkey";
alter table "public"."chat_members" add constraint "public_r_chat_members_chat_fkey" FOREIGN KEY (chat) REFERENCES chats(id) not valid;
alter table "public"."chat_members" validate constraint "public_r_chat_members_chat_fkey";
alter table "public"."chat_members" add constraint "r_chat_members_id_key" UNIQUE using index "r_chat_members_id_key";
alter table "public"."trips" add constraint "trips_id_key" UNIQUE using index "trips_id_key";
alter table "public"."trips" add constraint "trips_user_key" UNIQUE using index "trips_user_key";
grant delete on table "public"."chat_members" to "anon";
grant insert on table "public"."chat_members" to "anon";
grant references on table "public"."chat_members" to "anon";
grant select on table "public"."chat_members" to "anon";
grant trigger on table "public"."chat_members" to "anon";
grant truncate on table "public"."chat_members" to "anon";
grant update on table "public"."chat_members" to "anon";
grant delete on table "public"."chat_members" to "authenticated";
grant insert on table "public"."chat_members" to "authenticated";
grant references on table "public"."chat_members" to "authenticated";
grant select on table "public"."chat_members" to "authenticated";
grant trigger on table "public"."chat_members" to "authenticated";
grant truncate on table "public"."chat_members" to "authenticated";
grant update on table "public"."chat_members" to "authenticated";
grant delete on table "public"."chat_members" to "service_role";
grant insert on table "public"."chat_members" to "service_role";
grant references on table "public"."chat_members" to "service_role";
grant select on table "public"."chat_members" to "service_role";
grant trigger on table "public"."chat_members" to "service_role";
grant truncate on table "public"."chat_members" to "service_role";
grant update on table "public"."chat_members" to "service_role";
create policy "Users can see their chat members"
on "public"."chat_members"
as permissive
for select
to public
using (is_chat_member(auth.uid(), chat));
create policy "Enable select for authenticated users only"
on "public"."ml_texts"
as permissive
for select
to authenticated
using (true);
create policy "Enable select for authenticated users only"
on "public"."regions"
as permissive
for select
to authenticated
using (true);
create policy "Enable select for authenticated users only"
on "public"."trips"
as permissive
for select
to authenticated
using (true);
