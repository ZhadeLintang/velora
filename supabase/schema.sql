-- =====================================================================
-- VELORA / LUMORA GALLERY - SUPABASE DATABASE SCHEMA SETUP
-- =====================================================================
-- This script sets up the tables, relations, indexes, triggers,
-- row-level security (RLS) policies, and storage configurations 
-- required for the Velora GALLERY web application.
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. EXTENSIONS SETUP
-- ---------------------------------------------------------------------
-- Enable UUID generation extension
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- 2. PUBLIC PROFILES TABLE
-- ---------------------------------------------------------------------
-- Stores user profile data linked directly to Supabase Auth users.
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  handle text unique,
  role text default 'Creator',
  bio text default 'AI visual curator building premium references.',
  location text default 'Jakarta',
  avatar text default 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  cover text default 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=85',
  followers text default '0',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;
alter table public.profiles force row level security;

-- RLS Policies for Profiles
-- Read access: Publicly readable by anyone (anon and authenticated)
create policy "Allow public read access on profiles"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

-- Update access: Only the user themselves can update their profile
create policy "Allow updates for owners on profiles"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ---------------------------------------------------------------------
-- 3. AUTH TRIGGER FOR AUTOMATIC PROFILE CREATION
-- ---------------------------------------------------------------------
-- Automatically creates a public profile row whenever a new user
-- signs up in Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  raw_username text;
  formatted_username text;
begin
  -- Get username from metadata or fallback to email local part
  raw_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  
  -- Ensure username starts with '@' to match the frontend expectations
  if raw_username like '@%' then
    formatted_username := raw_username;
  else
    formatted_username := '@' || raw_username;
  end if;

  insert into public.profiles (id, name, handle, avatar, role, followers)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    formatted_username,
    coalesce(new.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'),
    'Creator',
    '0'
  );
  return new;
end;
$$;

-- Create the trigger on auth.users table
-- Drop trigger if exists to prevent duplicates on multiple runs
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- 4. GALLERY PHOTOS TABLE (RENAME TO uppercase GALLERY_PHOTOS)
-- ---------------------------------------------------------------------
-- Stores uploaded photo metadata, categories, and references the creator.
create table if not exists public.GALLERY_PHOTOS (
  id uuid default gen_random_uuid() primary key,
  image text not null,
  title text not null,
  description text,
  category text not null,
  likes integer default 0 not null,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  height text default 'medium' not null,
  featured boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints to ensure data integrity
  constraint check_category check (
    category in ('technology', 'architecture', 'futuristic', 'gaming', 'AI', 'workspace', 'cyberpunk', 'landscape')
  ),
  constraint check_height check (
    height in ('short', 'medium', 'tall')
  )
);

-- Index the foreign key column to optimize JOINs and cascading deletions
create index if not exists GALLERY_PHOTOS_creator_id_idx on public.GALLERY_PHOTOS (creator_id);

-- Enable RLS on GALLERY_PHOTOS
alter table public.GALLERY_PHOTOS enable row level security;
alter table public.GALLERY_PHOTOS force row level security;

-- RLS Policies for GALLERY PHOTOS
-- Read access: Publicly readable by anyone
create policy "Allow public read access on GALLERY_PHOTOS"
  on public.GALLERY_PHOTOS
  for select
  to anon, authenticated
  using (true);

-- Insert access: Authenticated users can insert their own photos
create policy "Allow insert for authenticated users on GALLERY_PHOTOS"
  on public.GALLERY_PHOTOS
  for insert
  to authenticated
  with check ((select auth.uid()) = creator_id);

-- Update access: Only the creator can edit their photo metadata
create policy "Allow update for owners on GALLERY_PHOTOS"
  on public.GALLERY_PHOTOS
  for update
  to authenticated
  using ((select auth.uid()) = creator_id)
  with check ((select auth.uid()) = creator_id);

-- Delete access: Only the creator can delete their photo record
create policy "Allow delete for owners on GALLERY_PHOTOS"
  on public.GALLERY_PHOTOS
  for delete
  to authenticated
  using ((select auth.uid()) = creator_id);

