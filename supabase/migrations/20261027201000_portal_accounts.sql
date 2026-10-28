-- Portal accounts (web portal shell; Azim, 28 Oct — design: docs/portal.md): companies and the
-- join code their mentors sign up with, coordinators, the admin's approval, and the private bucket
-- for company documents. Same rules as the shared core: revoke the defaults → grant exactly →
-- RLS on → policies; definer functions only in `private`. Once applied, never edit this file.

-- ─── profiles: the email (the admin contacts accounts) and approval by an admin only ────────
alter table public.profiles add column email text;
update public.profiles p set email = u.email from auth.users u where u.id = p.id;

-- The admin approves or rejects by updating status, and can move an account between coordinator
-- and admin. The grant allows the columns; the trigger below decides who may change them.
grant update (status, role) on public.profiles to authenticated;

create policy "profiles: admin updates any"
  on public.profiles for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- Through the API, only an active admin changes a role or a status, and a role only moves between
-- coordinator and admin (students, companies and mentors have rows of their own elsewhere). The
-- SQL editor (no signed-in user) can do anything, which is how the first admin is made. Definer,
-- so it can call private.is_admin() whoever is signed in.
create function private.guard_profile_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    return new;
  end if;
  if (new.role, new.status) is distinct from (old.role, old.status) and not private.is_admin() then
    raise exception 'only an admin can change an account''s role or status' using errcode = '42501';
  end if;
  if new.role is distinct from old.role
     and not (old.role in ('coordinator', 'admin') and new.role in ('coordinator', 'admin')) then
    raise exception 'a role only moves between coordinator and admin' using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke execute on function private.guard_profile_change() from public, anon, authenticated;

create trigger profiles_guard_change
  before update on public.profiles
  for each row execute function private.guard_profile_change();

-- Keep profiles.email in step when someone changes their email in Supabase Auth.
create function private.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;
revoke execute on function private.sync_profile_email() from public, anon, authenticated;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (new.email is distinct from old.email)
  execute function private.sync_profile_email();

