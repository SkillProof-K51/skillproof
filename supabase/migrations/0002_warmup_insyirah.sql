
-- Warm-up table for Insyirah.

create table public.warmup_insyirah (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users (id) on delete cascade,
  note_text   text not null check (char_length(note_text) between 1 and 500),
  created_at  timestamptz not null default now()
);

-- Row Level Security: on from the first table, always.
alter table public.warmup_insyirah enable row level security;

-- Owners can read their own notes.
create policy "notes: owner reads"
  on public.warmup_insyirah for select
  to authenticated
  using (owner_id = (select auth.uid()));

-- Owners can insert their own notes.
create policy "notes: owner writes"
  on public.warmup_insyirah for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "notes: owner updates"
  on public.warmup_insyirah for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "notes: owner deletes"
  on public.warmup_insyirah for delete
  to authenticated
  using (owner_id = (select auth.uid()));

-- Test with TWO accounts before merging: account A must not see account B's rows.
