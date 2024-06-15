create table "public"."character_assets" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user" uuid not null default gen_random_uuid(),
    "coin" integer not null default 0,
    "exp" integer not null default 0,
    "vehicle" uuid default gen_random_uuid()
);
alter table "public"."character_assets" enable row level security;
create table "public"."vehicles" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "speed" smallint not null default '1'::smallint
);
alter table "public"."vehicles" enable row level security;
CREATE UNIQUE INDEX character_assets_id_key ON public.character_assets USING btree (id);
CREATE UNIQUE INDEX character_assets_pkey ON public.character_assets USING btree ("user");
CREATE UNIQUE INDEX vehicles_pkey ON public.vehicles USING btree (id);
alter table "public"."character_assets" add constraint "character_assets_pkey" PRIMARY KEY using index "character_assets_pkey";
alter table "public"."vehicles" add constraint "vehicles_pkey" PRIMARY KEY using index "vehicles_pkey";
alter table "public"."character_assets" add constraint "character_assets_id_key" UNIQUE using index "character_assets_id_key";
alter table "public"."character_assets" add constraint "public_character_assets_user_fkey" FOREIGN KEY ("user") REFERENCES profiles("user") not valid;
alter table "public"."character_assets" validate constraint "public_character_assets_user_fkey";
alter table "public"."character_assets" add constraint "public_character_assets_vehicle_fkey" FOREIGN KEY (vehicle) REFERENCES vehicles(id) not valid;
alter table "public"."character_assets" validate constraint "public_character_assets_vehicle_fkey";
grant delete on table "public"."character_assets" to "anon";
grant insert on table "public"."character_assets" to "anon";
grant references on table "public"."character_assets" to "anon";
grant select on table "public"."character_assets" to "anon";
grant trigger on table "public"."character_assets" to "anon";
grant truncate on table "public"."character_assets" to "anon";
grant update on table "public"."character_assets" to "anon";
grant delete on table "public"."character_assets" to "authenticated";
grant insert on table "public"."character_assets" to "authenticated";
grant references on table "public"."character_assets" to "authenticated";
grant select on table "public"."character_assets" to "authenticated";
grant trigger on table "public"."character_assets" to "authenticated";
grant truncate on table "public"."character_assets" to "authenticated";
grant update on table "public"."character_assets" to "authenticated";
grant delete on table "public"."character_assets" to "service_role";
grant insert on table "public"."character_assets" to "service_role";
grant references on table "public"."character_assets" to "service_role";
grant select on table "public"."character_assets" to "service_role";
grant trigger on table "public"."character_assets" to "service_role";
grant truncate on table "public"."character_assets" to "service_role";
grant update on table "public"."character_assets" to "service_role";
grant delete on table "public"."vehicles" to "anon";
grant insert on table "public"."vehicles" to "anon";
grant references on table "public"."vehicles" to "anon";
grant select on table "public"."vehicles" to "anon";
grant trigger on table "public"."vehicles" to "anon";
grant truncate on table "public"."vehicles" to "anon";
grant update on table "public"."vehicles" to "anon";
grant delete on table "public"."vehicles" to "authenticated";
grant insert on table "public"."vehicles" to "authenticated";
grant references on table "public"."vehicles" to "authenticated";
grant select on table "public"."vehicles" to "authenticated";
grant trigger on table "public"."vehicles" to "authenticated";
grant truncate on table "public"."vehicles" to "authenticated";
grant update on table "public"."vehicles" to "authenticated";
grant delete on table "public"."vehicles" to "service_role";
grant insert on table "public"."vehicles" to "service_role";
grant references on table "public"."vehicles" to "service_role";
grant select on table "public"."vehicles" to "service_role";
grant trigger on table "public"."vehicles" to "service_role";
grant truncate on table "public"."vehicles" to "service_role";
grant update on table "public"."vehicles" to "service_role";