-- ─── companies: one per company account, with the code its mentors join with ────────────────
create table public.companies (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null unique references public.profiles (id) on delete cascade,
  name          text not null check (char_length(name) between 2 and 120),
  ssm_no        text not null check (ssm_no ~ '^[0-9A-Z-]{5,20}$'),
  website       text check (website is null or website ~ '^https?://[^[:space:]]{3,200}$'),
  document_path text check (document_path is null or char_length(document_path) <= 300),
  join_code     text not null unique check (join_code ~ '^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$'),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.companies is 'A company account''s details. Made at sign-up; approved through its owner''s profiles.status; mentors join with join_code.';

-- 8 characters from 32 that can't be misread (no 0/O, 1/I), as XXXX-XXXX: 40 random bits from a
-- uuid (its version and variant bytes skipped).
create function private.new_join_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  v_alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_bytes bytea := uuid_send(gen_random_uuid());
  v_code text := '';
  v_i int;
begin
  foreach v_i in array array[0, 1, 2, 3, 4, 5, 7, 9] loop
    v_code := v_code || substr(v_alphabet, (get_byte(v_bytes, v_i) % 32) + 1, 1);
    if char_length(v_code) = 4 then v_code := v_code || '-'; end if;
  end loop;
  return v_code;
end;
$$;
revoke execute on function private.new_join_code() from public, anon, authenticated;

-- The database writes the join code: a new company gets one, and setting it to null (the
-- portal's "new code") draws another. Nobody can pick their own. The document must sit in the
-- owner's own folder. Definer, so the uniqueness check sees every company.
create function private.guard_company()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and new.join_code is distinct from old.join_code and new.join_code is not null
     and (select auth.uid()) is not null then
    raise exception 'a join code is drawn by the database: set it to null for a new one' using errcode = '42501';
  end if;
  if new.join_code is null then
    loop
      new.join_code := private.new_join_code();
      exit when not exists (select 1 from public.companies where join_code = new.join_code);
    end loop;
  end if;
  if new.document_path is not null and new.document_path not like new.owner_id::text || '/%' then
    raise exception 'the document must be in the company''s own folder' using errcode = '42501';
  end if;
  new.updated_at := now();
  return new;
end;
$$;
revoke execute on function private.guard_company() from public, anon, authenticated;

create trigger companies_guard
  before insert or update on public.companies
  for each row execute function private.guard_company();

-- ─── mentors and coordinators ───────────────────────────────────────────────────────────────
create table public.mentors (
  id          uuid primary key references public.profiles (id) on delete cascade,
  company_id  uuid not null references public.companies (id) on delete cascade,
  job_title   text not null default '' check (char_length(job_title) <= 80),
  created_at  timestamptz not null default now()
);
comment on table public.mentors is 'A mentor and the company they joined with its code. The company can remove them.';

create table public.coordinators (
  id          uuid primary key references public.profiles (id) on delete cascade,
  faculty     text not null default '' check (char_length(faculty) <= 120),
  created_at  timestamptz not null default now()
);
comment on table public.coordinators is 'A university coordinator''s details. Approved through profiles.status.';

-- Who the caller is to a company, read past RLS (so companies' and mentors' policies never query
-- each other in a loop). Policies need EXECUTE, not schema usage.
create function private.owned_company_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id from public.companies where owner_id = (select auth.uid());
$$;
create function private.mentor_company_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select company_id from public.mentors where id = (select auth.uid());
$$;
revoke execute on function private.owned_company_id(), private.mentor_company_id() from public, anon;
grant execute on function private.owned_company_id(), private.mentor_company_id() to authenticated;

revoke all on table public.companies, public.mentors, public.coordinators from anon, authenticated;
grant select on public.companies, public.mentors, public.coordinators to authenticated;
grant update (name, ssm_no, website, document_path, join_code) on public.companies to authenticated;
grant update (job_title) on public.mentors to authenticated;
grant delete on public.mentors to authenticated;
grant update (faculty) on public.coordinators to authenticated;
grant all on public.companies, public.mentors, public.coordinators to service_role;

alter table public.companies enable row level security;
alter table public.mentors enable row level security;
alter table public.coordinators enable row level security;

create policy "companies: owner, its mentors or admin reads"
  on public.companies for select
  to authenticated
  using (owner_id = (select auth.uid()) or id = (select private.mentor_company_id()) or (select private.is_admin()));

create policy "companies: owner updates own"
  on public.companies for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "mentors: self, own company or admin reads"
  on public.mentors for select
  to authenticated
  using (id = (select auth.uid()) or company_id = (select private.owned_company_id()) or (select private.is_admin()));

create policy "mentors: self updates own title"
  on public.mentors for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "mentors: own company or admin removes"
  on public.mentors for delete
  to authenticated
  using (company_id = (select private.owned_company_id()) or (select private.is_admin()));

create policy "coordinators: self or admin reads"
  on public.coordinators for select
  to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

create policy "coordinators: self updates own"
  on public.coordinators for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- A company sees its mentors' names.
create policy "profiles: a company reads its mentors"
  on public.profiles for select
  to authenticated
  using (id in (select m.id from public.mentors m where m.company_id = (select private.owned_company_id())));

-- ─── sign-up: now also coordinators (pending) and mentors (with an approved company's code) ──
-- Metadata, read once here: full_name, role, then per role — student: job_role_id, programme_id,
-- year, used_skill_ids · company: company_name, ssm_no, website · mentor: join_code, job_title ·
-- coordinator: faculty. A wrong join code or bad company details fail the sign-up (the portal
-- checks first, so a student never sees that).
create or replace function private.handle_new_user()
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
  v_code text := upper(regexp_replace(coalesce(v_meta ->> 'join_code', ''), '[^A-Za-z0-9]', '', 'g'));
  v_company uuid;
  v_website text := nullif(trim(coalesce(v_meta ->> 'website', '')), '');
begin
  v_role := case coalesce(v_meta ->> 'role', 'student')
    when 'student' then 'student'::public.user_role
    when 'company' then 'company'::public.user_role
    when 'mentor' then 'mentor'::public.user_role
    when 'coordinator' then 'coordinator'::public.user_role
  end;
  if v_role is null then
    raise exception 'sign-up cannot choose the role %', v_meta ->> 'role' using errcode = '42501';
  end if;
  if v_name = '' then v_name := left(nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 80); end if;

  if v_role = 'mentor' then
    select c.id into v_company
    from public.companies c join public.profiles o on o.id = c.owner_id
    where char_length(v_code) = 8 and c.join_code = left(v_code, 4) || '-' || right(v_code, 4) and o.status = 'active';
    if v_company is null then
      raise exception 'that join code isn''t valid' using errcode = '22023';
    end if;
  end if;

  insert into public.profiles (id, role, status, full_name, email)
  values (
    new.id, v_role,
    case when v_role in ('student', 'mentor') then 'active' else 'pending' end::public.account_status,
    coalesce(v_name, 'New user'), new.email
  );

  if v_role = 'student' then
    insert into public.student_profiles (id, job_role_id, programme_id, year, used_skill_ids)
    values (
      new.id,
      (select id from public.job_roles where id = v_meta ->> 'job_role_id'),
      (select id from public.programmes where id = v_meta ->> 'programme_id'),
      case when v_meta ->> 'year' ~ '^[1-4]$' then (v_meta ->> 'year')::smallint end,
      array(select s.id from public.skills s where s.id in (select jsonb_array_elements_text(v_used)) order by s.id)
    );
  elsif v_role = 'company' then
    insert into public.companies (owner_id, name, ssm_no, website)
    values (
      new.id,
      left(trim(coalesce(nullif(v_meta ->> 'company_name', ''), v_name, '')), 120),
      upper(regexp_replace(coalesce(v_meta ->> 'ssm_no', ''), '[[:space:]]', '', 'g')),
      case when v_website is null or v_website ~* '^https?://' then v_website else 'https://' || v_website end
    );
  elsif v_role = 'mentor' then
    insert into public.mentors (id, company_id, job_title)
    values (new.id, v_company, left(trim(coalesce(v_meta ->> 'job_title', '')), 80));
  elsif v_role = 'coordinator' then
    insert into public.coordinators (id, faculty)
    values (new.id, left(trim(coalesce(v_meta ->> 'faculty', '')), 120));
  end if;
  return new;
end;
$$;
revoke execute on function private.handle_new_user() from public, anon, authenticated;

-- ─── storage: company documents (SSM certificate), private ──────────────────────────────────
-- A company uploads into its own folder (<its user id>/…); it and the admins read them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('company-documents', 'company-documents', false, 5242880, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "company documents: the company uploads into its folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'company-documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select private.owned_company_id()) is not null
  );

create policy "company documents: the company or an admin reads"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'company-documents'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select private.is_admin()))
  );

create policy "company documents: the company replaces its own"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'company-documents' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'company-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "company documents: the company deletes its own"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'company-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);
