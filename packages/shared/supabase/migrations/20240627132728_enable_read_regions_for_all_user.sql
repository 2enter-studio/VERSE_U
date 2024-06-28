drop policy "Enable select for authenticated users only" on "public"."regions";

create policy "Enable read access for all users"
on "public"."regions"
as permissive
for select
to public
using (true);



