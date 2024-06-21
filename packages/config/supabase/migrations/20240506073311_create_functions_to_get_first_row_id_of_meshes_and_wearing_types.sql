
set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_first_mesh_id()
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN (
        SELECT id
        FROM meshes
        ORDER BY id ASC
        LIMIT 1
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_first_wearing_type_id()
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN (
        SELECT id
        FROM wearing_types
        ORDER BY id ASC
        LIMIT 1
    );
END;
$function$
;


alter table "public"."wearings" alter column "category" set default get_first_wearing_type_id();

alter table "public"."wearings" alter column "category" set not null;

alter table "public"."wearings" alter column "mesh" set default get_first_mesh_id();

alter table "public"."wearings" alter column "mesh" set not null;
