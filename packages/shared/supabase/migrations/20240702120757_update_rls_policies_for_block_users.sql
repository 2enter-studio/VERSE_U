drop policy "Enable select for authenticated users only" on "public"."profiles";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.block_check(user_0 uuid, user_1 uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM blocked_users
        WHERE (user_0 = blocker AND user_1 = blocked) or
              (user_0 = blocked AND user_1 = blocker)
    );
END;$function$
;

create policy "Blockers can delete their own blocks"
on "public"."block_users"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = blocker));


create policy "Blockers can insert row for themselves"
on "public"."block_users"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = blocker));


create policy "Blockers can select their own rows"
on "public"."block_users"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = blocker));


create policy "Filter out blocked profiles"
on "public"."profiles"
as permissive
for select
to authenticated
using ((( SELECT block_check(( SELECT auth.uid() AS uid), profiles."user") AS block_check) = false));



