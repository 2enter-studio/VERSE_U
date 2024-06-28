drop table if exists chat_messages_2024_06;

create table chat_messages_2024_06
	partition of chat_messages
  for values from ('2024-06-01 00:00:00+00') to ('2024-07-01 00:00:00+00');

alter table chat_messages_2024_06 enable row level security;
-- add a table to the publication
alter
  publication supabase_realtime add table chat_messages_2024_06;



create policy "Users can insert messages into their chats"
on chat_messages_2024_06
for insert
to authenticated
with check (
  is_chat_member(auth.uid(), chat)
);

create policy "Users can select messages of their chats"
on chat_messages_2024_06
for select
to authenticated
using (
  is_chat_member(auth.uid(), chat)
);
