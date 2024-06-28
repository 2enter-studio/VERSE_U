drop policy "Enable read access for all users" on "public"."regions";

create policy "User can delete chat if he's one of it's members"
on "public"."chats"
as permissive
for delete
to authenticated
using (is_chat_member(auth.uid(), id));


create policy "Enable read for authenticated users only"
on "public"."regions"
as permissive
for select
to authenticated
using (true);



