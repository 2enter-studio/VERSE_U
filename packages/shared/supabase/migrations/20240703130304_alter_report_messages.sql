alter table "public"."report_messages" drop column "message";

alter table "public"."report_messages" add column "message_id" uuid not null;

alter table "public"."report_messages" add column "resolve" boolean not null default false;


