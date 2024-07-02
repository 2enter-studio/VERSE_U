create table "public"."block_users" (
    "id" uuid not null default gen_random_uuid(),
    "blocker" uuid not null default auth.uid(),
    "blocked" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."block_users" enable row level security;

create table "public"."report_messages" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "reporter" uuid not null default auth.uid(),
    "perpetrator" uuid not null,
    "content" text not null,
    "reason" text,
    "message" uuid not null
);


alter table "public"."report_messages" enable row level security;

CREATE UNIQUE INDEX block_users_id_key ON public.block_users USING btree (id);

CREATE UNIQUE INDEX block_users_pkey ON public.block_users USING btree (blocker, blocked);

CREATE UNIQUE INDEX report_messages_id_key ON public.report_messages USING btree (id);

CREATE UNIQUE INDEX report_messages_pkey ON public.report_messages USING btree (id);

alter table "public"."block_users" add constraint "block_users_pkey" PRIMARY KEY using index "block_users_pkey";

alter table "public"."report_messages" add constraint "report_messages_pkey" PRIMARY KEY using index "report_messages_pkey";

alter table "public"."block_users" add constraint "block_users_id_key" UNIQUE using index "block_users_id_key";

alter table "public"."block_users" add constraint "public_block_users_blocked_fkey" FOREIGN KEY (blocked) REFERENCES profiles("user") ON DELETE CASCADE not valid;

alter table "public"."block_users" validate constraint "public_block_users_blocked_fkey";

alter table "public"."block_users" add constraint "public_block_users_blocker_fkey" FOREIGN KEY (blocker) REFERENCES profiles("user") ON DELETE CASCADE not valid;

alter table "public"."block_users" validate constraint "public_block_users_blocker_fkey";

alter table "public"."report_messages" add constraint "public_report_messages_perpetrator_fkey" FOREIGN KEY (perpetrator) REFERENCES profiles("user") ON DELETE CASCADE not valid;

alter table "public"."report_messages" validate constraint "public_report_messages_perpetrator_fkey";

alter table "public"."report_messages" add constraint "public_report_messages_reporter_fkey" FOREIGN KEY (reporter) REFERENCES profiles("user") ON DELETE CASCADE not valid;

alter table "public"."report_messages" validate constraint "public_report_messages_reporter_fkey";

alter table "public"."report_messages" add constraint "report_messages_id_key" UNIQUE using index "report_messages_id_key";

grant delete on table "public"."block_users" to "anon";

grant insert on table "public"."block_users" to "anon";

grant references on table "public"."block_users" to "anon";

grant select on table "public"."block_users" to "anon";

grant trigger on table "public"."block_users" to "anon";

grant truncate on table "public"."block_users" to "anon";

grant update on table "public"."block_users" to "anon";

grant delete on table "public"."block_users" to "authenticated";

grant insert on table "public"."block_users" to "authenticated";

grant references on table "public"."block_users" to "authenticated";

grant select on table "public"."block_users" to "authenticated";

grant trigger on table "public"."block_users" to "authenticated";

grant truncate on table "public"."block_users" to "authenticated";

grant update on table "public"."block_users" to "authenticated";

grant delete on table "public"."block_users" to "service_role";

grant insert on table "public"."block_users" to "service_role";

grant references on table "public"."block_users" to "service_role";

grant select on table "public"."block_users" to "service_role";

grant trigger on table "public"."block_users" to "service_role";

grant truncate on table "public"."block_users" to "service_role";

grant update on table "public"."block_users" to "service_role";

grant delete on table "public"."report_messages" to "anon";

grant insert on table "public"."report_messages" to "anon";

grant references on table "public"."report_messages" to "anon";

grant select on table "public"."report_messages" to "anon";

grant trigger on table "public"."report_messages" to "anon";

grant truncate on table "public"."report_messages" to "anon";

grant update on table "public"."report_messages" to "anon";

grant delete on table "public"."report_messages" to "authenticated";

grant insert on table "public"."report_messages" to "authenticated";

grant references on table "public"."report_messages" to "authenticated";

grant select on table "public"."report_messages" to "authenticated";

grant trigger on table "public"."report_messages" to "authenticated";

grant truncate on table "public"."report_messages" to "authenticated";

grant update on table "public"."report_messages" to "authenticated";

grant delete on table "public"."report_messages" to "service_role";

grant insert on table "public"."report_messages" to "service_role";

grant references on table "public"."report_messages" to "service_role";

grant select on table "public"."report_messages" to "service_role";

grant trigger on table "public"."report_messages" to "service_role";

grant truncate on table "public"."report_messages" to "service_role";

grant update on table "public"."report_messages" to "service_role";


