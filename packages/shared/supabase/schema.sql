
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

CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";

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

CREATE OR REPLACE FUNCTION "public"."agree_friendship"("chat_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  UPDATE public.chat_members 
  SET agree = true 
  WHERE "user" = auth.uid() AND chat = chat_id;
END;$$;

ALTER FUNCTION "public"."agree_friendship"("chat_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."archive_trip"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
    -- Insert the old trip data into the trips_archived table
    INSERT INTO trips_archived ("user", "from", "to", start_at, arrive_at)
    VALUES (OLD."user", OLD."from", OLD."to", OLD.start_at, OLD.arrive_at);

    -- Return NULL because we are not modifying the new row
    RETURN NEW;
END;$$;

ALTER FUNCTION "public"."archive_trip"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."archive_trips"("ids" "uuid"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$begin
  insert into trips_archived (id, "user", "from", "to", start_at, arrive_at)
  select id, "user", "from", "to", start_at, arrive_at from trips where id = any(ids);

  delete from trips where id = any(ids);
end;$$;

ALTER FUNCTION "public"."archive_trips"("ids" "uuid"[]) OWNER TO "postgres";

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

CREATE OR REPLACE FUNCTION "public"."get_first_mesh_id"() RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN (
        SELECT id
        FROM meshes
        ORDER BY id ASC
        LIMIT 1
    );
END;
$$;

ALTER FUNCTION "public"."get_first_mesh_id"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_first_wearing_type_id"() RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN (
        SELECT id
        FROM wearing_types
        ORDER BY id ASC
        LIMIT 1
    );
END;
$$;

ALTER FUNCTION "public"."get_first_wearing_type_id"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_chat_member"("_user_id" "uuid", "_chat_id" "uuid") RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    AS $$SELECT EXISTS (
  SELECT 1
  FROM "chat_members" jcu
  WHERE jcu.chat = _chat_id
  AND jcu.user = _user_id
);$$;

ALTER FUNCTION "public"."is_chat_member"("_user_id" "uuid", "_chat_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."start_new_chat"("target_user_id" "uuid", "first_message" "text") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$DECLARE 
  chat_id uuid; 
BEGIN 
  SELECT gen_random_uuid() into chat_id;

  INSERT INTO chats (id) VALUES (chat_id); 
  
  INSERT INTO chat_members (chat, "user", agree) VALUES 
    (chat_id, auth.uid(), false), 
    (chat_id, target_user_id, false); 
  
  INSERT INTO chat_messages (chat, sender, content) VALUES 
    (chat_id, auth.uid(), first_message); 
  
  RETURN chat_id; 
END;$$;

ALTER FUNCTION "public"."start_new_chat"("target_user_id" "uuid", "first_message" "text") OWNER TO "postgres";

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

CREATE TABLE IF NOT EXISTS "public"."app_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "value" "text" DEFAULT '0.0.0'::"text" NOT NULL
);

ALTER TABLE "public"."app_versions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."body_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "value" "text" NOT NULL
);

ALTER TABLE "public"."body_parts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chat_members" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chat" "uuid" NOT NULL,
    "user" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "agree" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."chat_members" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "chat" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "reply_to" "uuid"
)
PARTITION BY RANGE ("created_at");

ALTER TABLE "public"."chat_messages" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chat_messages_2024_06" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "chat" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "reply_to" "uuid"
);

ALTER TABLE "public"."chat_messages_2024_06" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chat_messages_2024_07" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "chat" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "reply_to" "uuid"
);

ALTER TABLE "public"."chat_messages_2024_07" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chat_messages_2024_08" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "chat" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "reply_to" "uuid"
);

ALTER TABLE "public"."chat_messages_2024_08" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chat_messages_2024_09" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "chat" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "reply_to" "uuid"
);

ALTER TABLE "public"."chat_messages_2024_09" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chat_messages_2024_10" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "chat" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "reply_to" "uuid"
);

ALTER TABLE "public"."chat_messages_2024_10" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chat_messages_2024_11" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "chat" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "reply_to" "uuid"
);