-- ---------------------------------------------------------------------
-- 5. PHOTO LIKES TABLE (MANY-TO-MANY RELATIONSHIP)
-- ---------------------------------------------------------------------
-- Models likes/favorites, allowing a user to like a photo once.
create table if not exists public.photo_likes (
  photo_id uuid references public.GALLERY_PHOTOS(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (photo_id, user_id)
);

-- Indexes for performance on photo_likes foreign keys
create index if not exists photo_likes_photo_id_idx on public.photo_likes (photo_id);
create index if not exists photo_likes_user_id_idx on public.photo_likes (user_id);

-- Enable RLS on photo_likes
alter table public.photo_likes enable row level security;
alter table public.photo_likes force row level security;

-- RLS Policies for Photo Likes
-- Read access: Publicly readable
create policy "Allow public read access on photo_likes"
  on public.photo_likes
  for select
  to anon, authenticated
  using (true);

-- Insert access: Authenticated users can like photos as themselves
create policy "Allow insert for owners on photo_likes"
  on public.photo_likes
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- Delete access: Authenticated users can unlike photos they liked
create policy "Allow delete for owners on photo_likes"
  on public.photo_likes
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------
-- 6. LIKE SYNC TRIGGER FOR GALLERY PHOTOS
-- ---------------------------------------------------------------------
-- Automatically keeps the `likes` cache count in `GALLERY_PHOTOS`
-- in sync when rows are added/deleted in the `photo_likes` table.
create or replace function public.handle_photo_like()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.GALLERY_PHOTOS
    set likes = likes + 1
    where id = new.photo_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.GALLERY_PHOTOS
    set likes = greatest(0, likes - 1)
    where id = old.photo_id;
    return old;
  end if;
  return null;
end;
$$;

-- Create the trigger on photo_likes table
drop trigger if exists on_photo_liked on public.photo_likes;
create trigger on_photo_liked
  after insert or delete on public.photo_likes
  for each row execute procedure public.handle_photo_like();

-- ---------------------------------------------------------------------
-- 7. COMMENTS TABLE
-- ---------------------------------------------------------------------
-- Stores comment messages on GALLERY photos.
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  photo_id uuid references public.GALLERY_PHOTOS(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for comment queries
create index if not exists comments_photo_id_idx on public.comments (photo_id);
create index if not exists comments_user_id_idx on public.comments (user_id);

-- Enable RLS on comments
alter table public.comments enable row level security;
alter table public.comments force row level security;

-- RLS Policies for Comments
-- Read access: Publicly readable
create policy "Allow public read access on comments"
  on public.comments
  for select
  to anon, authenticated
  using (true);

-- Insert access: Authenticated users can comment as themselves
create policy "Allow insert for authenticated users on comments"
  on public.comments
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- Update access: Only comment authors can update their messages
create policy "Allow update for owners on comments"
  on public.comments
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Delete access: Only comment authors can delete their comments
create policy "Allow delete for owners on comments"
  on public.comments
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------
-- 8. STORAGE BUCKET SETUP & POLICIES (GALLERY BUCKET)
-- ---------------------------------------------------------------------
-- Ensure the public 'GALLERY' bucket exists in Supabase Storage.
insert into storage.buckets (id, name, public)
values ('GALLERY', 'GALLERY', true)
on conflict (id) do nothing;

-- Enable storage RLS policies
-- Public select: Anyone can read files from the GALLERY bucket
create policy "Allow public read access on storage objects"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'GALLERY');

-- Insert policy: Users can only upload to a folder that matches their Auth ID
create policy "Allow upload for authenticated users on storage objects"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'GALLERY' and
    (select auth.uid())::text = split_part(name, '/', 1)
  );

-- Delete policy: Users can only delete their own uploaded files
create policy "Allow delete for owners on storage objects"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'GALLERY' and
    (select auth.uid())::text = split_part(name, '/', 1)
  );
