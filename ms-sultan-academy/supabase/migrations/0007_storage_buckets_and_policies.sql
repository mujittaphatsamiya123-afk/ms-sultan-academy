-- Before running this file, create these PUBLIC buckets via
-- Supabase Dashboard -> Storage -> New Bucket:
--   thumbnails, videos, resources, certificates, avatars

create policy "Admins upload thumbnails" on storage.objects for insert with check (
  bucket_id = 'thumbnails' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins upload videos" on storage.objects for insert with check (
  bucket_id = 'videos' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins upload resources" on storage.objects for insert with check (
  bucket_id = 'resources' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins delete files" on storage.objects for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Public read access" on storage.objects for select using (
  bucket_id in ('thumbnails', 'videos', 'resources', 'certificates', 'avatars')
);
create policy "Service can insert certificates" on storage.objects for insert with check (bucket_id = 'certificates');
create policy "Users upload own avatar" on storage.objects for insert with check (
  bucket_id = 'avatars' and auth.uid() is not null
);
