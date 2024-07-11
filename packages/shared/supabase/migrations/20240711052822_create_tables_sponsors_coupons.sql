create table "public"."coupons" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user" uuid not null,
    "sponsor" uuid not null,
    "used" boolean not null default false
);


alter table "public"."coupons" enable row level security;

create table "public"."sponsors" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "value" text not null
);


alter table "public"."sponsors" enable row level security;

CREATE UNIQUE INDEX coupons_id_key ON public.coupons USING btree (id);

CREATE UNIQUE INDEX coupons_pkey ON public.coupons USING btree ("user", sponsor);

CREATE UNIQUE INDEX sponsors_pkey ON public.sponsors USING btree (id);

CREATE UNIQUE INDEX sponsors_value_key ON public.sponsors USING btree (value);

alter table "public"."coupons" add constraint "coupons_pkey" PRIMARY KEY using index "coupons_pkey";

alter table "public"."sponsors" add constraint "sponsors_pkey" PRIMARY KEY using index "sponsors_pkey";

alter table "public"."coupons" add constraint "coupons_id_key" UNIQUE using index "coupons_id_key";

alter table "public"."coupons" add constraint "public_coupons_sponsor_fkey" FOREIGN KEY (sponsor) REFERENCES sponsors(id) ON DELETE CASCADE not valid;

alter table "public"."coupons" validate constraint "public_coupons_sponsor_fkey";

alter table "public"."coupons" add constraint "public_coupons_user_fkey" FOREIGN KEY ("user") REFERENCES profiles("user") ON DELETE CASCADE not valid;

alter table "public"."coupons" validate constraint "public_coupons_user_fkey";

alter table "public"."sponsors" add constraint "sponsors_value_key" UNIQUE using index "sponsors_value_key";

grant delete on table "public"."coupons" to "anon";

grant insert on table "public"."coupons" to "anon";

grant references on table "public"."coupons" to "anon";

grant select on table "public"."coupons" to "anon";

grant trigger on table "public"."coupons" to "anon";

grant truncate on table "public"."coupons" to "anon";

grant update on table "public"."coupons" to "anon";

grant delete on table "public"."coupons" to "authenticated";

grant insert on table "public"."coupons" to "authenticated";

grant references on table "public"."coupons" to "authenticated";

grant select on table "public"."coupons" to "authenticated";

grant trigger on table "public"."coupons" to "authenticated";

grant truncate on table "public"."coupons" to "authenticated";

grant update on table "public"."coupons" to "authenticated";

grant delete on table "public"."coupons" to "service_role";

grant insert on table "public"."coupons" to "service_role";

grant references on table "public"."coupons" to "service_role";

grant select on table "public"."coupons" to "service_role";

grant trigger on table "public"."coupons" to "service_role";

grant truncate on table "public"."coupons" to "service_role";

grant update on table "public"."coupons" to "service_role";

grant delete on table "public"."sponsors" to "anon";

grant insert on table "public"."sponsors" to "anon";

grant references on table "public"."sponsors" to "anon";

grant select on table "public"."sponsors" to "anon";

grant trigger on table "public"."sponsors" to "anon";

grant truncate on table "public"."sponsors" to "anon";

grant update on table "public"."sponsors" to "anon";

grant delete on table "public"."sponsors" to "authenticated";

grant insert on table "public"."sponsors" to "authenticated";

grant references on table "public"."sponsors" to "authenticated";

grant select on table "public"."sponsors" to "authenticated";

grant trigger on table "public"."sponsors" to "authenticated";

grant truncate on table "public"."sponsors" to "authenticated";

grant update on table "public"."sponsors" to "authenticated";

grant delete on table "public"."sponsors" to "service_role";

grant insert on table "public"."sponsors" to "service_role";

grant references on table "public"."sponsors" to "service_role";

grant select on table "public"."sponsors" to "service_role";

grant trigger on table "public"."sponsors" to "service_role";

grant truncate on table "public"."sponsors" to "service_role";

grant update on table "public"."sponsors" to "service_role";

create policy "Users can select their coupons"
on "public"."coupons"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = "user"));


create policy "Authenticated users can select"
on "public"."sponsors"
as permissive
for select
to authenticated
using (true);



