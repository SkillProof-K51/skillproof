create table public.micro_projects (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  created_at  timestamptz not null default now()
);

alter table public.micro_projects enable row level security;

create policy "micro projects: owner reads"
  on public.micro_projects for select
  to authenticated
  using (owner_id = (select auth.uid()));

create policy "micro projects: owner creates"
  on public.micro_projects for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "micro projects: owner updates"
  on public.micro_projects for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "micro projects: owner deletes"
  on public.micro_projects for delete
  to authenticated
  using (owner_id = (select auth.uid()));