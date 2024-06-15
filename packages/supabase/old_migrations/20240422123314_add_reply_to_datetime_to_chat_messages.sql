alter table "public"."chat_messages" add column "reply_to_datetime" timestamp with time zone;
alter table "public"."trips" enable row level security;
