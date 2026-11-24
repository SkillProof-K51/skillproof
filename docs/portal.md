# The web portal: design and set-up

The portal (`apps/web`) is where companies, mentors, university coordinators and admins work. Students use the app. Designed and approved 28 Oct 2026 (Azim): all four web roles in one shell, mentors join with a company code, coordinators register and wait for approval, shadcn/ui in look A. How to build a page in it: [`ui.md` › The web portal](ui.md#the-web-portal).

## 1. Who gets in, and how

| Account | Registers at | Gives us | Starts as | Approved by | Lands on |
|---|---|---|---|---|---|
| Company | `/register/company` | company name, SSM registration no., website (optional); the SSM document after the first sign-in | pending | admin | `/waiting` → `/company` |
| Mentor | `/register/mentor`, with the company's **join code** | name, job title | active, linked to that company | the company (by giving the code) | `/mentor` |
| Coordinator | `/register/coordinator` | name, faculty | pending | admin | `/waiting` → `/coordinator` |
| Admin | — | — | set once in the SQL editor (`update profiles set role = 'admin' where …`) | — | `/admin/approvals` |
| Student | the app | — | — | — | `/students` ("the app is yours") |

- **Join codes** (`XXXX-XXXX`, 32 characters that can't be misread) are drawn by the database. A company draws a new one on its page; the old one stops working; mentors already linked stay. A code only works once its company is approved.
- **Approval**: only an *active admin* can change an account's status or role through the API, and a role only moves between coordinator and admin. The database enforces both, so the portal never needs Supabase's secret key.
- **The SSM document** is uploaded on the waiting page (not at sign-up), so it still works when email confirmation is on and there's no session yet. It goes into the private `company-documents` bucket, in the company's own folder; only the company and admins can read it (the admin's link lasts one minute).

## 2. Pages

| Route | Who | What | Built by |
|---|---|---|---|
| `/sign-in`, `/register/*`, `/forgot-password`, `/reset-password` | anyone | sign in, register, reset a password (the app's reset link opens here too) | shared core |
| `/waiting` | a waiting / rejected company or coordinator | the status; a company uploads its document | shared core |
| `/admin/approvals` | admin | companies and coordinators waiting: view the document, approve, reject | shared core |
| `/company` | company | join code, mentors, details | shared core |
| `/mentor`, `/coordinator` | mentor, coordinator | home | shared core |
| `/admin/skills`, `/admin/roles`, `/coordinator/course-maps`, `/reports/curriculum-gap` | admin, coordinator | **placeholders** | Module 1 · Iskandar |
| `/company/micro-projects`, `/mentor/micro-projects` | company, mentor | **placeholders** | Module 4 · Fiona |
| `/reports/skill-shortage` | admin, coordinator | **placeholder** | Module 5 · Azim |
| `/admin/programmes` | admin | **placeholder**: the faculty's real list | shared core |
| `/kit` | anyone (dev) | every component, live | — |

## 3. Database

`supabase/migrations/20261027201000_portal_accounts.sql`: `companies`, `mentors`, `coordinators`, `profiles.email`, the approval guard, sign-up for coordinators and mentors, the documents bucket. Who reads and writes what: [`data-contracts.md`](data-contracts.md). Every rule is tried offline by `pnpm db:check` (96 checks).

## 4. How it's built

- `src/proxy.ts` keeps the Supabase session cookie fresh (and never cacheable). It doesn't decide access.
- `src/lib/account.ts`: `getAccount()` (who is signed in), `homeFor()` (where they land), `requireAccount(roles)` at the top of every page and action.
- `src/lib/auth-actions.ts` (server actions) + `src/lib/auth-rules.ts` (the rules and their messages); forms share `FormField`, `FormMessage`, `SubmitButton`.
- `/auth/callback` (a page) finishes Supabase's default email links: `?code=` when the portal asked, the tokens after `#` when the app asked (only the browser can read those). `/auth/confirm` (a route) takes token-hash links, for when our own templates are in (§5).
- **TEST MODE** (`NEXT_PUBLIC_TEST_MODE=1`): demo accounts and data in `src/lib/demo/`, the yellow strip with the view switcher. Nothing touches Supabase.
- No Cache Components: every page depends on who's signed in, and with it on each session read needs a `<Suspense>` boundary or the build fails.

## 5. Supabase settings (Azim, in the dashboard)

1. **Authentication → URL Configuration → Site URL**: `http://localhost:3000` for now; the Vercel address once the portal is online.
2. Same page, **Redirect URLs**: add `http://localhost:3000/**` (later the Vercel address + `/**` too). Reset links land on `/auth/callback`, so it must be allowed. The app finds the portal through `EXPO_PUBLIC_PORTAL_URL`.
3. **Before the Progress III demo: our own email sender (custom SMTP).** Supabase's built-in email only reaches people on the project's team, at most 2 emails an hour, and isn't meant for real use: companies, mentors and students wouldn't get their reset or confirmation emails. A free sender (Brevo, or a Gmail app password) goes in Authentication → Emails → SMTP Settings; then turn **Confirm email** back on. Custom SMTP also unlocks the email templates, which can then use the token-hash links (they work whichever device asked):
   - Reset Password: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password`
   - Confirm signup: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/`

## 6. Not yet

The module pages above (their owners) · putting the portal online (Vercel, before Progress III) · dark mode · an admin page to promote a coordinator (SQL editor until then) · editing programmes.
