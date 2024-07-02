drop policy "Filter out blocked profiles" on "public"."profiles";

create policy "Filter out blocked profiles"
on "public"."profiles"
as permissive
for select
to authenticated
using (((( SELECT block_check(( SELECT auth.uid() AS uid), profiles."user") AS block_check) = false) OR ("user" = ( SELECT auth.uid() AS uid))));