ALTER TABLE "public"."chat_messages_2024_16" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chats" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "is_group_chat" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."chats" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."hai_an_players" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "player" "uuid" DEFAULT "auth"."uid"() NOT NULL
);

ALTER TABLE "public"."hai_an_players" OWNER TO "postgres";

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

CREATE TABLE IF NOT EXISTS "public"."maintenance" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "start" timestamp with time zone DEFAULT "now"() NOT NULL,
    "end" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."maintenance" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."meshes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."meshes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."ml_texts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "value" "text",
    "row_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "locale" "public"."language" DEFAULT 'zh'::"public"."language" NOT NULL,
    "column_name" "text" NOT NULL
);

ALTER TABLE "public"."ml_texts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."owned_wearings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "owner" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "wearing" "uuid" NOT NULL,
    "equipped" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."owned_wearings" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "last_active" timestamp without time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "public_id" "text" DEFAULT "public"."gen_random_text"(8) NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user" "uuid" DEFAULT "auth"."uid"() NOT NULL
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

CREATE TABLE IF NOT EXISTS "public"."trips" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "start_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "arrive_at" timestamp with time zone NOT NULL,
    "from" "uuid" NOT NULL,
    "to" "uuid" NOT NULL,
    "next_0" "uuid" NOT NULL,
    "next_1" "uuid" NOT NULL,
    CONSTRAINT "trips_check" CHECK ((("to" IS DISTINCT FROM "next_0") AND ("to" IS DISTINCT FROM "next_1") AND ("next_0" IS DISTINCT FROM "next_1") AND ("from" IS DISTINCT FROM "to"))),
    CONSTRAINT "trips_check1" CHECK (("start_at" < "arrive_at"))
);

ALTER TABLE "public"."trips" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."trips_archived" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user" "uuid" NOT NULL,
    "from" "uuid" NOT NULL,
    "start_at" timestamp with time zone NOT NULL,
    "arrive_at" timestamp with time zone NOT NULL,
    "to" "uuid" NOT NULL
);

ALTER TABLE "public"."trips_archived" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."wearing_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "value" "text" DEFAULT "public"."gen_random_text"(5) NOT NULL,
    "is_expression" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."wearing_types" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."wearings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "mesh" "uuid" DEFAULT "public"."get_first_mesh_id"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "category" "uuid" DEFAULT "public"."get_first_wearing_type_id"() NOT NULL,
    "in_starter_pack" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."wearings" OWNER TO "postgres";

ALTER TABLE ONLY "public"."chat_messages" ATTACH PARTITION "public"."chat_messages_2024_06" FOR VALUES FROM ('2024-06-01 00:00:00+00') TO ('2024-07-01 00:00:00+00');

ALTER TABLE ONLY "public"."chat_messages" ATTACH PARTITION "public"."chat_messages_2024_07" FOR VALUES FROM ('2024-07-01 00:00:00+00') TO ('2024-08-01 00:00:00+00');

ALTER TABLE ONLY "public"."chat_messages" ATTACH PARTITION "public"."chat_messages_2024_08" FOR VALUES FROM ('2024-08-01 00:00:00+00') TO ('2024-09-01 00:00:00+00');

ALTER TABLE ONLY "public"."chat_messages" ATTACH PARTITION "public"."chat_messages_2024_09" FOR VALUES FROM ('2024-09-01 00:00:00+00') TO ('2024-10-01 00:00:00+00');

ALTER TABLE ONLY "public"."chat_messages" ATTACH PARTITION "public"."chat_messages_2024_10" FOR VALUES FROM ('2024-10-01 00:00:00+00') TO ('2024-11-01 00:00:00+00');

ALTER TABLE ONLY "public"."chat_messages" ATTACH PARTITION "public"."chat_messages_2024_11" FOR VALUES FROM ('2024-11-01 00:00:00+00') TO ('2024-12-01 00:00:00+00');

