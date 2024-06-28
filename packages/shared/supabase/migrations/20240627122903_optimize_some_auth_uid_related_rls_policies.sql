drop policy "Allow users to update their own agree values" on "public"."chat_members";

drop policy "(temporarily) User can insert their own rows" on "public"."owned_wearings";

drop policy "User can update rows they own" on "public"."owned_wearings";

drop policy "User can update his own profile" on "public"."profiles";

drop policy "Authenticated user can insert their own trip" on "public"."trips";

create policy "Allow users to update their own agree values"
on "public"."chat_members"
as permissive
for update
to authenticated
using (( SELECT (auth.uid() = chat_members."user")));


create policy "(temporarily) User can insert their own rows"
on "public"."owned_wearings"
as permissive
for insert
to authenticated
with check (( SELECT (auth.uid() = owned_wearings.owner)));


create policy "User can update rows they own"
on "public"."owned_wearings"
as permissive
for update
to authenticated
using (( SELECT (auth.uid() = owned_wearings.owner)));


create policy "User can update his own profile"
on "public"."profiles"
as permissive
for update
to public
using (( SELECT (auth.uid() = profiles."user")));


create policy "Authenticated user can insert their own trip"
on "public"."trips"
as permissive
for insert
to authenticated
with check (( SELECT (auth.uid() = trips."user")));



