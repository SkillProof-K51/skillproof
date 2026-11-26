-- Module 4: mentor-owned micro-projects and student-owned applications.
-- This migration is a draft for shared-core review. Do not apply it to the shared Supabase project
-- until Azim approves the schema.

create table public.micro_projects (
  id                  uuid primary key default gen_random_uuid(),
  owner_id            uuid not null references public.mentors (id) on delete cascade,
  title               text not null check (char_length(title) between 1 and 120),
  summary             text not null check (char_length(summary) between 1 and 240),
  description         text not null default '' check (char_length(description) <= 4000),
  required_skill_ids  text[] not null default '{}',
  status              text not null default 'draft' check (status in ('draft', 'open', 'closed')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  check (cardinality(required_skill_ids) <= 20),
  check (array_position(required_skill_ids, null) is null)
);
comment on table public.micro_projects is 'Mentor-owned micro-projects. Students can discover open projects; only the owning mentor manages them.';

create table public.applications (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.student_profiles (id) on delete cascade,
  project_id  uuid not null references public.micro_projects (id) on delete cascade,
  status      text not null default 'applied' check (status in ('applied', 'accepted', 'rejected', 'withdrawn', 'completed')),
  message     text not null default '' check (char_length(message) <= 2000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (owner_id, project_id)
);
comment on table public.applications is 'Student-owned applications to micro-projects. Students see their own; mentors see applications to their projects.';

create index micro_projects_owner_status_idx on public.micro_projects (owner_id, status);
create index applications_project_status_idx on public.applications (project_id, status);

-- Keep the skill ids valid against M1's shared catalogue, and maintain both update timestamps.
create function private.guard_micro_project_skills()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1
    from unnest(new.required_skill_ids) as required(skill_id)
    where not exists (select 1 from public.skills s where s.id = required.skill_id)
  ) then
    raise exception 'every required skill must exist in the skills catalogue' using errcode = '23503';
  end if;
  return new;
end;
$$;
revoke execute on function private.guard_micro_project_skills() from public, anon, authenticated;

create trigger micro_projects_skills_guard
  before insert or update of required_skill_ids on public.micro_projects
  for each row execute function private.guard_micro_project_skills();

create trigger micro_projects_updated_at
  before update on public.micro_projects
  for each row execute function private.set_updated_at();

create trigger applications_updated_at
  before update on public.applications
  for each row execute function private.set_updated_at();

revoke all on table public.micro_projects, public.applications from anon, authenticated;
grant select on public.micro_projects to authenticated;
grant insert (id, owner_id, title, summary, description, required_skill_ids, status),
  update (title, summary, description, required_skill_ids, status) on public.micro_projects to authenticated;
grant delete on public.micro_projects to authenticated;
grant select on public.applications to authenticated;
grant insert (id, owner_id, project_id, message) on public.applications to authenticated;
grant update (status) on public.applications to authenticated;
grant all on public.micro_projects, public.applications to service_role;

alter table public.micro_projects enable row level security;
alter table public.applications enable row level security;

create policy "micro projects: students read open and mentors read own"
  on public.micro_projects for select
  to authenticated
  using (
    (status = 'open' and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'student' and p.status = 'active'
    ))
    or (owner_id = (select auth.uid()) and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'mentor' and p.status = 'active'
    ))
    or (select private.is_admin())
  );

create policy "micro projects: active mentor creates own"
  on public.micro_projects for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'mentor' and p.status = 'active'
    )
  );

create policy "micro projects: owning mentor edits own"
  on public.micro_projects for update
  to authenticated
  using (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'mentor' and p.status = 'active'
    )
  )
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'mentor' and p.status = 'active'
    )
  );

create policy "micro projects: owning mentor deletes own"
  on public.micro_projects for delete
  to authenticated
  using (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'mentor' and p.status = 'active'
    )
  );

create policy "applications: student or owning mentor reads"
  on public.applications for select
  to authenticated
  using (
    owner_id = (select auth.uid())
    or exists (
      select 1 from public.micro_projects mp
      where mp.id = project_id and mp.owner_id = (select auth.uid())
    )
    or (select private.is_admin())
  );

create policy "applications: eligible student applies to open project"
  on public.applications for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'student' and p.status = 'active'
    )
    and exists (
      select 1 from public.micro_projects mp
      where mp.id = project_id
        and mp.status = 'open'
        and not exists (
          select 1
          from unnest(mp.required_skill_ids) as required(skill_id)
          where not exists (
            select 1 from public.student_skills ss
            where ss.student_id = (select auth.uid())
              and ss.skill_id = required.skill_id
              and ss.status in ('practised', 'verified')
          )
        )
    )
  );

create policy "applications: owning mentor updates status"
  on public.applications for update
  to authenticated
  using (exists (
    select 1 from public.micro_projects mp
    where mp.id = project_id and mp.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.micro_projects mp
    where mp.id = project_id and mp.owner_id = (select auth.uid())
  ));
