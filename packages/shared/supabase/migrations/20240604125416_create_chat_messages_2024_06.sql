create table "public"."chat_messages_2024_06" partition of "public"."chat_messages" FOR VALUES FROM ('2024-06-01 00:00:00+00') TO ('2024-07-01 00:00:00+00');

-- CREATE UNIQUE INDEX chat_messages_2024_06_pkey ON public.chat_messages_2024_06 USING btree (id, created_at);

-- alter table "public"."chat_messages_2024_06" add constraint "chat_messages_2024_06_pkey" PRIMARY KEY using index "chat_messages_2024_06_pkey";

-- alter table "public"."chat_messages_2024_06" add constraint "chat_messages_chat_fkey" FOREIGN KEY (chat) REFERENCES chats(id) not valid;

-- alter table "public"."chat_messages_2024_06" validate constraint "chat_messages_chat_fkey";
 
-- alter table "public"."chat_messages_2024_06" add constraint "chat_messages_sender_fkey" FOREIGN KEY (sender) REFERENCES profiles("user") not valid;

-- alter table "public"."chat_messages_2024_06" validate constraint "chat_messages_sender_fkey";

grant delete on table "public"."chat_messages_2024_06" to "anon";

grant insert on table "public"."chat_messages_2024_06" to "anon";

grant references on table "public"."chat_messages_2024_06" to "anon";

grant select on table "public"."chat_messages_2024_06" to "anon";

grant trigger on table "public"."chat_messages_2024_06" to "anon";

grant truncate on table "public"."chat_messages_2024_06" to "anon";

grant update on table "public"."chat_messages_2024_06" to "anon";

grant delete on table "public"."chat_messages_2024_06" to "authenticated";

grant insert on table "public"."chat_messages_2024_06" to "authenticated";

grant references on table "public"."chat_messages_2024_06" to "authenticated";

grant select on table "public"."chat_messages_2024_06" to "authenticated";

grant trigger on table "public"."chat_messages_2024_06" to "authenticated";

grant truncate on table "public"."chat_messages_2024_06" to "authenticated";

grant update on table "public"."chat_messages_2024_06" to "authenticated";

grant delete on table "public"."chat_messages_2024_06" to "service_role";

grant insert on table "public"."chat_messages_2024_06" to "service_role";

grant references on table "public"."chat_messages_2024_06" to "service_role";

grant select on table "public"."chat_messages_2024_06" to "service_role";

grant trigger on table "public"."chat_messages_2024_06" to "service_role";

grant truncate on table "public"."chat_messages_2024_06" to "service_role";

grant update on table "public"."chat_messages_2024_06" to "service_role";

create policy "Users can insert messages into their chats"
on "public"."chat_messages_2024_06"
as permissive
for insert
to authenticated
with check (is_chat_member(auth.uid(), chat));

create policy "Users can select messages of their chats"
on "public"."chat_messages_2024_06"
as permissive
for select
to authenticated
using (is_chat_member(auth.uid(), chat));



