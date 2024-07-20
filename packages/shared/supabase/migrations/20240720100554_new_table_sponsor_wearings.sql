create table "public"."sponsor_wearings" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "wearing" uuid,
    "sponsor" uuid
);


alter table "public"."sponsor_wearings" enable row level security;

CREATE UNIQUE INDEX sponsor_wearings_id_key ON public.sponsor_wearings USING btree (id);

alter table "public"."sponsor_wearings" add constraint "sponsor_wearings_id_key" UNIQUE using index "sponsor_wearings_id_key";

alter table "public"."sponsor_wearings" add constraint "sponsor_wearings_sponsor_fkey" FOREIGN KEY (sponsor) REFERENCES sponsors(id) ON DELETE CASCADE not valid;

alter table "public"."sponsor_wearings" validate constraint "sponsor_wearings_sponsor_fkey";

alter table "public"."sponsor_wearings" add constraint "sponsor_wearings_wearing_fkey" FOREIGN KEY (wearing) REFERENCES wearings(id) ON DELETE CASCADE not valid;

alter table "public"."sponsor_wearings" validate constraint "sponsor_wearings_wearing_fkey";

grant delete on table "public"."sponsor_wearings" to "anon";

grant insert on table "public"."sponsor_wearings" to "anon";

grant references on table "public"."sponsor_wearings" to "anon";

grant select on table "public"."sponsor_wearings" to "anon";

grant trigger on table "public"."sponsor_wearings" to "anon";

grant truncate on table "public"."sponsor_wearings" to "anon";

grant update on table "public"."sponsor_wearings" to "anon";

grant delete on table "public"."sponsor_wearings" to "authenticated";

grant insert on table "public"."sponsor_wearings" to "authenticated";

grant references on table "public"."sponsor_wearings" to "authenticated";

grant select on table "public"."sponsor_wearings" to "authenticated";

grant trigger on table "public"."sponsor_wearings" to "authenticated";

grant truncate on table "public"."sponsor_wearings" to "authenticated";

grant update on table "public"."sponsor_wearings" to "authenticated";

grant delete on table "public"."sponsor_wearings" to "service_role";

grant insert on table "public"."sponsor_wearings" to "service_role";

grant references on table "public"."sponsor_wearings" to "service_role";

grant select on table "public"."sponsor_wearings" to "service_role";

grant trigger on table "public"."sponsor_wearings" to "service_role";

grant truncate on table "public"."sponsor_wearings" to "service_role";

grant update on table "public"."sponsor_wearings" to "service_role";


