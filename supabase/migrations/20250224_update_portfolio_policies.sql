-- Drop existing policies
drop policy if exists "Users can view their own portfolio items" on portfolio_items;

-- Create new policies
create policy "Anyone can view portfolio items"
  on portfolio_items for select
  to authenticated
  using (true);

create policy "Users can create their own portfolio items"
  on portfolio_items for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "Users can update their own portfolio items"
  on portfolio_items for update
  to authenticated
  using (auth.uid() = owner_id);

create policy "Users can delete their own portfolio items"
  on portfolio_items for delete
  to authenticated
  using (auth.uid() = owner_id);
