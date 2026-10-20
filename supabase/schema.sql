-- Optional Supabase schema.
--
-- This build ships with a local SQLite database (see src/lib/db.ts) so it runs
-- with zero external services. If you move to Supabase / Postgres (recommended
-- for Vercel because serverless functions have an ephemeral filesystem), this
-- is the table shape the app expects.

create table if not exists gifts (
  id text primary key,
  user_id uuid references auth.users not null,
  template_slug text not null,
  title text not null,
  recipient_name text,
  content jsonb not null default '{}',
  music jsonb,
  theme_color text,
  qr_settings jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  views int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table gifts enable row level security;

create policy "owner full access" on gifts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "public read published" on gifts
  for select using (status = 'published');

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gifts_updated_at on gifts;
create trigger gifts_updated_at
  before update on gifts
  for each row execute function set_updated_at();

create or replace function increment_views(gift_id text)
returns void language sql as $$
  update gifts set views = views + 1 where id = gift_id and status = 'published';
$$;

-- Storage: create a public bucket called "gift-media".
-- Path convention: {user_id}/{gift_id}/{filename}
-- insert into storage.buckets (id, name, public) values ('gift-media', 'gift-media', true);
