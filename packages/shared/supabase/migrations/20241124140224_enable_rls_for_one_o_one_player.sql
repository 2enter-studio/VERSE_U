alter table "public"."one_o_one_player" drop constraint "one_o_one_player_pkey";

drop index if exists "public"."one_o_one_player_pkey";

alter table "public"."one_o_one_player" enable row level security;

CREATE UNIQUE INDEX one_o_one_player_pkey ON public.one_o_one_player USING btree (anon_key);

alter table "public"."one_o_one_player" add constraint "one_o_one_player_pkey" PRIMARY KEY using index "one_o_one_player_pkey";

create policy "Enable insert for authenticated users only"
on "public"."one_o_one_player"
as permissive
for insert
to authenticated
with check (true);



