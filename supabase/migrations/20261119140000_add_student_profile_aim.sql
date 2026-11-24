alter table public.student_profiles
  add column aim text check (aim in ('internship', 'first_job', 'freelance'));

grant update (aim) on public.student_profiles to authenticated;