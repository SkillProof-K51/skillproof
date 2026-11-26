-- Demo catalogue for the shared core. Safe to run again (existing rows are left alone).
-- Weights come from Module 1's job-ad sample (20 ads per role, 26 Nov); how each one is worked out is
-- in migrations/20261126170210_catalogue_from_job_ads.sql. Still a placeholder, marked so nobody
-- mistakes it for a finding:
--   · programmes: the faculty's real list replaces these five.
-- No people here: test accounts are fictional (our persona is Aina Sofea) and are made by signing up.

insert into public.programmes (id, name) values
  ('software', 'Software Development'),
  ('networking', 'Computer Networking'),
  ('security', 'Computer Security'),
  ('media', 'Interactive Media'),
  ('ai', 'Artificial Intelligence')
on conflict (id) do nothing;

insert into public.skills (id, name) values
  ('html_css', 'HTML and CSS'),
  ('javascript', 'JavaScript'),
  ('typescript', 'TypeScript'),
  ('react', 'React'),
  ('nodejs', 'Node.js'),
  ('git', 'Git'),
  ('sql', 'SQL'),
  ('python', 'Python'),
  ('data_vis', 'Data visualisation'),
  ('testing', 'Testing'),
  ('php', 'PHP'),
  ('rest_api', 'REST APIs'),
  ('react_native', 'React Native'),
  ('excel', 'Excel'),
  ('test_automation', 'Test automation')
on conflict (id) do nothing;

insert into public.job_roles (id, name, description) values
  ('web', 'Web Developer', 'Front end, back end, or both'),
  ('data', 'Data Analyst', 'Queries, numbers and charts'),
  ('mobile', 'Mobile Developer', 'Apps for phones'),
  ('qa', 'QA Engineer', 'Testing that software works')
on conflict (id) do nothing;

-- position = order on the roadmap; weight = share of Readiness % from the job-ad counts (each role sums to 100)
insert into public.job_role_skills (job_role_id, skill_id, position, weight) values
  ('web', 'html_css', 1, 25), ('web', 'javascript', 2, 20), ('web', 'sql', 3, 15),
  ('web', 'php', 4, 15), ('web', 'rest_api', 5, 17), ('web', 'react', 6, 8),
  ('data', 'excel', 1, 24), ('data', 'sql', 2, 25), ('data', 'data_vis', 3, 35), ('data', 'python', 4, 16),
  ('mobile', 'git', 1, 25), ('mobile', 'react_native', 2, 20), ('mobile', 'rest_api', 3, 35), ('mobile', 'testing', 4, 20),
  ('qa', 'testing', 1, 32), ('qa', 'sql', 2, 13), ('qa', 'javascript', 3, 8),
  ('qa', 'test_automation', 4, 26), ('qa', 'rest_api', 5, 21)
on conflict (job_role_id, skill_id) do nothing;
