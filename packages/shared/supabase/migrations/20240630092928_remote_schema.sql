create policy "Give users access to own folder 5luvfi_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'user_data'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 5luvfi_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'user_data'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 5luvfi_2"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'user_data'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



