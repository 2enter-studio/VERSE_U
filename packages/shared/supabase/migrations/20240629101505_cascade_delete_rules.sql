alter table "public"."owned_wearings" drop constraint "public_owned_wearings_owner_fkey";

alter table "public"."owned_wearings" drop constraint "public_owned_wearings_wearing_fkey";

alter table "public"."trips_archived" drop constraint "trips_archived_from_fkey";

alter table "public"."trips_archived" drop constraint "trips_archived_to_fkey";

alter table "public"."trips_archived" drop constraint "trips_archived_user_fkey";

alter table "public"."trips_archived" drop constraint "trips_archived_pkey";

drop index if exists "public"."trips_archived_pkey";

CREATE UNIQUE INDEX trips_archived_pkey ON public.trips_archived USING btree (id, "user", "from", "to");

alter table "public"."trips_archived" add constraint "trips_archived_pkey" PRIMARY KEY using index "trips_archived_pkey";

alter table "public"."owned_wearings" add constraint "public_owned_wearings_owner_fkey" FOREIGN KEY (owner) REFERENCES profiles("user") ON DELETE CASCADE not valid;

alter table "public"."owned_wearings" validate constraint "public_owned_wearings_owner_fkey";

alter table "public"."owned_wearings" add constraint "public_owned_wearings_wearing_fkey" FOREIGN KEY (wearing) REFERENCES wearings(id) ON DELETE CASCADE not valid;

alter table "public"."owned_wearings" validate constraint "public_owned_wearings_wearing_fkey";

alter table "public"."trips_archived" add constraint "trips_archived_from_fkey" FOREIGN KEY ("from") REFERENCES regions(id) ON DELETE CASCADE not valid;

alter table "public"."trips_archived" validate constraint "trips_archived_from_fkey";

alter table "public"."trips_archived" add constraint "trips_archived_to_fkey" FOREIGN KEY ("to") REFERENCES regions(id) ON DELETE CASCADE not valid;

alter table "public"."trips_archived" validate constraint "trips_archived_to_fkey";

alter table "public"."trips_archived" add constraint "trips_archived_user_fkey" FOREIGN KEY ("user") REFERENCES profiles("user") ON DELETE CASCADE not valid;

alter table "public"."trips_archived" validate constraint "trips_archived_user_fkey";


