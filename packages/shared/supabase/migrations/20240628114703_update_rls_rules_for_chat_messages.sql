alter table "public"."trips" drop constraint "public_trips_from_fkey";

alter table "public"."trips" drop constraint "public_trips_next_0_fkey";

alter table "public"."trips" drop constraint "public_trips_next_1_fkey";

alter table "public"."trips" drop constraint "public_trips_to_fkey";

alter table "public"."trips" add constraint "public_trips_from_fkey" FOREIGN KEY ("from") REFERENCES regions(id) ON DELETE CASCADE not valid;

alter table "public"."trips" validate constraint "public_trips_from_fkey";

alter table "public"."trips" add constraint "public_trips_next_0_fkey" FOREIGN KEY (next_0) REFERENCES regions(id) ON DELETE CASCADE not valid;

alter table "public"."trips" validate constraint "public_trips_next_0_fkey";

alter table "public"."trips" add constraint "public_trips_next_1_fkey" FOREIGN KEY (next_1) REFERENCES regions(id) ON DELETE CASCADE not valid;

alter table "public"."trips" validate constraint "public_trips_next_1_fkey";

alter table "public"."trips" add constraint "public_trips_to_fkey" FOREIGN KEY ("to") REFERENCES regions(id) ON DELETE CASCADE not valid;

alter table "public"."trips" validate constraint "public_trips_to_fkey";

create policy "Users can insert messages into their chats"
on "public"."chat_messages"
as permissive
for insert
to authenticated
with check (is_chat_member(auth.uid(), chat));


create policy "Users can select messages of their chats"
on "public"."chat_messages"
as permissive
for select
to authenticated
using (is_chat_member(auth.uid(), chat));



