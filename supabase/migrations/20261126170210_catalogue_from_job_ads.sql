-- The skill catalogue and role weights, now from Module 1's job-ad sample (Iskandar, 26 Nov:
-- 20 Malaysian ads per role on JobStreet/LinkedIn, sheets in Drive `05 Team Shared/Job-ad spreadsheet`).
--
-- How a weight is worked out: each ad counts once for a skill if it names the skill (or one of the
-- terms listed for it below). Per role, the top skills are kept and
--   weight = ads naming the skill ÷ the role's total across those skills × 100,
-- rounded so the role adds up to exactly 100 (the leftover points go to the largest fractions).
--
--   role    skill (ads of 20 → weight)
--   web     HTML and CSS 16 → 25 · JavaScript 13 → 20 · REST APIs 11 → 17 · PHP 10 → 15 · SQL 10 → 15 · React 5 → 8
--   data    Data visualisation 19 → 35 · SQL 14 → 25 · Excel 13 → 24 · Python 9 → 16
--   mobile  REST APIs 17 → 35 · Git 12 → 25 · React Native 10 → 20 · Testing 10 → 20
--   qa      Testing 20 → 32 · Test automation 16 → 26 · REST APIs (incl. API testing) 13 → 21 · SQL 8 → 13 · JavaScript 5 → 8
--
-- Terms counted per skill: HTML and CSS = HTML, CSS, Sass, Bootstrap, Tailwind, responsive web design,
-- cross-browser · REST APIs = APIs, REST APIs, web services, OpenAPI, SOAP (+ API testing, Postman for QA)
-- · PHP = PHP, Laravel, CodeIgniter · Excel = Excel, formulas, pivot tables, Google Sheets, Power Query, VBA
-- · Data visualisation = data visualization, dashboarding, Power BI, Tableau, Looker · SQL = SQL, MySQL,
-- SQL Server, PostgreSQL, MariaDB, Oracle, relational databases · Test automation = test automation,
-- Selenium, Playwright, Cypress, Appium, test scripting · Testing = test cases, test execution, manual,
-- regression, unit/integration/functional testing · Git = Git, GitHub, GitLab, version control.
-- React and Git tie for Web (5 each); React is kept because the demo projects use it.
--
-- Safe on a fresh database: the weights only go in for roles that already exist (the seed adds the
-- roles and these same weights afterwards), and every insert skips rows that are already there.

insert into public.skills (id, name) values
  ('php', 'PHP'),
  ('rest_api', 'REST APIs'),
  ('react_native', 'React Native'),
  ('excel', 'Excel'),
  ('test_automation', 'Test automation')
on conflict (id) do nothing;

-- Replace the placeholder weights for the four roles. Only these rows change; a role an admin adds
-- later is left alone.
delete from public.job_role_skills where job_role_id in ('web', 'data', 'mobile', 'qa');

insert into public.job_role_skills (job_role_id, skill_id, position, weight)
select v.job_role_id, v.skill_id, v.position, v.weight
from (values
  ('web', 'html_css', 1, 25), ('web', 'javascript', 2, 20), ('web', 'sql', 3, 15),
  ('web', 'php', 4, 15), ('web', 'rest_api', 5, 17), ('web', 'react', 6, 8),
  ('data', 'excel', 1, 24), ('data', 'sql', 2, 25), ('data', 'data_vis', 3, 35), ('data', 'python', 4, 16),
  ('mobile', 'git', 1, 25), ('mobile', 'react_native', 2, 20), ('mobile', 'rest_api', 3, 35), ('mobile', 'testing', 4, 20),
  ('qa', 'testing', 1, 32), ('qa', 'sql', 2, 13), ('qa', 'javascript', 3, 8),
  ('qa', 'test_automation', 4, 26), ('qa', 'rest_api', 5, 21)
) as v (job_role_id, skill_id, position, weight)
join public.job_roles r on r.id = v.job_role_id
on conflict (job_role_id, skill_id) do nothing;
