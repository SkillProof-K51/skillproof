# How we work on GitHub

A short guide for the team. You only need to learn **one loop**. Everything happens inside **VS Code**; the terminal is needed for three commands, and they are all written out below.

> Our repo is **public** until the course ends. Anyone on the internet can read it. That's fine for code, but it makes rule 1 very important.

**New to the project? Read [`docs/start-here.md`](docs/start-here.md) first**: what to have ready, how every feature is built, and your first task. Prompts for your AI tool: [`docs/prompts.md`](docs/prompts.md).

The full rule list (for people and for AI tools) is in [`AGENTS.md`](AGENTS.md). The five that matter most on GitHub:

1. **Never commit secrets.** Keys, passwords, `.env` and `.env.local` stay on your laptop (they are gitignored, so Git will not even offer them). If one slips through, **tell the team straight away**: deleting the file is not enough, the key stays in history and has to be replaced.
2. **Never work on `main`.** Always make a branch first. GitHub blocks direct pushes anyway.
3. **Pull before you start.** Every new task begins with the latest `main`.
4. **Stay in your own module.** Changing someone else's files, or the shared core, goes through a PR that owner approves.
5. **You must be able to explain every line you commit.** The judges question each of us on our own module. If your AI tool wrote it and you don't understand it, ask it to explain, or rewrite it until you do.

---

## One-time setup (about 20 minutes)

1. Accept the GitHub invite (email, or the bell icon on github.com).
2. Install **Git**: Windows → https://git-scm.com/download/win (click Next through it) · macOS → open Terminal, type `git`, accept the prompt to install.
3. Install **Node.js 24 LTS**: https://nodejs.org → then in a terminal run `corepack enable` (this gives you `pnpm`).
4. Install **VS Code** and, when the repo opens, accept the "install recommended extensions" prompt.
5. Tell Git who you are (once, with **your** details):
   ```
   git config --global user.name "Your Name"
   git config --global user.email "the-email-on-your-github-account@example.com"
   ```
