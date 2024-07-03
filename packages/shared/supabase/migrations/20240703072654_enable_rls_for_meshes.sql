create policy "Enable insert for authenticated users only"
on "public"."meshes"
as permissive
for select
to authenticated
using (true);



