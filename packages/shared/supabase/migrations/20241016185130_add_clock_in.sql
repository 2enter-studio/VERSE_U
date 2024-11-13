alter table "public"."profiles" add column "clock_in" jsonb not null default '{"fri": null, "mon": null, "sat": null, "sun": null, "thu": null, "tue": null, "wed": null}'::jsonb;

alter table "public"."profiles" add column "unergy" numeric not null default '0'::numeric;

alter table "public"."wearings" add column "price" numeric default '0'::numeric;

alter table "public"."profiles" add constraint "profiles_unergy_check" CHECK ((unergy >= (0)::numeric)) not valid;

alter table "public"."profiles" validate constraint "profiles_unergy_check";

alter table "public"."wearings" add constraint "wearings_price_check" CHECK ((price >= (0)::numeric)) not valid;

alter table "public"."wearings" validate constraint "wearings_price_check";


