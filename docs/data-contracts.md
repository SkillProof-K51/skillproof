# Data contracts: the shared core

The tables every module builds on, who reads and writes each one, and how your module's tables
plug in. The schema is `supabase/migrations/20261027083000_shared_core.sql`; the demo catalogue is
`supabase/seed.sql`. Changing a table here = a new migration in a PR its owner approves (rule 6).

## The tables

| Table | Holds | Reads | Writes | Owner |
|---|---|---|---|---|
| `profiles` | one row per account: `role` (student · company · mentor · coordinator · admin), `status` (active · pending · rejected), `full_name` | the user (own row), admin | made at sign-up; the user edits `full_name`; role and status only by an admin | shared core |
| `student_profiles` | a student's `job_role_id`, `programme_id`, `year`, `used_skill_ids` | the student (own row), admin | made at sign-up; the student edits role, programme, year | **M2** from now |
| `programmes` | study programmes (placeholders until the faculty's list) | everyone, signed in or not | admin | shared core |
| `skills` | the skill catalogue; ids are short codes (`javascript`, `html_css`) | everyone | admin | **M1** from now |
| `job_roles` | roles a student works towards (`web`, `data`, `mobile`, `qa`) | everyone | admin | **M1** from now |
| `job_role_skills` | a role's roadmap: `position` (order) and `weight` (integer 1–100) | everyone | admin | **M1** from now |
| `student_skills` | per student per skill: `not_yet → practised → verified`. **No row = not yet** | the student (own rows), admin | **only** M3's function (practised) and M4's function (verified), still to build. The app never writes here | shared core |

"Everyone" includes signed-out visitors: onboarding shows roles and roadmaps before sign-up.

## Rules the database enforces

- **Sign-up** makes the `profiles` row (and `student_profiles` for a student) from what the app sends: `full_name`, `role`, `job_role_id`, `programme_id`, `year`, `used_skill_ids`. Unknown values are dropped. Sign-up can only choose student, company or mentor; companies and mentors start `pending` until an admin approves them.
- **Skill status only moves forward**, and `verified` only after `practised`. The timestamps (`practised_at`, `verified_at`) are set by the database, not by the writer.
- **A skill a student holds can't be deleted** (M1's delete page should say so, not crash).
- Deleting an account deletes its rows everywhere.

## Plugging your module in

- **Point at a student** with `references public.student_profiles (id) on delete cascade`, at any user with `public.profiles (id)`, at a skill with `references public.skills (id)`. Your owner column is still `owner_id … references auth.users (id)` when the row belongs to whoever made it.
- **Admin-only writes** in a policy: `with check ((select private.is_admin()))`.
- **Writing a skill status** (M3, M4): a `security definer` function in the `private` schema that checks the evidence (3 passes ≥ 70 %, or a mentor rating ≥ 3) and then inserts or updates `student_skills`. Ask Azim before you write it.
- **Mobile reads** go in `lib/<area>.ts`: TEST MODE first (`isTestMode` → demo data), else `supabase().from(…)`. Screens load them with `useLoad(getSomething)` (`lib/useLoad.ts`), which gives `data`, `error` and `reload`; examples: `getTargetRoles()` in `lib/auth.ts`, the onboarding screen.
- **Test your table**: add your two-account checks to `scripts/db-check.mjs` (copy a block there) and run `pnpm db:check`. It runs every migration on a throwaway Postgres on your laptop, then the checks, with no Supabase account. CI runs it on every PR.

## Run the app on real data

Real data needs `EXPO_PUBLIC_TEST_MODE=0` and the Supabase URL + publishable key in `apps/mobile/.env` (Azim shares them; they're safe in the app, rule 5). Sign up through onboarding with any email. TEST MODE stays the default for building screens on demo data.
