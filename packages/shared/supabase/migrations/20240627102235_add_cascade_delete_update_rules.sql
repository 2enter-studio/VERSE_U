revoke delete on table "public"."stickers" from "anon";

revoke insert on table "public"."stickers" from "anon";

revoke references on table "public"."stickers" from "anon";

revoke select on table "public"."stickers" from "anon";

revoke trigger on table "public"."stickers" from "anon";

revoke truncate on table "public"."stickers" from "anon";

revoke update on table "public"."stickers" from "anon";

revoke delete on table "public"."stickers" from "authenticated";

revoke insert on table "public"."stickers" from "authenticated";

revoke references on table "public"."stickers" from "authenticated";

revoke select on table "public"."stickers" from "authenticated";

revoke trigger on table "public"."stickers" from "authenticated";

revoke truncate on table "public"."stickers" from "authenticated";

revoke update on table "public"."stickers" from "authenticated";

revoke delete on table "public"."stickers" from "service_role";

revoke insert on table "public"."stickers" from "service_role";

revoke references on table "public"."stickers" from "service_role";

revoke select on table "public"."stickers" from "service_role";

revoke trigger on table "public"."stickers" from "service_role";

revoke truncate on table "public"."stickers" from "service_role";

revoke update on table "public"."stickers" from "service_role";

alter table "public"."j-users-tags" drop constraint "user_tags_tag_id_fkey";

alter table "public"."j-users-tags" drop constraint "user_tags_user_id_fkey";

alter table "public"."owned_wearings" drop constraint "owned_wearings_owner_fkey";

alter table "public"."owned_wearings" drop constraint "owned_wearings_wearing_fkey";

alter table "public"."trips" drop constraint "trips_destination_fkey";

alter table "public"."trips" drop constraint "trips_next_0_fkey";

alter table "public"."trips" drop constraint "trips_next_1_fkey";

alter table "public"."trips" drop constraint "trips_user_fkey";

alter table "public"."wearings" drop constraint "wearings_category_fkey";

alter table "public"."chat_members" drop constraint "public_chat_members_chat_fkey";

alter table "public"."chat_members" drop constraint "public_chat_members_user_fkey";

alter table "public"."hai_an_players" drop constraint "public_hai_an_players_player_fkey";

alter table "public"."profiles" drop constraint "public_profiles_user_fkey";

alter table "public"."trips" drop constraint "public_trips_to_fkey";

alter table "public"."wearings" drop constraint "public_wearings_mesh_fkey";

alter table "public"."stickers" drop constraint "sticker_pkey";

alter table "public"."trips" drop constraint "trips_pkey";

drop index if exists "public"."sticker_pkey";

drop index if exists "public"."trips_pkey";

drop table "public"."stickers";

CREATE UNIQUE INDEX trips_pkey ON public.trips USING btree ("from", "to", "user");

alter table "public"."trips" add constraint "trips_pkey" PRIMARY KEY using index "trips_pkey";

alter table "public"."j-users-tags" add constraint "public_j-users-tags_tag_fkey" FOREIGN KEY (tag) REFERENCES tags(id) ON DELETE CASCADE not valid;

alter table "public"."j-users-tags" validate constraint "public_j-users-tags_tag_fkey";

alter table "public"."j-users-tags" add constraint "public_j-users-tags_user_fkey" FOREIGN KEY ("user") REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."j-users-tags" validate constraint "public_j-users-tags_user_fkey";

alter table "public"."owned_wearings" add constraint "public_owned_wearings_owner_fkey" FOREIGN KEY (owner) REFERENCES profiles("user") ON UPDATE CASCADE not valid;

alter table "public"."owned_wearings" validate constraint "public_owned_wearings_owner_fkey";

alter table "public"."owned_wearings" add constraint "public_owned_wearings_wearing_fkey" FOREIGN KEY (wearing) REFERENCES wearings(id) ON UPDATE CASCADE not valid;

alter table "public"."owned_wearings" validate constraint "public_owned_wearings_wearing_fkey";

alter table "public"."trips" add constraint "public_trips_from_fkey" FOREIGN KEY ("from") REFERENCES regions(id) ON UPDATE CASCADE not valid;

alter table "public"."trips" validate constraint "public_trips_from_fkey";

alter table "public"."trips" add constraint "public_trips_next_0_fkey" FOREIGN KEY (next_0) REFERENCES regions(id) ON UPDATE CASCADE not valid;

alter table "public"."trips" validate constraint "public_trips_next_0_fkey";

alter table "public"."trips" add constraint "public_trips_next_1_fkey" FOREIGN KEY (next_1) REFERENCES regions(id) ON UPDATE CASCADE not valid;

alter table "public"."trips" validate constraint "public_trips_next_1_fkey";

alter table "public"."trips" add constraint "public_trips_user_fkey" FOREIGN KEY ("user") REFERENCES profiles("user") ON DELETE CASCADE not valid;

alter table "public"."trips" validate constraint "public_trips_user_fkey";

alter table "public"."wearings" add constraint "public_wearings_category_fkey" FOREIGN KEY (category) REFERENCES wearing_types(id) ON DELETE CASCADE not valid;

alter table "public"."wearings" validate constraint "public_wearings_category_fkey";

alter table "public"."chat_members" add constraint "public_chat_members_chat_fkey" FOREIGN KEY (chat) REFERENCES chats(id) ON DELETE CASCADE not valid;

alter table "public"."chat_members" validate constraint "public_chat_members_chat_fkey";

alter table "public"."chat_members" add constraint "public_chat_members_user_fkey" FOREIGN KEY ("user") REFERENCES profiles("user") ON DELETE CASCADE not valid;

alter table "public"."chat_members" validate constraint "public_chat_members_user_fkey";

alter table "public"."hai_an_players" add constraint "public_hai_an_players_player_fkey" FOREIGN KEY (player) REFERENCES profiles("user") ON DELETE CASCADE not valid;

alter table "public"."hai_an_players" validate constraint "public_hai_an_players_player_fkey";

alter table "public"."profiles" add constraint "public_profiles_user_fkey" FOREIGN KEY ("user") REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "public_profiles_user_fkey";

alter table "public"."trips" add constraint "public_trips_to_fkey" FOREIGN KEY ("to") REFERENCES regions(id) ON UPDATE CASCADE not valid;

alter table "public"."trips" validate constraint "public_trips_to_fkey";

alter table "public"."wearings" add constraint "public_wearings_mesh_fkey" FOREIGN KEY (mesh) REFERENCES meshes(id) ON DELETE CASCADE not valid;

alter table "public"."wearings" validate constraint "public_wearings_mesh_fkey";


