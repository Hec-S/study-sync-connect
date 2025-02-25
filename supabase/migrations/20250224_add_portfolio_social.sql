-- Create likes table
create table portfolio_likes (
  id uuid default gen_random_uuid() primary key,
  portfolio_item_id uuid not null references portfolio_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(portfolio_item_id, user_id)
);

-- Create comments table
create table portfolio_comments (
  id uuid default gen_random_uuid() primary key,
  portfolio_item_id uuid not null references portfolio_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies for likes
alter table portfolio_likes enable row level security;

create policy "Users can view all likes"
  on portfolio_likes for select
  to authenticated
  using (true);

create policy "Users can like items"
  on portfolio_likes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can unlike their own likes"
  on portfolio_likes for delete
  to authenticated
  using (auth.uid() = user_id);

-- Add RLS policies for comments
alter table portfolio_comments enable row level security;

create policy "Users can view all comments"
  on portfolio_comments for select
  to authenticated
  using (true);

create policy "Users can add comments"
  on portfolio_comments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on portfolio_comments for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on portfolio_comments for delete
  to authenticated
  using (auth.uid() = user_id);

-- Add likes count to portfolio_items
alter table portfolio_items add column likes_count integer default 0;

-- Add comments count to portfolio_items
alter table portfolio_items add column comments_count integer default 0;

-- Create function to update likes count
create or replace function update_portfolio_item_likes_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update portfolio_items
    set likes_count = likes_count + 1
    where id = NEW.portfolio_item_id;
  elsif (TG_OP = 'DELETE') then
    update portfolio_items
    set likes_count = likes_count - 1
    where id = OLD.portfolio_item_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Create trigger for likes count
create trigger update_portfolio_item_likes_count
after insert or delete on portfolio_likes
for each row
execute function update_portfolio_item_likes_count();

-- Create function to update comments count
create or replace function update_portfolio_item_comments_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update portfolio_items
    set comments_count = comments_count + 1
    where id = NEW.portfolio_item_id;
  elsif (TG_OP = 'DELETE') then
    update portfolio_items
    set comments_count = comments_count - 1
    where id = OLD.portfolio_item_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Create trigger for comments count
create trigger update_portfolio_item_comments_count
after insert or delete on portfolio_comments
for each row
execute function update_portfolio_item_comments_count();
