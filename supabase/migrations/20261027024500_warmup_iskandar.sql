-- Warm-up (Iskandar, Module 1): one table with an owner column and Row Level Security, copied
-- from 0001_warmup_notes.sql (AGENTS.md rule 1). Each row: an industry standard its owner noted.

create table public.warmup_iskandar (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users (id) on delete cascade,
  standard    text not null check (char_length(standard) between 1 and 200),
  created_at  timestamptz not null default now()
);

-- Row Level Security: on from the first table, always.
alter table public.warmup_iskandar enable row level security;

-- Owners can read their own rows …
create policy "iskandar: owner reads"
  on public.warmup_iskandar for select
  to authenticated
  using (owner_id = (select auth.uid()));

-- … and write their own rows. owner_id must be the caller.
create policy "iskandar: owner writes"
  on public.warmup_iskandar for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "iskandar: owner updates"
  on public.warmup_iskandar for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "iskandar: owner deletes"
  on public.warmup_iskandar for delete
  to authenticated
  using (owner_id = (select auth.uid()));

-- Test with TWO accounts before merging: account A must not see account B's rows.
