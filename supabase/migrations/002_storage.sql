-- Storage: public buckets (files load by URL, listing is not public).
-- Each creator can only touch files inside their own folder: <their-user-id>/filename

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('profile-images', 'profile-images', true,  5242880,  array['image/jpeg','image/png','image/webp']),
  ('creator-videos', 'creator-videos', true,  52428800, array['video/mp4','video/webm','video/quicktime']),
  ('project-images', 'project-images', true,  5242880,  array['image/jpeg','image/png','image/webp']),
  ('website-assets', 'website-assets', true,  5242880,  array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "owner read own files" on storage.objects for select to authenticated
  using (bucket_id in ('profile-images','creator-videos','project-images','website-assets') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "owner upload own files" on storage.objects for insert to authenticated
  with check (bucket_id in ('profile-images','creator-videos','project-images','website-assets') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "owner update own files" on storage.objects for update to authenticated
  using (bucket_id in ('profile-images','creator-videos','project-images','website-assets') and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id in ('profile-images','creator-videos','project-images','website-assets') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "owner delete own files" on storage.objects for delete to authenticated
  using (bucket_id in ('profile-images','creator-videos','project-images','website-assets') and (storage.foldername(name))[1] = auth.uid()::text);
