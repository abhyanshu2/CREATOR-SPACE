-- ONLY if you already ran the OLD single-admin setup: run this FIRST, then setup_all.sql. Deletes all CreatorSpace data.
drop trigger if exists on_auth_user_created on auth.users;
drop table if exists public.social_links, public.projects, public.work_links, public.site_settings,
  public.contact_settings, public.profiles, public.admin_users cascade;
drop function if exists public.is_admin(), public.handle_new_user(), public.slug_available(text),
  public.lock_profile_identity(), public.set_updated_at() cascade;
drop policy if exists "admin read creatorspace files"   on storage.objects;
drop policy if exists "admin upload creatorspace files" on storage.objects;
drop policy if exists "admin update creatorspace files" on storage.objects;
drop policy if exists "admin delete creatorspace files" on storage.objects;
drop policy if exists "owner read own files"   on storage.objects;
drop policy if exists "owner upload own files" on storage.objects;
drop policy if exists "owner update own files" on storage.objects;
drop policy if exists "owner delete own files" on storage.objects;
