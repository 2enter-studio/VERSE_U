drop policy "Filter out blocked profiles" on "public"."profiles";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.block_check(user_0 uuid, user_1 uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM block_users
        WHERE (user_0 = blocker AND user_1 = blocked) or
              (user_0 = blocked AND user_1 = blocker)
    );
END;$function$
;

create policy "Filter out blocked profiles"
on "public"."profiles"
as permissive
for select
to authenticated
using ((( SELECT block_check(( SELECT auth.uid() AS uid), profiles."user") AS block_check) = false));



