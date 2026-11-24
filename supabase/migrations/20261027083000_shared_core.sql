-- Shared core (spec › Build order step 2; owner Azim): who each user is, the skill catalogue, the
-- target roles with their skill weights, and every student's skill status. All modules build on it.
--
-- How this file is written (AGENTS.md rules 1, 2, 7):
--   · Each table: revoke the project's default grants → grant back exactly → RLS on → policies.
--     Supabase grants anon and authenticated everything on a new table by default, so RLS would be
--     the only gate; here the grants are a second one (e.g. nobody can update profiles.role at all).
--   · Who someone is (profiles.role, profiles.status) and a skill status are never written by the
--     app. The sign-up trigger writes the first; Module 3 and Module 4 add the writers of the second.
--   · Functions pin `search_path = ''`. Definer functions live in `private`, which the API can't see.
--   · Once applied, never edit this file — write the next migration (rule 11).

create schema if not exists private;
revoke all on schema private from public;

-- ─── enums ────────────────────────────────────────────────────────────────────────────────────
create type public.user_role as enum ('student', 'company', 'mentor', 'coordinator', 'admin');
-- Students start active; companies and mentors start pending until an admin approves them.
create type public.account_status as enum ('active', 'pending', 'rejected');
-- Declared in the one order a status may move (rule 7), so `<` compares them.
create type public.skill_status as enum ('not_yet', 'practised', 'verified');

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke execute on function private.set_updated_at() from public, anon, authenticated;

-- ─── profiles: one row per account, every user type ─────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        public.user_role not null,
  status      public.account_status not null,
  full_name   text not null check (char_length(full_name) between 1 and 80),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.profiles is 'One per account. Made by private.handle_new_user() at sign-up; role and status are set by an admin, never by the user.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

-- private.is_admin(): an active admin is calling. Definer so it can read profiles from inside
-- profiles' own policies without looping through them. Policies need EXECUTE, not schema usage.
create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin' and status = 'active'
  );
$$;
revoke execute on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

revoke all on table public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "profiles: owner or admin reads"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

create policy "profiles: owner updates own name"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ─── the catalogue: programmes, skills, job roles and their weights ─────────────────────────
-- Everyone reads it, signed in or not: onboarding shows roles and roadmaps before sign-up.
-- Only an admin changes it (spec › Users). Module 1 owns these tables after this file and builds
-- the add / edit / delete pages on them. Ids are short codes ('web', 'javascript') so seed data
-- and the app can name them.
create table public.programmes (
  id          text primary key check (id ~ '^[a-z0-9_]{2,40}$'),
  name        text not null unique check (char_length(name) between 1 and 80),
  created_at  timestamptz not null default now()
);
comment on table public.programmes is 'Study programmes a student picks at sign-up.';

