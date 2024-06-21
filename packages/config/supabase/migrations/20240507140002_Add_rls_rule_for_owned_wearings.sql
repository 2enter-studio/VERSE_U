create policy "User can update rows they own"
on "public"."owned_wearings"
as permissive
for update
to authenticated
using ((owner = auth.uid()));



