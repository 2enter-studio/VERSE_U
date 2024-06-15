drop policy "Enable select for authenticated users only" on "public"."j-wearings-wearing_types";

revoke delete on table "public"."j-wearings-wearing_types" from "anon";

revoke insert on table "public"."j-wearings-wearing_types" from "anon";

revoke references on table "public"."j-wearings-wearing_types" from "anon";

revoke select on table "public"."j-wearings-wearing_types" from "anon";

revoke trigger on table "public"."j-wearings-wearing_types" from "anon";

revoke truncate on table "public"."j-wearings-wearing_types" from "anon";

revoke update on table "public"."j-wearings-wearing_types" from "anon";

revoke delete on table "public"."j-wearings-wearing_types" from "authenticated";

revoke insert on table "public"."j-wearings-wearing_types" from "authenticated";

revoke references on table "public"."j-wearings-wearing_types" from "authenticated";

revoke select on table "public"."j-wearings-wearing_types" from "authenticated";

revoke trigger on table "public"."j-wearings-wearing_types" from "authenticated";

revoke truncate on table "public"."j-wearings-wearing_types" from "authenticated";

revoke update on table "public"."j-wearings-wearing_types" from "authenticated";

revoke delete on table "public"."j-wearings-wearing_types" from "service_role";

revoke insert on table "public"."j-wearings-wearing_types" from "service_role";

revoke references on table "public"."j-wearings-wearing_types" from "service_role";

revoke select on table "public"."j-wearings-wearing_types" from "service_role";

revoke trigger on table "public"."j-wearings-wearing_types" from "service_role";

revoke truncate on table "public"."j-wearings-wearing_types" from "service_role";

revoke update on table "public"."j-wearings-wearing_types" from "service_role";

alter table "public"."j-wearings-wearing_types" drop constraint "j-wearings-wearing_types_id_key";

alter table "public"."j-wearings-wearing_types" drop constraint "public_j-wearings-wearing_types_base_fkey";

alter table "public"."j-wearings-wearing_types" drop constraint "public_j-wearings-wearing_types_related_fkey";

alter table "public"."j-wearings-wearing_types" drop constraint "j-wearings-wearing_types_pkey";

drop index if exists "public"."j-wearings-wearing_types_id_key";

drop index if exists "public"."j-wearings-wearing_types_pkey";

drop table "public"."j-wearings-wearing_types";


