create table "public"."one_o_one_player" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "anon_key" text not null,
    "wearings" jsonb default '{"0ad6a1ed-6157-4b42-9079-b85c303cb62c": "", "38a5e8e0-b0cc-4697-b5d2-29e32e73aa5e": "", "659857e0-cae2-4fb9-a42e-5f5271decceb": "", "7293990a-163a-4648-b7d8-b22d82e25545": "", "8a62ebad-ad3f-4801-b96c-50fe5b207729": "", "8f090ffb-9dc0-4e91-a0ee-ecba2bcec6d7": "", "92b8cb1f-753f-4af9-9e9e-4c35cc217b3a": "", "bbc43e92-860c-444f-9347-fd833958bfc6": "", "dc6930da-5d1e-4674-8760-0e0318b0361b": "", "fd0d871f-63e6-4da1-9a6d-876b5b19d055": ""}'::jsonb
);


CREATE UNIQUE INDEX one_o_one_player_pkey ON public.one_o_one_player USING btree (id);

alter table "public"."one_o_one_player" add constraint "one_o_one_player_pkey" PRIMARY KEY using index "one_o_one_player_pkey";

grant delete on table "public"."one_o_one_player" to "anon";

grant insert on table "public"."one_o_one_player" to "anon";

grant references on table "public"."one_o_one_player" to "anon";

grant select on table "public"."one_o_one_player" to "anon";

grant trigger on table "public"."one_o_one_player" to "anon";

grant truncate on table "public"."one_o_one_player" to "anon";

grant update on table "public"."one_o_one_player" to "anon";

grant delete on table "public"."one_o_one_player" to "authenticated";

grant insert on table "public"."one_o_one_player" to "authenticated";

grant references on table "public"."one_o_one_player" to "authenticated";

grant select on table "public"."one_o_one_player" to "authenticated";

grant trigger on table "public"."one_o_one_player" to "authenticated";

grant truncate on table "public"."one_o_one_player" to "authenticated";

grant update on table "public"."one_o_one_player" to "authenticated";

grant delete on table "public"."one_o_one_player" to "service_role";

grant insert on table "public"."one_o_one_player" to "service_role";

grant references on table "public"."one_o_one_player" to "service_role";

grant select on table "public"."one_o_one_player" to "service_role";

grant trigger on table "public"."one_o_one_player" to "service_role";

grant truncate on table "public"."one_o_one_player" to "service_role";

grant update on table "public"."one_o_one_player" to "service_role";


