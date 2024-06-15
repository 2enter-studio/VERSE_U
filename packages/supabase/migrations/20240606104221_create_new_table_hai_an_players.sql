create table "public"."hai_an_players" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "player" uuid not null default gen_random_uuid()
);


alter table "public"."hai_an_players" enable row level security;

CREATE UNIQUE INDEX hai_an_players_id_key ON public.hai_an_players USING btree (id);

CREATE UNIQUE INDEX hai_an_players_pkey ON public.hai_an_players USING btree (player);

CREATE UNIQUE INDEX hai_an_players_player_key ON public.hai_an_players USING btree (player);

alter table "public"."hai_an_players" add constraint "hai_an_players_pkey" PRIMARY KEY using index "hai_an_players_pkey";

alter table "public"."hai_an_players" add constraint "hai_an_players_id_key" UNIQUE using index "hai_an_players_id_key";

alter table "public"."hai_an_players" add constraint "hai_an_players_player_key" UNIQUE using index "hai_an_players_player_key";

alter table "public"."hai_an_players" add constraint "public_hai_an_players_player_fkey" FOREIGN KEY (player) REFERENCES profiles("user") not valid;

alter table "public"."hai_an_players" validate constraint "public_hai_an_players_player_fkey";

grant delete on table "public"."hai_an_players" to "anon";

grant insert on table "public"."hai_an_players" to "anon";

grant references on table "public"."hai_an_players" to "anon";

grant select on table "public"."hai_an_players" to "anon";

grant trigger on table "public"."hai_an_players" to "anon";

grant truncate on table "public"."hai_an_players" to "anon";

grant update on table "public"."hai_an_players" to "anon";

grant delete on table "public"."hai_an_players" to "authenticated";

grant insert on table "public"."hai_an_players" to "authenticated";

grant references on table "public"."hai_an_players" to "authenticated";

grant select on table "public"."hai_an_players" to "authenticated";

grant trigger on table "public"."hai_an_players" to "authenticated";

grant truncate on table "public"."hai_an_players" to "authenticated";

grant update on table "public"."hai_an_players" to "authenticated";

grant delete on table "public"."hai_an_players" to "service_role";

grant insert on table "public"."hai_an_players" to "service_role";

grant references on table "public"."hai_an_players" to "service_role";

grant select on table "public"."hai_an_players" to "service_role";

grant trigger on table "public"."hai_an_players" to "service_role";

grant truncate on table "public"."hai_an_players" to "service_role";

grant update on table "public"."hai_an_players" to "service_role";

create policy "User can check if they're in this table"
on "public"."hai_an_players"
as permissive
for select
to authenticated
using ((player = auth.uid()));



