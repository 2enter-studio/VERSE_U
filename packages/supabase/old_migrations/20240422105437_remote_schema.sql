SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";
COMMENT ON SCHEMA "public" IS 'standard public schema';
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
CREATE TYPE "public"."language" AS ENUM (
    'zh',
    'en'
);
ALTER TYPE "public"."language" OWNER TO "postgres";
CREATE OR REPLACE FUNCTION "public"."gen_random_text"("length" integer) RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INT := 0;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, (random() * 36)::int + 1, 1);
  END LOOP;
  RETURN result;
END;$$;
ALTER FUNCTION "public"."gen_random_text"("length" integer) OWNER TO "postgres";
CREATE OR REPLACE FUNCTION "public"."is_chat_member"("_user_id" "uuid", "_chat_id" "uuid") RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    AS $$SELECT EXISTS (
  SELECT 1
  FROM "j-chats-users" jcu
  WHERE jcu.chat = _chat_id
  AND jcu.user = _user_id
);$$;
ALTER FUNCTION "public"."is_chat_member"("_user_id" "uuid", "_chat_id" "uuid") OWNER TO "postgres";
CREATE OR REPLACE FUNCTION "public"."update_last_active"("user_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$declare
  profile_id uuid;
begin
  update profiles
  set last_active = now()
  where profiles.user = user_id
  returning id into profile_id;
  
  return profile_id;
end;$$;
ALTER FUNCTION "public"."update_last_active"("user_id" "uuid") OWNER TO "postgres";
SET default_tablespace = '';
SET default_table_access_method = "heap";
CREATE TABLE IF NOT EXISTS "public"."avatars" (
    "user" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);
ALTER TABLE "public"."avatars" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."body_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "value" "text" NOT NULL
);
ALTER TABLE "public"."body_parts" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender" "uuid" NOT NULL,
    "chat" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "reply_to" "uuid"
)
PARTITION BY RANGE ("created_at");
ALTER TABLE "public"."chat_messages" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."chat_messages_2024_04" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender" "uuid" NOT NULL,
    "chat" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "reply_to" "uuid"
);
ALTER TABLE "public"."chat_messages_2024_04" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."chats" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "is_group_chat" boolean DEFAULT false NOT NULL
);
ALTER TABLE "public"."chats" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."j-avatars-stickers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "avatar" "uuid" NOT NULL,
    "sticker" "uuid" NOT NULL
);
ALTER TABLE "public"."j-avatars-stickers" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."j-avatars-wearings" (
    "avatar" "uuid" NOT NULL,
    "wearing" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."j-avatars-wearings" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."j-chats-users" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chat" "uuid" NOT NULL,
    "user" "uuid" NOT NULL
);
ALTER TABLE "public"."j-chats-users" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."j-users-tags" (
    "user" "uuid" NOT NULL,
    "tag" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."j-users-tags" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."j-wearings-body_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "wearing" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "body_part" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);
ALTER TABLE "public"."j-wearings-body_parts" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."j-wearings-texture_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "wearing" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "texture_type" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."j-wearings-texture_types" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."j-wearings-wearing_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "wearing" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "wearing_type" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);
ALTER TABLE "public"."j-wearings-wearing_types" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."meshes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."meshes" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."messages" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chat" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sender" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content" "text" NOT NULL
);
ALTER TABLE "public"."messages" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."ml_texts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "value" "text",
    "row_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "locale" "public"."language" DEFAULT 'zh'::"public"."language" NOT NULL,
    "column_name" "text" NOT NULL
);
ALTER TABLE "public"."ml_texts" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "last_active" timestamp without time zone DEFAULT "now"() NOT NULL,
    "coins" bigint DEFAULT '0'::bigint NOT NULL,
    "exp" bigint DEFAULT '0'::bigint NOT NULL,
    "name" "text" NOT NULL,
    "public_id" "text" DEFAULT "public"."gen_random_text"(8) NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);
