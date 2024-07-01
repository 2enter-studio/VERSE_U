drop table if exists chat_messages_2024_06;

create table chat_messages_2024_07
	partition of chat_messages
  for values from ('2024-07-01 00:00:00+00') to ('2024-08-01 00:00:00+00');

alter table chat_messages_2024_07 enable row level security;
-- add a table to the publication
alter
  publication supabase_realtime add table chat_messages_2024_07;

create policy "Users can insert messages into their chats"
on chat_messages_2024_07
for insert
to authenticated
with check (
  is_chat_member((select auth.uid()), chat)
);

create policy "Users can select messages of their chats"
on chat_messages_2024_07
for select
to authenticated
using (
  is_chat_member((select auth.uid()), chat)
);

create table chat_messages_2024_08
	partition of chat_messages
  for values from ('2024-08-01 00:00:00+00') to ('2024-09-01 00:00:00+00');

alter table chat_messages_2024_08 enable row level security;
-- add a table to the publication
alter
  publication supabase_realtime add table chat_messages_2024_08;

create policy "Users can insert messages into their chats"
on chat_messages_2024_08
for insert
to authenticated
with check (
  is_chat_member((select auth.uid()), chat)
);

create policy "Users can select messages of their chats"
on chat_messages_2024_08
for select
to authenticated
using (
  is_chat_member((select auth.uid()), chat)
);
