create policy "Enable select for authenticated users only"
on "public"."sponsor_wearings"
as permissive
for select
to authenticated
using (true);