ALTER TABLE "public"."profiles" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."regions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "x" double precision DEFAULT '0'::double precision NOT NULL,
    "y" double precision DEFAULT '0'::double precision NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "enabled" boolean DEFAULT true NOT NULL
);
ALTER TABLE "public"."regions" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."sticker" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."sticker" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."tag_types" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);
ALTER TABLE "public"."tag_types" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL
);
ALTER TABLE "public"."tags" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."texture_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "value" "text" NOT NULL
);
ALTER TABLE "public"."texture_types" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."wearing_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "value" "text" NOT NULL
);
ALTER TABLE "public"."wearing_types" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."wearings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "mesh" "uuid" DEFAULT '8c2110f1-7631-466a-8446-6b54f3db4793'::"uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."wearings" OWNER TO "postgres";
ALTER TABLE ONLY "public"."chat_messages" ATTACH PARTITION "public"."chat_messages_2024_04" FOR VALUES FROM ('2024-04-01 00:00:00+00') TO ('2024-05-01 00:00:00+00');
ALTER TABLE ONLY "public"."avatars"
    ADD CONSTRAINT "avatars_id_key" UNIQUE ("id");
ALTER TABLE ONLY "public"."avatars"
    ADD CONSTRAINT "avatars_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."body_parts"
    ADD CONSTRAINT "body_parts_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."body_parts"
    ADD CONSTRAINT "body_parts_value_key" UNIQUE ("value");
ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id", "created_at");
ALTER TABLE ONLY "public"."chat_messages_2024_04"
    ADD CONSTRAINT "chat_messages_2024_04_pkey" PRIMARY KEY ("id", "created_at");
ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."j-avatars-stickers"
    ADD CONSTRAINT "j-avatars-stickers_pkey" PRIMARY KEY ("avatar", "sticker");
ALTER TABLE ONLY "public"."j-avatars-wearings"
    ADD CONSTRAINT "j-avatars-wearings_pkey" PRIMARY KEY ("avatar", "wearing");
ALTER TABLE ONLY "public"."j-chats-users"
    ADD CONSTRAINT "j-chats-users_pkey" PRIMARY KEY ("chat", "user");
ALTER TABLE ONLY "public"."j-users-tags"
    ADD CONSTRAINT "j-users-tags_pkey" PRIMARY KEY ("user", "tag");
ALTER TABLE ONLY "public"."j-wearings-body_parts"
    ADD CONSTRAINT "j-wearings-body_parts_id_key" UNIQUE ("id");
ALTER TABLE ONLY "public"."j-wearings-body_parts"
    ADD CONSTRAINT "j-wearings-body_parts_pkey" PRIMARY KEY ("wearing", "body_part");
ALTER TABLE ONLY "public"."j-wearings-texture_types"
    ADD CONSTRAINT "j-wearings-texture_types_pkey" PRIMARY KEY ("wearing", "texture_type");
ALTER TABLE ONLY "public"."j-wearings-wearing_types"
    ADD CONSTRAINT "j-wearings-wearing_types_id_key" UNIQUE ("id");
ALTER TABLE ONLY "public"."j-wearings-wearing_types"
    ADD CONSTRAINT "j-wearings-wearing_types_pkey" PRIMARY KEY ("wearing", "wearing_type");
ALTER TABLE ONLY "public"."regions"
    ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."meshes"
    ADD CONSTRAINT "meshs_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."ml_texts"
    ADD CONSTRAINT "ml-texts_id_key" UNIQUE ("id");
ALTER TABLE ONLY "public"."ml_texts"
    ADD CONSTRAINT "ml_texts_pkey" PRIMARY KEY ("row_id", "locale", "column_name");
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_key" UNIQUE ("id");
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user");
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_public_id_key" UNIQUE ("public_id");
ALTER TABLE ONLY "public"."j-avatars-stickers"
    ADD CONSTRAINT "r_avatar_sticker_id_key" UNIQUE ("id");
ALTER TABLE ONLY "public"."j-avatars-wearings"
    ADD CONSTRAINT "r_avatar_wearing_id_key" UNIQUE ("id");
ALTER TABLE ONLY "public"."j-chats-users"
    ADD CONSTRAINT "r_chat_members_id_key" UNIQUE ("id");
