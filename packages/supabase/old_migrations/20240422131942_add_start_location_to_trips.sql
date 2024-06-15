alter table "public"."trips" drop constraint "trips_destination_fkey";
alter table "public"."trips" drop column "destination";
alter table "public"."trips" add column "from" uuid not null;
alter table "public"."trips" add column "to" uuid not null;
alter table "public"."trips" add constraint "public_trips_to_fkey" FOREIGN KEY ("to") REFERENCES regions(id) not valid;
alter table "public"."trips" validate constraint "public_trips_to_fkey";
alter table "public"."trips" add constraint "trips_destination_fkey" FOREIGN KEY ("from") REFERENCES regions(id) not valid;
alter table "public"."trips" validate constraint "trips_destination_fkey";