ALTER TABLE ONLY "public"."app_versions"
    ADD CONSTRAINT "app_updates_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."app_versions"
    ADD CONSTRAINT "app_updates_version_key" UNIQUE ("value");

ALTER TABLE ONLY "public"."app_versions"
    ADD CONSTRAINT "app_versions_pkey" PRIMARY KEY ("value");

ALTER TABLE ONLY "public"."body_parts"
    ADD CONSTRAINT "body_parts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."body_parts"
    ADD CONSTRAINT "body_parts_value_key" UNIQUE ("value");

ALTER TABLE ONLY "public"."chat_members"
    ADD CONSTRAINT "chat_members_pkey" PRIMARY KEY ("chat", "user");

ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id", "created_at");

ALTER TABLE ONLY "public"."chat_messages_2024_06"
    ADD CONSTRAINT "chat_messages_2024_06_pkey" PRIMARY KEY ("id", "created_at");

ALTER TABLE ONLY "public"."chat_messages_2024_07"
    ADD CONSTRAINT "chat_messages_2024_07_pkey" PRIMARY KEY ("id", "created_at");

ALTER TABLE ONLY "public"."chat_messages_2024_08"
    ADD CONSTRAINT "chat_messages_2024_08_pkey" PRIMARY KEY ("id", "created_at");

ALTER TABLE ONLY "public"."chat_messages_2024_09"
    ADD CONSTRAINT "chat_messages_2024_09_pkey" PRIMARY KEY ("id", "created_at");

ALTER TABLE ONLY "public"."chat_messages_2024_10"
    ADD CONSTRAINT "chat_messages_2024_10_pkey" PRIMARY KEY ("id", "created_at");

ALTER TABLE ONLY "public"."chat_messages_2024_11"
    ADD CONSTRAINT "chat_messages_2024_11_pkey" PRIMARY KEY ("id", "created_at");

ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."hai_an_players"
    ADD CONSTRAINT "hai_an_players_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."hai_an_players"
    ADD CONSTRAINT "hai_an_players_pkey" PRIMARY KEY ("player");

ALTER TABLE ONLY "public"."hai_an_players"
    ADD CONSTRAINT "hai_an_players_player_key" UNIQUE ("player");

ALTER TABLE ONLY "public"."j-users-tags"
    ADD CONSTRAINT "j-users-tags_pkey" PRIMARY KEY ("user", "tag");

ALTER TABLE ONLY "public"."j-wearings-body_parts"
    ADD CONSTRAINT "j-wearings-body_parts_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."j-wearings-body_parts"
    ADD CONSTRAINT "j-wearings-body_parts_pkey" PRIMARY KEY ("wearing", "body_part");

ALTER TABLE ONLY "public"."j-wearings-texture_types"
    ADD CONSTRAINT "j-wearings-texture_types_pkey" PRIMARY KEY ("wearing", "texture_type");

ALTER TABLE ONLY "public"."regions"
    ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."maintenance"
    ADD CONSTRAINT "maintenance_end_key" UNIQUE ("end");

ALTER TABLE ONLY "public"."maintenance"
    ADD CONSTRAINT "maintenance_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."maintenance"
    ADD CONSTRAINT "maintenance_start_key" UNIQUE ("start");

ALTER TABLE ONLY "public"."meshes"
    ADD CONSTRAINT "meshs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."ml_texts"
    ADD CONSTRAINT "ml-texts_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."ml_texts"
    ADD CONSTRAINT "ml_texts_pkey" PRIMARY KEY ("row_id", "locale", "column_name");

ALTER TABLE ONLY "public"."owned_wearings"
    ADD CONSTRAINT "owned_wearings_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."owned_wearings"
    ADD CONSTRAINT "owned_wearings_pkey" PRIMARY KEY ("wearing", "owner");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_public_id_key" UNIQUE ("public_id");