create table public.skills (
  id          text primary key check (id ~ '^[a-z0-9_]{2,40}$'),
  name        text not null unique check (char_length(name) between 1 and 60),
  description text not null default '' check (char_length(description) <= 300),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.skills is 'The skill catalogue. Module 1 owns it.';

create table public.job_roles (
  id          text primary key check (id ~ '^[a-z0-9_]{2,40}$'),
  name        text not null unique check (char_length(name) between 1 and 60),
  description text not null default '' check (char_length(description) <= 300),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.job_roles is 'Roles a student works towards (Web Developer…). Module 1 owns it.';

create table public.job_role_skills (
  job_role_id text not null references public.job_roles (id) on delete cascade,
  skill_id    text not null references public.skills (id) on delete cascade,
  position    smallint not null check (position >= 1),
  weight      smallint not null check (weight between 1 and 100),
  primary key (job_role_id, skill_id)
);
comment on table public.job_role_skills is 'A role''s roadmap (position) and how much each skill counts towards Readiness % (weight, an integer; Module 1 sets it from job-ad counts).';

create trigger skills_set_updated_at
  before update on public.skills
  for each row execute function private.set_updated_at();
create trigger job_roles_set_updated_at
  before update on public.job_roles
  for each row execute function private.set_updated_at();

revoke all on table public.programmes, public.skills, public.job_roles, public.job_role_skills from anon, authenticated;
grant select on public.programmes, public.skills, public.job_roles, public.job_role_skills to anon, authenticated;
grant insert, update, delete on public.programmes, public.skills, public.job_roles, public.job_role_skills to authenticated;
grant all on public.programmes, public.skills, public.job_roles, public.job_role_skills to service_role;

alter table public.programmes enable row level security;
alter table public.skills enable row level security;
alter table public.job_roles enable row level security;
alter table public.job_role_skills enable row level security;

create policy "programmes: everyone reads" on public.programmes for select to anon, authenticated using (true);
create policy "programmes: admin adds" on public.programmes for insert to authenticated with check ((select private.is_admin()));
create policy "programmes: admin edits" on public.programmes for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "programmes: admin deletes" on public.programmes for delete to authenticated using ((select private.is_admin()));

create policy "skills: everyone reads" on public.skills for select to anon, authenticated using (true);
create policy "skills: admin adds" on public.skills for insert to authenticated with check ((select private.is_admin()));
create policy "skills: admin edits" on public.skills for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "skills: admin deletes" on public.skills for delete to authenticated using ((select private.is_admin()));

create policy "job roles: everyone reads" on public.job_roles for select to anon, authenticated using (true);
create policy "job roles: admin adds" on public.job_roles for insert to authenticated with check ((select private.is_admin()));
create policy "job roles: admin edits" on public.job_roles for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "job roles: admin deletes" on public.job_roles for delete to authenticated using ((select private.is_admin()));

create policy "job role skills: everyone reads" on public.job_role_skills for select to anon, authenticated using (true);
create policy "job role skills: admin adds" on public.job_role_skills for insert to authenticated with check ((select private.is_admin()));
create policy "job role skills: admin edits" on public.job_role_skills for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "job role skills: admin deletes" on public.job_role_skills for delete to authenticated using ((select private.is_admin()));

-- ─── student_profiles: what a student told us at sign-up ────────────────────────────────────
-- Module 2 owns it after this file and adds its own columns (the aim waits for Insyirah's OK).
create table public.student_profiles (
  id             uuid primary key references public.profiles (id) on delete cascade,
  job_role_id    text references public.job_roles (id) on delete set null,
  programme_id   text references public.programmes (id) on delete set null,
  year           smallint check (year between 1 and 4),
  -- Skills they said they've used. Only picks their first challenges (Module 3), never a status.
  used_skill_ids text[] not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
comment on table public.student_profiles is 'A student''s target role, programme and year. Made by private.handle_new_user(); Module 2 owns it.';

create trigger student_profiles_set_updated_at
  before update on public.student_profiles
  for each row execute function private.set_updated_at();

revoke all on table public.student_profiles from anon, authenticated;
grant select on public.student_profiles to authenticated;
grant update (job_role_id, programme_id, year) on public.student_profiles to authenticated;
grant all on public.student_profiles to service_role;

alter table public.student_profiles enable row level security;

create policy "student profiles: owner or admin reads"
  on public.student_profiles for select
  to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

create policy "student profiles: owner updates own"
  on public.student_profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ─── student_skills: the status everything hangs on ─────────────────────────────────────────
-- No row = not_yet. The app never writes here: Module 3 adds the function that writes practised,
-- Module 4 the one that writes verified (rule 7). The trigger below holds the order for every writer.
create table public.student_skills (
  student_id   uuid not null references public.student_profiles (id) on delete cascade,
  skill_id     text not null references public.skills (id) on delete restrict,
  status       public.skill_status not null default 'not_yet',
  practised_at timestamptz,
  verified_at  timestamptz,
  updated_at   timestamptz not null default now(),
  primary key (student_id, skill_id)
);
comment on table public.student_skills is 'Per student per skill: not_yet → practised → verified, forward only. Written only by Module 3 (practised) and Module 4 (verified) functions.';

-- Forward only, verified only after practised, and the timestamps are the trigger's, not the writer's.
create function private.guard_skill_status()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_from public.skill_status := case when tg_op = 'UPDATE' then old.status else 'not_yet' end;
begin
  if tg_op = 'UPDATE' and (new.student_id, new.skill_id) is distinct from (old.student_id, old.skill_id) then
    raise exception 'a skill status row cannot move to another student or skill' using errcode = '23514';
  end if;
  if new.status < v_from then
    raise exception 'skill status only moves forward (% to % refused)', v_from, new.status using errcode = '23514';
  end if;
  if new.status = 'verified' and v_from = 'not_yet' then
    raise exception 'a skill is verified only after it is practised' using errcode = '23514';
  end if;

  new.practised_at := case when tg_op = 'UPDATE' then old.practised_at end;
  new.verified_at := case when tg_op = 'UPDATE' then old.verified_at end;
  if new.status >= 'practised' and new.practised_at is null then new.practised_at := now(); end if;
  if new.status = 'verified' and new.verified_at is null then new.verified_at := now(); end if;
  new.updated_at := now();
  return new;
end;
$$;
revoke execute on function private.guard_skill_status() from public, anon, authenticated;

create trigger student_skills_guard
  before insert or update on public.student_skills
  for each row execute function private.guard_skill_status();

revoke all on table public.student_skills from anon, authenticated;
grant select on public.student_skills to authenticated;
grant all on public.student_skills to service_role;

alter table public.student_skills enable row level security;

create policy "student skills: owner or admin reads"
  on public.student_skills for select
  to authenticated
  using (student_id = (select auth.uid()) or (select private.is_admin()));

-- ─── sign-up: one profile (and a student profile for students) per new account ──────────────
-- The app sends the onboarding answers as user metadata: full_name, role, job_role_id,
-- programme_id, year, used_skill_ids. Anything unknown is dropped, not trusted. Self sign-up can
-- only make a student, company or mentor; coordinators and admins are set by an admin. Metadata
-- is read once, here — the user can edit it later, so nothing else may rely on it.
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_role public.user_role;
  v_name text := left(trim(coalesce(v_meta ->> 'full_name', '')), 80);
  v_used jsonb := case when jsonb_typeof(v_meta -> 'used_skill_ids') = 'array' then v_meta -> 'used_skill_ids' else '[]'::jsonb end;
begin
  v_role := case coalesce(v_meta ->> 'role', 'student')
    when 'student' then 'student'::public.user_role
    when 'company' then 'company'::public.user_role
    when 'mentor' then 'mentor'::public.user_role
  end;
  if v_role is null then
    raise exception 'sign-up cannot choose the role %', v_meta ->> 'role' using errcode = '42501';
  end if;
  if v_name = '' then v_name := left(nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 80); end if;

  insert into public.profiles (id, role, status, full_name)
  values (new.id, v_role, case when v_role = 'student' then 'active' else 'pending' end::public.account_status, coalesce(v_name, 'New user'));

  if v_role = 'student' then
    insert into public.student_profiles (id, job_role_id, programme_id, year, used_skill_ids)
    values (
      new.id,
      (select id from public.job_roles where id = v_meta ->> 'job_role_id'),
      (select id from public.programmes where id = v_meta ->> 'programme_id'),
      case when v_meta ->> 'year' ~ '^[1-4]$' then (v_meta ->> 'year')::smallint end,
      array(select s.id from public.skills s where s.id in (select jsonb_array_elements_text(v_used)) order by s.id)
    );
  end if;
  return new;
end;
$$;
revoke execute on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();
