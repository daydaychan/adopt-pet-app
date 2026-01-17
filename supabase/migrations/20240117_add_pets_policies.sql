-- Allow authenticated users to insert new pets
drop policy if exists "Authenticated users can insert pets" on pets;
create policy "Authenticated users can insert pets"
  on pets for insert
  to authenticated
  with check (true);

-- Allow authenticated users to update pets
drop policy if exists "Authenticated users can update pets" on pets;
create policy "Authenticated users can update pets"
  on pets for update
  to authenticated
  using (true);
