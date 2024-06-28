drop table if exists chat_messages;

create table
  chat_messages (
    id uuid not null default gen_random_uuid(),
    created_at timestamptz not null default now(),
    sender uuid not null,
    chat uuid not null,
    content text not null,
    reply_to uuid null default null,
    primary key (id, created_at),
    foreign key (sender) references profiles ("user") on delete cascade,
    foreign key (chat) references chats (id) on delete cascade
  )
partition by
  range (created_at);

alter table chat_messages enable row level security;


drop table if exists chat_messages_2024_06;

create table chat_messages_2024_06
	partition of chat_messages
  for values from ('2024-05-01 00:00:00+00') to ('2024-06-01 00:00:00+00');

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