ALTER TABLE ONLY "public"."chat_members"
    ADD CONSTRAINT "r_chat_members_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."j-users-tags"
    ADD CONSTRAINT "r_user_tag_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."j-wearings-texture_types"
    ADD CONSTRAINT "r_wearing_texture_types_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."tag_types"
    ADD CONSTRAINT "tag_types_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."texture_types"
    ADD CONSTRAINT "texture_types_name_key" UNIQUE ("value");

ALTER TABLE ONLY "public"."texture_types"
    ADD CONSTRAINT "texture_types_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."trips_archived"
    ADD CONSTRAINT "trips_archived_pkey" PRIMARY KEY ("id", "user", "from", "to");

ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "trips_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "trips_pkey" PRIMARY KEY ("from", "to", "user");

ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "trips_user_key" UNIQUE ("user");

ALTER TABLE ONLY "public"."regions"
    ADD CONSTRAINT "unique_location" UNIQUE ("x", "y", "enabled");

ALTER TABLE ONLY "public"."wearing_types"
    ADD CONSTRAINT "wearing_types_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."wearing_types"
    ADD CONSTRAINT "wearing_types_value_key" UNIQUE ("value");

ALTER TABLE ONLY "public"."wearings"
    ADD CONSTRAINT "wearings_pkey" PRIMARY KEY ("id");

ALTER INDEX "public"."chat_messages_pkey" ATTACH PARTITION "public"."chat_messages_2024_06_pkey";

ALTER INDEX "public"."chat_messages_pkey" ATTACH PARTITION "public"."chat_messages_2024_07_pkey";

ALTER INDEX "public"."chat_messages_pkey" ATTACH PARTITION "public"."chat_messages_2024_08_pkey";

ALTER INDEX "public"."chat_messages_pkey" ATTACH PARTITION "public"."chat_messages_2024_09_pkey";

ALTER INDEX "public"."chat_messages_pkey" ATTACH PARTITION "public"."chat_messages_2024_10_pkey";

ALTER INDEX "public"."chat_messages_pkey" ATTACH PARTITION "public"."chat_messages_2024_11_pkey";

CREATE OR REPLACE TRIGGER "trigger_archive_trip" BEFORE UPDATE ON "public"."trips" FOR EACH ROW EXECUTE FUNCTION "public"."archive_trip"();

ALTER TABLE "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_chat_fkey" FOREIGN KEY ("chat") REFERENCES "public"."chats"("id") ON DELETE CASCADE;

ALTER TABLE "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "public"."profiles"("user") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."chat_members"
    ADD CONSTRAINT "public_chat_members_chat_fkey" FOREIGN KEY ("chat") REFERENCES "public"."chats"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."chat_members"
    ADD CONSTRAINT "public_chat_members_user_fkey" FOREIGN KEY ("user") REFERENCES "public"."profiles"("user") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."hai_an_players"
    ADD CONSTRAINT "public_hai_an_players_player_fkey" FOREIGN KEY ("player") REFERENCES "public"."profiles"("user") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."j-users-tags"
    ADD CONSTRAINT "public_j-users-tags_tag_fkey" FOREIGN KEY ("tag") REFERENCES "public"."tags"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."j-users-tags"
    ADD CONSTRAINT "public_j-users-tags_user_fkey" FOREIGN KEY ("user") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."j-wearings-body_parts"
    ADD CONSTRAINT "public_j-wearings-body_parts_base_fkey" FOREIGN KEY ("wearing") REFERENCES "public"."wearings"("id");

ALTER TABLE ONLY "public"."j-wearings-body_parts"
    ADD CONSTRAINT "public_j-wearings-body_parts_related_fkey" FOREIGN KEY ("body_part") REFERENCES "public"."body_parts"("id");

ALTER TABLE ONLY "public"."owned_wearings"
    ADD CONSTRAINT "public_owned_wearings_owner_fkey" FOREIGN KEY ("owner") REFERENCES "public"."profiles"("user") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."owned_wearings"
    ADD CONSTRAINT "public_owned_wearings_wearing_fkey" FOREIGN KEY ("wearing") REFERENCES "public"."wearings"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "public_profiles_user_fkey" FOREIGN KEY ("user") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."j-wearings-texture_types"
    ADD CONSTRAINT "public_r_wearing_texture_types_texture_type_fkey" FOREIGN KEY ("texture_type") REFERENCES "public"."texture_types"("id");

