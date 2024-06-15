alter table "public"."trips" drop constraint "ensure_different_from_and_to";
drop function if exists "public"."archiev_trips"(ids uuid[]);
alter table "public"."character_assets" alter column "vehicle" drop default;
alter table "public"."regions" alter column "enabled" set default false;
alter table "public"."trips" add column "next_0" uuid not null;
alter table "public"."trips" add column "next_1" uuid not null;
alter table "public"."trips_archived" drop column "created_at";
alter table "public"."trips" add constraint "trips_check" CHECK ((("to" IS DISTINCT FROM next_0) AND ("to" IS DISTINCT FROM next_1) AND (next_0 IS DISTINCT FROM next_1) AND ("from" IS DISTINCT FROM "to"))) not valid;
alter table "public"."trips" validate constraint "trips_check";
alter table "public"."trips" add constraint "trips_check1" CHECK ((start_at < arrive_at)) not valid;
alter table "public"."trips" validate constraint "trips_check1";
alter table "public"."trips" add constraint "trips_next_0_fkey" FOREIGN KEY (next_0) REFERENCES regions(id) not valid;
alter table "public"."trips" validate constraint "trips_next_0_fkey";
alter table "public"."trips" add constraint "trips_next_1_fkey" FOREIGN KEY (next_1) REFERENCES regions(id) not valid;
alter table "public"."trips" validate constraint "trips_next_1_fkey";
set check_function_bodies = off;
CREATE OR REPLACE FUNCTION public.archive_trip()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    -- Insert the old trip data into the trips_archived table
    INSERT INTO trips_archived ("user", "from", "to", start_at, arrive_at)
    VALUES (OLD."user", OLD."from", OLD."to", OLD.start_at, OLD.arrive_at);

    -- Return NULL because we are not modifying the new row
    RETURN NEW;
END;$function$;
CREATE OR REPLACE FUNCTION public.archive_trips(ids uuid[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$begin
  insert into trips_archived (id, "user", "from", "to", start_at, arrive_at)
  select id, "user", "from", "to", start_at, arrive_at from trips where id = any(ids);

  delete from trips where id = any(ids);
end;$function$;
create policy "Enable select for authenticated users only"
on "public"."trips"
as permissive
for select
to authenticated
using ((auth.uid() = "user"));
CREATE TRIGGER trigger_archive_trip BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION archive_trip();
