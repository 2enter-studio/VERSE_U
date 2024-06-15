alter table "public"."trips" drop constraint "trips_pkey";
drop index if exists "public"."trips_pkey";
CREATE UNIQUE INDEX trips_pkey ON public.trips USING btree (id, "from", "to");
alter table "public"."trips" add constraint "trips_pkey" PRIMARY KEY using index "trips_pkey";
