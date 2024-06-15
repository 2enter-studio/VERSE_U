create table "public"."trips" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user" uuid not null,
    "destination" uuid not null,
    "start_at" timestamp with time zone not null,
    "arrive_at" timestamp with time zone not null
);
CREATE UNIQUE INDEX trips_pkey ON public.trips USING btree (id);
alter table "public"."trips" add constraint "trips_pkey" PRIMARY KEY using index "trips_pkey";
alter table "public"."trips" add constraint "trips_destination_fkey" FOREIGN KEY (destination) REFERENCES regions(id) not valid;
alter table "public"."trips" validate constraint "trips_destination_fkey";
alter table "public"."trips" add constraint "trips_user_fkey" FOREIGN KEY ("user") REFERENCES profiles("user") not valid;
alter table "public"."trips" validate constraint "trips_user_fkey";
grant delete on table "public"."trips" to "anon";
grant insert on table "public"."trips" to "anon";
grant references on table "public"."trips" to "anon";
grant select on table "public"."trips" to "anon";
grant trigger on table "public"."trips" to "anon";
grant truncate on table "public"."trips" to "anon";
grant update on table "public"."trips" to "anon";
grant delete on table "public"."trips" to "authenticated";
grant insert on table "public"."trips" to "authenticated";
grant references on table "public"."trips" to "authenticated";
grant select on table "public"."trips" to "authenticated";
grant trigger on table "public"."trips" to "authenticated";
grant truncate on table "public"."trips" to "authenticated";
grant update on table "public"."trips" to "authenticated";
grant delete on table "public"."trips" to "service_role";
grant insert on table "public"."trips" to "service_role";
grant references on table "public"."trips" to "service_role";
grant select on table "public"."trips" to "service_role";
grant trigger on table "public"."trips" to "service_role";
grant truncate on table "public"."trips" to "service_role";
grant update on table "public"."trips" to "service_role";
