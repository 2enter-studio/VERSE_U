CREATE UNIQUE INDEX unique_location ON public.regions USING btree (x, y, enabled);
alter table "public"."regions" add constraint "unique_location" UNIQUE using index "unique_location";