ALTER TABLE ONLY "public"."j-users-tags"
    ADD CONSTRAINT "r_user_tag_id_key" UNIQUE ("id");
ALTER TABLE ONLY "public"."j-wearings-texture_types"
    ADD CONSTRAINT "r_wearing_texture_types_id_key" UNIQUE ("id");
ALTER TABLE ONLY "public"."sticker"
    ADD CONSTRAINT "sticker_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."tag_types"
    ADD CONSTRAINT "tag_types_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."texture_types"
    ADD CONSTRAINT "texture_types_name_key" UNIQUE ("value");
ALTER TABLE ONLY "public"."texture_types"
    ADD CONSTRAINT "texture_types_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."wearing_types"
    ADD CONSTRAINT "wearing_types_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."wearing_types"
    ADD CONSTRAINT "wearing_types_value_key" UNIQUE ("value");
ALTER TABLE ONLY "public"."wearings"
    ADD CONSTRAINT "wearings_pkey" PRIMARY KEY ("id");
ALTER INDEX "public"."chat_messages_pkey" ATTACH PARTITION "public"."chat_messages_2024_04_pkey";
ALTER TABLE "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_chat_fkey" FOREIGN KEY ("chat") REFERENCES "public"."chats"("id");
ALTER TABLE "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "public"."profiles"("user");
ALTER TABLE ONLY "public"."avatars"
    ADD CONSTRAINT "public_avatars_user_fkey" FOREIGN KEY ("user") REFERENCES "auth"."users"("id");
ALTER TABLE ONLY "public"."j-chats-users"
    ADD CONSTRAINT "public_j-chats-users_user_fkey" FOREIGN KEY ("user") REFERENCES "public"."profiles"("user");
ALTER TABLE ONLY "public"."j-wearings-body_parts"
    ADD CONSTRAINT "public_j-wearings-body_parts_base_fkey" FOREIGN KEY ("wearing") REFERENCES "public"."wearings"("id");
ALTER TABLE ONLY "public"."j-wearings-body_parts"
    ADD CONSTRAINT "public_j-wearings-body_parts_related_fkey" FOREIGN KEY ("body_part") REFERENCES "public"."body_parts"("id");
ALTER TABLE ONLY "public"."j-wearings-wearing_types"
    ADD CONSTRAINT "public_j-wearings-wearing_types_base_fkey" FOREIGN KEY ("wearing") REFERENCES "public"."wearings"("id");
ALTER TABLE ONLY "public"."j-wearings-wearing_types"
    ADD CONSTRAINT "public_j-wearings-wearing_types_related_fkey" FOREIGN KEY ("wearing_type") REFERENCES "public"."wearing_types"("id");
ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "public_messages_chat_fkey" FOREIGN KEY ("chat") REFERENCES "public"."chats"("id");
ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "public_messages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "auth"."users"("id");
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "public_profiles_user_fkey" FOREIGN KEY ("user") REFERENCES "auth"."users"("id");
ALTER TABLE ONLY "public"."j-avatars-wearings"
    ADD CONSTRAINT "public_r-avatar-wearing_avatar_fkey" FOREIGN KEY ("avatar") REFERENCES "public"."avatars"("id");
ALTER TABLE ONLY "public"."j-avatars-wearings"
    ADD CONSTRAINT "public_r-avatar-wearing_wearing_fkey" FOREIGN KEY ("wearing") REFERENCES "public"."wearings"("id");
ALTER TABLE ONLY "public"."j-avatars-stickers"
    ADD CONSTRAINT "public_r_avatar_sticker_avatar_fkey" FOREIGN KEY ("avatar") REFERENCES "public"."avatars"("id");
ALTER TABLE ONLY "public"."j-avatars-stickers"
    ADD CONSTRAINT "public_r_avatar_sticker_sticker_fkey" FOREIGN KEY ("sticker") REFERENCES "public"."sticker"("id");
ALTER TABLE ONLY "public"."j-chats-users"
    ADD CONSTRAINT "public_r_chat_members_chat_fkey" FOREIGN KEY ("chat") REFERENCES "public"."chats"("id");