6. In VS Code: `Ctrl/⌘ + Shift + P` → **Git: Clone** → paste `https://github.com/SkillProof-K51/skillproof.git` → pick a folder → **Open**. Sign in to GitHub if it asks.
7. In the VS Code terminal (`` Ctrl + ` ``):
   ```
   pnpm install
   cp apps/web/.env.example apps/web/.env.local
   cp apps/mobile/.env.example apps/mobile/.env
   ```
   Ask Azim for the two Supabase values and paste them into both files. Then `pnpm dev:web` (opens http://localhost:3000) and `pnpm dev:mobile` (scan the QR code with Expo Go on your phone). If both run, setup is done.

---

## The loop (every task)

**Where things are in VS Code:** Source Control panel = `Ctrl/⌘ + Shift + G` (branch icon on the left) · current branch name = bottom-left corner.

### 1. Get the latest code
Click the branch name (bottom-left) → choose **main** → in Source Control click **⋯ → Pull**.

### 2. Make a branch for your task
Click the branch name → **Create new branch…** → name it:
```
feat/m4-project-list      (module number + what)
fix/m2-readiness-rounding
```

### 3. Code, then commit often
In Source Control, look at the **Changes** list and **check every file**: is it yours, is it in your module, is there a `.env` file (there must never be)? Click **+** on the files you mean to save, write a short message (`add project list screen`), click **Commit**. Small commits beat one huge one.

### 4. Push and open a Pull Request
**Publish Branch** (first time) or **Sync Changes** (after that). On github.com a yellow bar appears: **Compare & pull request**. Fill in the template. The **"Explain the code"** box is not optional. Add the module owner (or Azim) as **Reviewer**.

### 5. Wait for checks and review
The automatic checks (lint, typecheck, build) run by themselves. **Red ❌ = fix it before anything else**; click it to see why. Run `pnpm check` locally to get the same result before pushing. Review comments: fix on the **same branch**, commit, push; the PR updates itself. Don't open a new PR.

### 6. After the merge
Switch to **main** → **Pull** → back to step 2. Delete the old branch when GitHub offers.

---

## Your first PR: the warm-up (do this before any module work)

One screen + one table. It proves your setup works and teaches the loop while nothing can break.

1. Branch: `feat/warmup-<yourname>`.
2. **One screen** in your module's app: students' modules (M2, M3, M5) → `apps/mobile`; company/mentor/admin modules (M1, M4) → `apps/web`. A heading, a short line of text, one button that shows an alert is enough. Keep it under 50 lines.
3. **One table**: copy `supabase/migrations/0001_warmup_notes.sql` to a new file named with the current UTC date and time, `YYYYMMDDHHMMSS_warmup_<yourname>.sql` (e.g. `20261026093000_warmup_fiona.sql` — the time keeps two people's files from ever clashing), rename the table (`warmup_<yourname>`), change one column. Keep the Row Level Security block exactly as it is: that pattern is rule 1 of `AGENTS.md` and every real table will follow it.
4. `pnpm check` green → commit → push → PR → explain your code in the template → request Azim as reviewer.
5. Azim reviews within a day and merges. Then you're ready for your module.

---

## Using AI tools safely (Codex, Gemini, ChatGPT, DeepSeek, Claude)

AI is allowed and is part of our proposal (form E), but you are responsible for what it produces.

- **Before every commit, read the Changes list.** Agents edit files you didn't ask about, sometimes in other people's modules. Undo anything that isn't your task.
- **Never let it run** `git push --force`, `git reset --hard`, or anything that deletes branches or tables. If it suggests one, stop and ask.
- **Never paste keys or passwords into a prompt.**
- **Our stack is fixed** (`AGENTS.md`). If a tool answers in Java/Spring Boot, Firebase or anything else, tell it: *"We use Expo, Next.js and Supabase with TypeScript."*
- **Log it**: one line per session in `docs/ai-use-log.md`. Form F promises this log, and the lecturers can ask for it.
- **Review your own work first**: ask your tool *"Review my changes on this branch for bugs and explain anything risky,"* then read the answer before you open the PR.

---

## When something goes wrong

**Merge conflict**: VS Code opens the file and marks the clashing parts with **Accept Current / Accept Incoming / Accept Both**. Not 100 % sure which is right? **Stop and ask.** A wrong click silently deletes someone's work.

**"Rejected" when pushing**: someone pushed to the same branch. **⋯ → Pull**, then push again.

**`pnpm install` fails with "minimumReleaseAge"**: a package is less than a day old. Tell Azim; don't change `pnpm-workspace.yaml` yourself.

**Anything else**: screenshot the error and post it in the group. Nobody minds; it's faster than guessing.

---

## Who owns what

| Module | Owner | App | Folder |
|---|---|---|---|
Mobile paths are inside `apps/mobile/`: a tab screen in `app/(tabs)/`, its other screens in `app/<area>/`, their parts in `components/<area>/`, data in `lib/<area>.ts` with demo data in `lib/demo/<area>.ts`.

| Module | Owner | App | Folders |
|---|---|---|---|
| 1 Industry Standards & Curriculum Alignment | Iskandar | web | `apps/web/src/app/(portal)/standards/` (after the portal shell) |
| 2 Profile, Skill Gap & AI Matching | Insyirah | mobile | `app/(tabs)/profile.tsx`, `app/profile/`, `components/profile/`, `lib/profile.ts`, `lib/fitEngine.ts` |
| 3 AI Skill Challenges | Azim | mobile | `app/(tabs)/challenges.tsx`, `app/challenges/`, `components/challenges/`, `lib/challenges.ts` |
| 4 Micro-Projects & Mentor Verification | Fiona | mobile + web | students: `app/(tabs)/projects.tsx`, `app/projects/`, `components/projects/`, `lib/projects.ts` · mentors: `apps/web/src/app/(portal)/projects/` (after the portal shell) |
| 5 Skill Passport & Talent Analytics | Azim | mobile + web | `app/(tabs)/passport.tsx`, `components/passport/`, `lib/passport.ts`, `app/progress.tsx` · `apps/web/src/app/(portal)/analytics/` |
| Shared core (auth, users, skills, status) | Azim | both | `app/(auth)/`, `lib/auth.ts`, `lib/onboarding.ts`, Home, `components/ui/`, `packages/tokens/`, the core tables in `supabase/migrations/` |

Web folder names are still the plan; the first PR that creates a folder fixes its name.
