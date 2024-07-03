alter table "public"."block_users" add constraint "cannot_block_self" CHECK ((blocker <> blocked)) not valid;

alter table "public"."block_users" validate constraint "cannot_block_self";