ALTER TABLE ONLY "public"."j-wearings-texture_types"
    ADD CONSTRAINT "public_r_wearing_texture_types_wearing_fkey" FOREIGN KEY ("wearing") REFERENCES "public"."wearings"("id");

ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "public_trips_from_fkey" FOREIGN KEY ("from") REFERENCES "public"."regions"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "public_trips_next_0_fkey" FOREIGN KEY ("next_0") REFERENCES "public"."regions"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "public_trips_next_1_fkey" FOREIGN KEY ("next_1") REFERENCES "public"."regions"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "public_trips_to_fkey" FOREIGN KEY ("to") REFERENCES "public"."regions"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "public_trips_user_fkey" FOREIGN KEY ("user") REFERENCES "public"."profiles"("user") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."wearings"
    ADD CONSTRAINT "public_wearings_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."wearing_types"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."wearings"
    ADD CONSTRAINT "public_wearings_mesh_fkey" FOREIGN KEY ("mesh") REFERENCES "public"."meshes"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."trips_archived"
    ADD CONSTRAINT "trips_archived_from_fkey" FOREIGN KEY ("from") REFERENCES "public"."regions"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."trips_archived"
    ADD CONSTRAINT "trips_archived_to_fkey" FOREIGN KEY ("to") REFERENCES "public"."regions"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."trips_archived"
    ADD CONSTRAINT "trips_archived_user_fkey" FOREIGN KEY ("user") REFERENCES "public"."profiles"("user") ON DELETE CASCADE;

CREATE POLICY "(temporarily) User can insert their own rows" ON "public"."owned_wearings" FOR INSERT TO "authenticated" WITH CHECK (( SELECT ("auth"."uid"() = "owned_wearings"."owner")));

CREATE POLICY "All authenticated users can select all wearings" ON "public"."wearings" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Allow users to update their own agree values" ON "public"."chat_members" FOR UPDATE TO "authenticated" USING (( SELECT ("auth"."uid"() = "chat_members"."user")));

CREATE POLICY "Authenticated user can insert their own trip" ON "public"."trips" FOR INSERT TO "authenticated" WITH CHECK (( SELECT ("auth"."uid"() = "trips"."user")));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."chat_members" FOR INSERT TO "authenticated" WITH CHECK (("public"."is_chat_member"("auth"."uid"(), "chat") OR ("auth"."uid"() = "user")));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."chats" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."app_versions" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."maintenance" FOR SELECT USING (true);

CREATE POLICY "Enable read for authenticated users only" ON "public"."regions" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."body_parts" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."j-wearings-body_parts" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."j-wearings-texture_types" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."ml_texts" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."texture_types" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."trips" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."wearing_types" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "User can check if they're in this table" ON "public"."hai_an_players" FOR SELECT TO "authenticated" USING (("player" = "auth"."uid"()));

CREATE POLICY "User can delete chat if he's one of it's members" ON "public"."chats" FOR DELETE TO "authenticated" USING ("public"."is_chat_member"("auth"."uid"(), "id"));

CREATE POLICY "User can update his own profile" ON "public"."profiles" FOR UPDATE USING (( SELECT ("auth"."uid"() = "profiles"."user")));

CREATE POLICY "User can update rows they own" ON "public"."owned_wearings" FOR UPDATE TO "authenticated" USING (( SELECT ("auth"."uid"() = "owned_wearings"."owner")));

