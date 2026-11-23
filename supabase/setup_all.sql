-- CreatorSpace (multi-user): every creator has their own name (slug) + code, own content, own link.
-- Run once in the Supabase SQL editor.

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------- tables (every row belongs to one owner = one creator) ----------
create table public.profiles (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null unique references auth.users(id) on delete cascade,
  slug        text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'),
  name        text not null default '',
  title       text not null default '',
  intro       text not null default '',
  bio         text not null default '',
  avatar_url  text,
  banner_url  text,
  stats       jsonb not null default '[]'::jsonb check (jsonb_typeof(stats) = 'array'),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.site_settings (
  id                   uuid primary key default gen_random_uuid(),
  owner_id             uuid not null unique references auth.users(id) on delete cascade,
  logo_text            text not null default 'CreatorSpace',
  logo_url             text,
  primary_color        text not null default '#ff4fa3' check (primary_color ~* '^#[0-9a-f]{6}$'),
  secondary_color      text not null default '#a855f7' check (secondary_color ~* '^#[0-9a-f]{6}$'),
  background_theme     text not null default 'dark' check (background_theme in ('dark','light')),
  animations_enabled   boolean not null default true,
  footer_text          text not null default '',
  video_url            text,
  video_thumbnail_url  text,
  video_title          text not null default '',
  sections             jsonb not null check (jsonb_typeof(sections) = 'array'),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table public.contact_settings (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null unique references auth.users(id) on delete cascade,
  email         text not null default '',
  whatsapp      text not null default '',
  message       text not null default '',
  button_label  text not null default 'Get in touch',
  button_url    text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.social_links (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  platform    text not null check (char_length(platform) between 1 and 60),
  username    text not null default '',
  url         text not null check (url ~* '^(https?://|mailto:|tel:)'),
  icon        text not null default 'link',
  is_enabled  boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.projects (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references auth.users(id) on delete cascade,
  title          text not null check (char_length(title) between 1 and 120),
  description    text not null default '',
  thumbnail_url  text,
  github_url     text check (github_url is null or github_url ~* '^https?://'),
  demo_url       text check (demo_url is null or demo_url ~* '^https?://'),
  is_published   boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.work_links (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  label       text not null check (char_length(label) between 1 and 60),
  url         text not null check (url ~* '^(https?://|mailto:|tel:)'),
  icon        text not null default 'link',
  type        text not null default 'other' check (type in ('github','portfolio','resume','blog','other')),
  is_enabled  boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index social_links_owner_idx on public.social_links (owner_id, sort_order);
create index projects_owner_idx     on public.projects (owner_id, sort_order);
create index work_links_owner_idx   on public.work_links (owner_id, sort_order);

-- ---------- triggers ----------
do $$
declare t text;
begin
  foreach t in array array['profiles','social_links','projects','work_links','site_settings','contact_settings']
  loop
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- A creator can never change their link name or hand their page to someone else.
create or replace function public.lock_profile_identity()
returns trigger language plpgsql as $$
begin new.slug := old.slug; new.owner_id := old.owner_id; return new; end $$;
create trigger profiles_lock before update on public.profiles
  for each row execute function public.lock_profile_identity();

-- When someone signs up (name + code), create their empty website automatically.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare s text := lower(coalesce(new.raw_user_meta_data->>'slug', ''));
begin
  if s !~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'
     or s in ('admin','login','signup','api','www','assets','static','u','app','dashboard') then
    raise exception 'invalid_slug';
  end if;
  insert into public.profiles (owner_id, slug, name) values (new.id, s, s);
  insert into public.contact_settings (owner_id) values (new.id);
  insert into public.site_settings (owner_id, sections) values (new.id,
    '[{"key":"hero","label":"Home","heading":"","description":"","visible":true,"order":1},
      {"key":"profile","label":"About","heading":"","description":"","visible":false,"order":2},
      {"key":"work","label":"Projects","heading":"","description":"","visible":false,"order":3},
      {"key":"socials","label":"Socials","heading":"Find me online","description":"","visible":true,"order":4},
      {"key":"contact","label":"Contact","heading":"Let''s work together","description":"","visible":true,"order":5}]'::jsonb);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lets the sign-up form say "name already taken" before creating the account.
create or replace function public.slug_available(s text)
returns boolean language sql stable security definer set search_path = public as $$
  select not exists (select 1 from public.profiles where slug = lower(s));
$$;
grant execute on function public.slug_available(text) to anon, authenticated;

-- ---------- Row Level Security ----------
alter table public.profiles         enable row level security;
alter table public.site_settings    enable row level security;
alter table public.contact_settings enable row level security;
alter table public.social_links     enable row level security;
alter table public.projects         enable row level security;
alter table public.work_links       enable row level security;

-- Everyone can READ published portfolio content (that is what a public website is).
create policy "public read" on public.profiles         for select to anon, authenticated using (true);
create policy "public read" on public.site_settings    for select to anon, authenticated using (true);
create policy "public read" on public.contact_settings for select to anon, authenticated using (true);
create policy "public read enabled"   on public.social_links for select to anon, authenticated using (is_enabled);
create policy "public read enabled"   on public.work_links   for select to anon, authenticated using (is_enabled);
create policy "public read published" on public.projects     for select to anon, authenticated using (is_published);

-- A signed-in creator can change ONLY their own rows. (Rows for new users are made by the sign-up trigger.)
create policy "owner update" on public.profiles         for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner update" on public.site_settings    for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner update" on public.contact_settings for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner all" on public.social_links for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner all" on public.projects     for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner all" on public.work_links   for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Visitors (not signed in) can never write.
revoke insert, update, delete, truncate on public.profiles, public.site_settings, public.contact_settings,
  public.social_links, public.projects, public.work_links from anon;
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
