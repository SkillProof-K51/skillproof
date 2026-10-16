-- Warm-up example: the pattern every table in SkillProof follows (AGENTS.md rule 1).
-- Copy this file for your warm-up table, rename, and adjust the columns.

create table public.warmup_notes (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users (id) on delete cascade,
  body        text not null check (char_length(body) between 1 and 500),
  created_at  timestamptz not null default now()
);

-- Row Level Security: on from the first table, always.
alter table public.warmup_notes enable row level security;

-- Owners can read their own notes …
create policy "notes: owner reads"
  on public.warmup_notes for select
  to authenticated
  using (owner_id = (select auth.uid()));

-- … and write their own notes. owner_id must be the caller.
create policy "notes: owner writes"
  on public.warmup_notes for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "notes: owner updates"
  on public.warmup_notes for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "notes: owner deletes"
  on public.warmup_notes for delete
  to authenticated
  using (owner_id = (select auth.uid()));

-- Test with TWO accounts before merging: account A must not see account B's rows.