CREATE POLICY "Users can insert messages into their chats" ON "public"."chat_messages" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can insert messages into their chats" ON "public"."chat_messages_2024_06" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can insert messages into their chats" ON "public"."chat_messages_2024_07" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can insert messages into their chats" ON "public"."chat_messages_2024_08" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can insert messages into their chats" ON "public"."chat_messages_2024_09" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can insert messages into their chats" ON "public"."chat_messages_2024_10" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can insert messages into their chats" ON "public"."chat_messages_2024_11" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can see their chat members" ON "public"."chat_members" FOR SELECT USING ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can see their own chats" ON "public"."chats" FOR SELECT USING ("public"."is_chat_member"("auth"."uid"(), "id"));

CREATE POLICY "Users can select messages of their chats" ON "public"."chat_messages" FOR SELECT TO "authenticated" USING ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can select messages of their chats" ON "public"."chat_messages_2024_06" FOR SELECT TO "authenticated" USING ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can select messages of their chats" ON "public"."chat_messages_2024_07" FOR SELECT TO "authenticated" USING ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can select messages of their chats" ON "public"."chat_messages_2024_08" FOR SELECT TO "authenticated" USING ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can select messages of their chats" ON "public"."chat_messages_2024_09" FOR SELECT TO "authenticated" USING ("public"."is_chat_member"("auth"."uid"(), "chat"));

CREATE POLICY "Users can select messages of their chats" ON "public"."chat_messages_2024_10" FOR SELECT TO "authenticated" USING ("public"."is_chat_member"("auth"."uid"(), "chat"));


CREATE POLICY "Users can select messages of their chats" ON "public"."chat_messages_2024_11" FOR SELECT TO "authenticated" USING ("public"."is_chat_member"("auth"."uid"(), "chat"));
CREATE POLICY "Users can select their wearings or every equipped wearings" ON "public"."owned_wearings" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "owner") OR ("equipped" = true)));

