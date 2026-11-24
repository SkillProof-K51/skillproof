-- Demo catalogue for the shared core. Safe to run again (existing rows are left alone).
-- Placeholders, marked so nobody mistakes them for findings:
--   · weights: Module 1 (Iskandar) replaces them with counts from the job-ad sheet;
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
  ('testing', 'Testing')
on conflict (id) do nothing;

insert into public.job_roles (id, name, description) values
  ('web', 'Web Developer', 'Front end, back end, or both'),
  ('data', 'Data Analyst', 'Queries, numbers and charts'),
  ('mobile', 'Mobile Developer', 'Apps for phones'),
  ('qa', 'QA Engineer', 'Testing that software works')
on conflict (id) do nothing;

-- position = order on the roadmap; weight = placeholder share of Readiness % (each role sums to 100)
insert into public.job_role_skills (job_role_id, skill_id, position, weight) values
  ('web', 'html_css', 1, 20), ('web', 'javascript', 2, 25), ('web', 'git', 3, 10),
  ('web', 'react', 4, 20), ('web', 'typescript', 5, 15), ('web', 'nodejs', 6, 10),
  ('data', 'sql', 1, 35), ('data', 'python', 2, 30), ('data', 'data_vis', 3, 20), ('data', 'git', 4, 15),
  ('mobile', 'javascript', 1, 25), ('mobile', 'typescript', 2, 20), ('mobile', 'react', 3, 30),
  ('mobile', 'git', 4, 10), ('mobile', 'testing', 5, 15),
  ('qa', 'testing', 1, 40), ('qa', 'javascript', 2, 25), ('qa', 'sql', 3, 20), ('qa', 'git', 4, 15)
on conflict (job_role_id, skill_id) do nothing;
