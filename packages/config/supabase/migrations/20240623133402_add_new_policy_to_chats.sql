drop policy "Users can see their own chats" on "public"."chats";

create policy "Users can see their own chats"
on "public"."chats"
as permissive
for select
to public
using (is_chat_member(auth.uid(), id));