ALTER TABLE "public"."app_versions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."body_parts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chat_members" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chat_messages" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chat_messages_2024_06" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chat_messages_2024_07" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chat_messages_2024_08" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chat_messages_2024_09" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chat_messages_2024_10" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chat_messages_2024_11" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chats" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."hai_an_players" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."j-users-tags" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."j-wearings-body_parts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."j-wearings-texture_types" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."maintenance" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."meshes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."ml_texts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."owned_wearings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."regions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tag_types" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."texture_types" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."trips" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."trips_archived" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."wearing_types" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."wearings" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chat_messages_2024_06";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chat_messages_2024_07";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chat_messages_2024_08";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chat_messages_2024_09";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chat_messages_2024_10";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chat_messages_2024_11";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."trips";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."agree_friendship"("chat_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."agree_friendship"("chat_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."agree_friendship"("chat_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."archive_trip"() TO "anon";
GRANT ALL ON FUNCTION "public"."archive_trip"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."archive_trip"() TO "service_role";

GRANT ALL ON FUNCTION "public"."archive_trips"("ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."archive_trips"("ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."archive_trips"("ids" "uuid"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."gen_random_text"("length" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."gen_random_text"("length" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gen_random_text"("length" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_first_mesh_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_first_mesh_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_first_mesh_id"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_first_wearing_type_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_first_wearing_type_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_first_wearing_type_id"() TO "service_role";

GRANT ALL ON FUNCTION "public"."is_chat_member"("_user_id" "uuid", "_chat_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_chat_member"("_user_id" "uuid", "_chat_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_chat_member"("_user_id" "uuid", "_chat_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."start_new_chat"("target_user_id" "uuid", "first_message" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."start_new_chat"("target_user_id" "uuid", "first_message" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."start_new_chat"("target_user_id" "uuid", "first_message" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."update_last_active"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_last_active"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_last_active"("user_id" "uuid") TO "service_role";

GRANT ALL ON TABLE "public"."app_versions" TO "anon";
GRANT ALL ON TABLE "public"."app_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."app_versions" TO "service_role";

GRANT ALL ON TABLE "public"."body_parts" TO "anon";
GRANT ALL ON TABLE "public"."body_parts" TO "authenticated";
GRANT ALL ON TABLE "public"."body_parts" TO "service_role";

GRANT ALL ON TABLE "public"."chat_members" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE ON TABLE "public"."chat_members" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_members" TO "service_role";

GRANT ALL ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";

GRANT ALL ON TABLE "public"."chat_messages_2024_06" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages_2024_06" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages_2024_06" TO "service_role";

GRANT ALL ON TABLE "public"."chat_messages_2024_07" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages_2024_07" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages_2024_07" TO "service_role";

GRANT ALL ON TABLE "public"."chat_messages_2024_08" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages_2024_08" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages_2024_08" TO "service_role";

GRANT ALL ON TABLE "public"."chat_messages_2024_09" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages_2024_09" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages_2024_09" TO "service_role";

GRANT ALL ON TABLE "public"."chat_messages_2024_10" TO "anon";
GRANT ALL ON TABLE "public"."chats" TO "authenticated";
GRANT ALL ON TABLE "public"."chats" TO "service_role";

GRANT ALL ON TABLE "public"."chat_messages_2024_11" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages_2024_11" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages_2024_11" TO "service_role";

GRANT ALL ON TABLE "public"."hai_an_players" TO "anon";
GRANT ALL ON TABLE "public"."hai_an_players" TO "authenticated";
GRANT ALL ON TABLE "public"."hai_an_players" TO "service_role";

GRANT ALL ON TABLE "public"."j-users-tags" TO "anon";
GRANT ALL ON TABLE "public"."j-users-tags" TO "authenticated";
GRANT ALL ON TABLE "public"."j-users-tags" TO "service_role";

GRANT ALL ON TABLE "public"."j-wearings-body_parts" TO "anon";
GRANT ALL ON TABLE "public"."j-wearings-body_parts" TO "authenticated";
GRANT ALL ON TABLE "public"."j-wearings-body_parts" TO "service_role";

GRANT ALL ON TABLE "public"."j-wearings-texture_types" TO "anon";
GRANT ALL ON TABLE "public"."j-wearings-texture_types" TO "authenticated";
GRANT ALL ON TABLE "public"."j-wearings-texture_types" TO "service_role";

GRANT ALL ON TABLE "public"."maintenance" TO "anon";
GRANT ALL ON TABLE "public"."maintenance" TO "authenticated";
GRANT ALL ON TABLE "public"."maintenance" TO "service_role";

GRANT ALL ON TABLE "public"."meshes" TO "anon";
GRANT ALL ON TABLE "public"."meshes" TO "authenticated";
GRANT ALL ON TABLE "public"."meshes" TO "service_role";

GRANT ALL ON TABLE "public"."ml_texts" TO "anon";
GRANT ALL ON TABLE "public"."ml_texts" TO "authenticated";
GRANT ALL ON TABLE "public"."ml_texts" TO "service_role";

GRANT ALL ON TABLE "public"."owned_wearings" TO "anon";
GRANT ALL ON TABLE "public"."owned_wearings" TO "authenticated";
GRANT ALL ON TABLE "public"."owned_wearings" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."regions" TO "anon";
GRANT ALL ON TABLE "public"."regions" TO "authenticated";
GRANT ALL ON TABLE "public"."regions" TO "service_role";

GRANT ALL ON TABLE "public"."tag_types" TO "anon";
GRANT ALL ON TABLE "public"."tag_types" TO "authenticated";
GRANT ALL ON TABLE "public"."tag_types" TO "service_role";

GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";

GRANT ALL ON TABLE "public"."texture_types" TO "anon";
GRANT ALL ON TABLE "public"."texture_types" TO "authenticated";
GRANT ALL ON TABLE "public"."texture_types" TO "service_role";

GRANT ALL ON TABLE "public"."trips" TO "anon";
GRANT ALL ON TABLE "public"."trips" TO "authenticated";
GRANT ALL ON TABLE "public"."trips" TO "service_role";

GRANT ALL ON TABLE "public"."trips_archived" TO "anon";
GRANT ALL ON TABLE "public"."trips_archived" TO "authenticated";
GRANT ALL ON TABLE "public"."trips_archived" TO "service_role";

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
