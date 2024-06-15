create table "public"."trips_archived" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user" uuid not null,
    "from" uuid not null,
    "start_at" timestamp with time zone not null,
    "arrive_at" timestamp with time zone not null,
    "to" uuid not null
);
alter table "public"."trips_archived" enable row level security;
alter table "public"."trips" alter column "start_at" set default now();
CREATE UNIQUE INDEX trips_archived_pkey ON public.trips_archived USING btree ("user", id, "from", "to");
alter table "public"."trips_archived" add constraint "trips_archived_pkey" PRIMARY KEY using index "trips_archived_pkey";
alter table "public"."trips" add constraint "ensure_different_from_and_to" CHECK (("from" <> "to")) not valid;
alter table "public"."trips" validate constraint "ensure_different_from_and_to";
alter table "public"."trips_archived" add constraint "public_trips_archived_from_fkey" FOREIGN KEY ("from") REFERENCES regions(id) not valid;
alter table "public"."trips_archived" validate constraint "public_trips_archived_from_fkey";
alter table "public"."trips_archived" add constraint "public_trips_archived_to_fkey" FOREIGN KEY ("to") REFERENCES regions(id) not valid;
alter table "public"."trips_archived" validate constraint "public_trips_archived_to_fkey";
alter table "public"."trips_archived" add constraint "public_trips_archived_user_fkey" FOREIGN KEY ("user") REFERENCES profiles("user") not valid;
alter table "public"."trips_archived" validate constraint "public_trips_archived_user_fkey";
set check_function_bodies = off;
CREATE OR REPLACE FUNCTION public.archiev_trips(ids uuid[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  insert into trips_archived
  select * from trips where id = any(ids);

  delete from trips where id = any(ids);
end;
$function$;
grant delete on table "public"."trips_archived" to "anon";
grant insert on table "public"."trips_archived" to "anon";
grant references on table "public"."trips_archived" to "anon";
grant select on table "public"."trips_archived" to "anon";
grant trigger on table "public"."trips_archived" to "anon";
grant truncate on table "public"."trips_archived" to "anon";
grant update on table "public"."trips_archived" to "anon";
grant delete on table "public"."trips_archived" to "authenticated";
grant insert on table "public"."trips_archived" to "authenticated";
grant references on table "public"."trips_archived" to "authenticated";
grant select on table "public"."trips_archived" to "authenticated";
grant trigger on table "public"."trips_archived" to "authenticated";
grant truncate on table "public"."trips_archived" to "authenticated";
grant update on table "public"."trips_archived" to "authenticated";
grant delete on table "public"."trips_archived" to "service_role";
grant insert on table "public"."trips_archived" to "service_role";
grant references on table "public"."trips_archived" to "service_role";
grant select on table "public"."trips_archived" to "service_role";
grant trigger on table "public"."trips_archived" to "service_role";
grant truncate on table "public"."trips_archived" to "service_role";
grant update on table "public"."trips_archived" to "service_role";