ALTER TABLE ONLY "public"."j-wearings-texture_types"
    ADD CONSTRAINT "public_r_wearing_texture_types_texture_type_fkey" FOREIGN KEY ("texture_type") REFERENCES "public"."texture_types"("id");
ALTER TABLE ONLY "public"."j-wearings-texture_types"
    ADD CONSTRAINT "public_r_wearing_texture_types_wearing_fkey" FOREIGN KEY ("wearing") REFERENCES "public"."wearings"("id");
ALTER TABLE ONLY "public"."wearings"
    ADD CONSTRAINT "public_wearings_mesh_fkey" FOREIGN KEY ("mesh") REFERENCES "public"."meshes"("id") ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."j-users-tags"
    ADD CONSTRAINT "user_tags_tag_id_fkey" FOREIGN KEY ("tag") REFERENCES "public"."tags"("id");
ALTER TABLE ONLY "public"."j-users-tags"
    ADD CONSTRAINT "user_tags_user_id_fkey" FOREIGN KEY ("user") REFERENCES "auth"."users"("id");
CREATE POLICY "Enable insert for authenticated users only" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (true);
CREATE POLICY "Enable select for authenticated users only" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);
CREATE POLICY "User can select messages if he's chat member" ON "public"."chat_messages" TO "authenticated" USING ("public"."is_chat_member"("auth"."uid"(), "chat"));
CREATE POLICY "User can select messages if he's chat member" ON "public"."messages" FOR SELECT TO "authenticated" USING ("public"."is_chat_member"("auth"."uid"(), "chat"));
CREATE POLICY "User can update his own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "user"));
CREATE POLICY "Users can insert messages into their chats" ON "public"."chat_messages" TO "authenticated" WITH CHECK ("public"."is_chat_member"("auth"."uid"(), "chat"));
CREATE POLICY "Users can insert messages into their chats" ON "public"."chat_messages_2024_04" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_chat_member"("auth"."uid"(), "chat"));
CREATE POLICY "Users can insert messages into their chats" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_chat_member"("auth"."uid"(), "chat"));
CREATE POLICY "Users can see their chat members" ON "public"."j-chats-users" FOR SELECT USING ("public"."is_chat_member"("auth"."uid"(), "chat"));
CREATE POLICY "Users can see their own chats" ON "public"."chats" FOR SELECT USING ("public"."is_chat_member"("auth"."uid"(), "id"));
CREATE POLICY "Users can select messages of their chats" ON "public"."chat_messages_2024_04" FOR SELECT TO "authenticated" USING ("public"."is_chat_member"("auth"."uid"(), "chat"));
ALTER TABLE "public"."avatars" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."body_parts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."chat_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."chat_messages_2024_04" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."chats" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."j-avatars-stickers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."j-avatars-wearings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."j-chats-users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."j-users-tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."j-wearings-body_parts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."j-wearings-texture_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."j-wearings-wearing_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."meshes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ml_texts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."regions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sticker" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tag_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."texture_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."wearing_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."wearings" ENABLE ROW LEVEL SECURITY;
ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";
ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chat_messages_2024_04";
ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."messages";
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT ALL ON FUNCTION "public"."gen_random_text"("length" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."gen_random_text"("length" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gen_random_text"("length" integer) TO "service_role";
GRANT ALL ON FUNCTION "public"."is_chat_member"("_user_id" "uuid", "_chat_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_chat_member"("_user_id" "uuid", "_chat_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_chat_member"("_user_id" "uuid", "_chat_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."update_last_active"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_last_active"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_last_active"("user_id" "uuid") TO "service_role";
GRANT ALL ON TABLE "public"."avatars" TO "anon";
GRANT ALL ON TABLE "public"."avatars" TO "authenticated";
GRANT ALL ON TABLE "public"."avatars" TO "service_role";
GRANT ALL ON TABLE "public"."body_parts" TO "anon";
GRANT ALL ON TABLE "public"."body_parts" TO "authenticated";
GRANT ALL ON TABLE "public"."body_parts" TO "service_role";
GRANT ALL ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";
GRANT ALL ON TABLE "public"."chat_messages_2024_04" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages_2024_04" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages_2024_04" TO "service_role";
GRANT ALL ON TABLE "public"."chats" TO "anon";
GRANT ALL ON TABLE "public"."chats" TO "authenticated";
GRANT ALL ON TABLE "public"."chats" TO "service_role";
GRANT ALL ON TABLE "public"."j-avatars-stickers" TO "anon";
GRANT ALL ON TABLE "public"."j-avatars-stickers" TO "authenticated";
GRANT ALL ON TABLE "public"."j-avatars-stickers" TO "service_role";
GRANT ALL ON TABLE "public"."j-avatars-wearings" TO "anon";
GRANT ALL ON TABLE "public"."j-avatars-wearings" TO "authenticated";
GRANT ALL ON TABLE "public"."j-avatars-wearings" TO "service_role";
GRANT ALL ON TABLE "public"."j-chats-users" TO "anon";
GRANT ALL ON TABLE "public"."j-chats-users" TO "authenticated";
GRANT ALL ON TABLE "public"."j-chats-users" TO "service_role";
GRANT ALL ON TABLE "public"."j-users-tags" TO "anon";
GRANT ALL ON TABLE "public"."j-users-tags" TO "authenticated";
GRANT ALL ON TABLE "public"."j-users-tags" TO "service_role";
GRANT ALL ON TABLE "public"."j-wearings-body_parts" TO "anon";
GRANT ALL ON TABLE "public"."j-wearings-body_parts" TO "authenticated";
GRANT ALL ON TABLE "public"."j-wearings-body_parts" TO "service_role";
GRANT ALL ON TABLE "public"."j-wearings-texture_types" TO "anon";
GRANT ALL ON TABLE "public"."j-wearings-texture_types" TO "authenticated";
GRANT ALL ON TABLE "public"."j-wearings-texture_types" TO "service_role";
GRANT ALL ON TABLE "public"."j-wearings-wearing_types" TO "anon";
GRANT ALL ON TABLE "public"."j-wearings-wearing_types" TO "authenticated";
GRANT ALL ON TABLE "public"."j-wearings-wearing_types" TO "service_role";
GRANT ALL ON TABLE "public"."meshes" TO "anon";
GRANT ALL ON TABLE "public"."meshes" TO "authenticated";
GRANT ALL ON TABLE "public"."meshes" TO "service_role";
GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";
GRANT ALL ON TABLE "public"."ml_texts" TO "anon";
GRANT ALL ON TABLE "public"."ml_texts" TO "authenticated";
GRANT ALL ON TABLE "public"."ml_texts" TO "service_role";
GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";
GRANT ALL ON TABLE "public"."regions" TO "anon";
GRANT ALL ON TABLE "public"."regions" TO "authenticated";
GRANT ALL ON TABLE "public"."regions" TO "service_role";
GRANT ALL ON TABLE "public"."sticker" TO "anon";
GRANT ALL ON TABLE "public"."sticker" TO "authenticated";
GRANT ALL ON TABLE "public"."sticker" TO "service_role";
GRANT ALL ON TABLE "public"."tag_types" TO "anon";
GRANT ALL ON TABLE "public"."tag_types" TO "authenticated";
GRANT ALL ON TABLE "public"."tag_types" TO "service_role";
GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";
GRANT ALL ON TABLE "public"."texture_types" TO "anon";
GRANT ALL ON TABLE "public"."texture_types" TO "authenticated";
GRANT ALL ON TABLE "public"."texture_types" TO "service_role";
GRANT ALL ON TABLE "public"."wearing_types" TO "anon";
GRANT ALL ON TABLE "public"."wearing_types" TO "authenticated";
GRANT ALL ON TABLE "public"."wearing_types" TO "service_role";
GRANT ALL ON TABLE "public"."wearings" TO "anon";
GRANT ALL ON TABLE "public"."wearings" TO "authenticated";
GRANT ALL ON TABLE "public"."wearings" TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";
RESET ALL;
