-- Create the bucket for pet images if it doesn't exist
insert into storage.buckets (id, name, public)
values ('pet-images', 'pet-images', true)
on conflict (id) do nothing;

-- Set up security policies

-- 1. Allow public read access to all files in the bucket
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'pet-images' );

-- 2. Allow authenticated users to upload files
drop policy if exists "Authenticated Uploads" on storage.objects;
create policy "Authenticated Uploads"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'pet-images' );

-- 3. Allow authenticated users to update their files (optional but good practice)
drop policy if exists "Authenticated Updates" on storage.objects;
create policy "Authenticated Updates"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'pet-images' );
