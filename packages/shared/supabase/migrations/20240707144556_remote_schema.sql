create policy "Authenticated users can read all files 5luvfi_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'user_data'::text) AND (auth.role() = 'authenticated'::text)));



