drop policy "Users can see their own chats" on "public"."chats";
revoke update on table "public"."chat_members" from "authenticated";
alter table "public"."chat_members" drop constraint "public_j-chats-users_user_fkey";
alter table "public"."chat_members" drop constraint "public_r_chat_members_chat_fkey";
alter table "public"."chat_messages" add column "readed" boolean not null default false;
alter table "public"."chat_members" add constraint "public_chat_members_chat_fkey" FOREIGN KEY (chat) REFERENCES chats(id) not valid;
alter table "public"."chat_members" validate constraint "public_chat_members_chat_fkey";
alter table "public"."chat_members" add constraint "public_chat_members_user_fkey" FOREIGN KEY ("user") REFERENCES profiles("user") not valid;
alter table "public"."chat_members" validate constraint "public_chat_members_user_fkey";
set check_function_bodies = off;
CREATE OR REPLACE FUNCTION public.is_chat_member(_user_id uuid, _chat_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$SELECT EXISTS (
  SELECT 1
  FROM "chat_members" jcu
  WHERE jcu.chat = _chat_id
  AND jcu.user = _user_id
);$function$;
create policy "Allow users to update their own agree values"
on "public"."chat_members"
as permissive
for update
to authenticated
using ((auth.uid() = "user"));
create policy "Enable insert for authenticated users only"
on "public"."chat_members"
as permissive
for insert
to authenticated
with check ((is_chat_member(auth.uid(), chat) OR (auth.uid() = "user")));
create policy "Enable insert for authenticated users only"
on "public"."chats"
as permissive
for insert
to authenticated
with check (true);
create policy "Users can see their own chats"
on "public"."chats"
as permissive
for select
to public
using (true);
