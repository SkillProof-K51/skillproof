# Start here: before you build your module

For **Insyirah (M2), Fiona (M4) and Iskandar (M1)**, and for the AI tool you code with. Read it once, top to bottom (about 10 minutes). It tells you what must be ready before you start, how every feature here is built, and your first task.

How to use git and GitHub is in [`CONTRIBUTING.md`](../CONTRIBUTING.md). The rules are in [`AGENTS.md`](../AGENTS.md). Prompts to paste into your AI tool are in [`prompts.md`](prompts.md).

---

## 0. Where the project is (27 Oct)

**Built, on demo data** (open them at `localhost:8081/kit` → Reference screens):
- The UI kit (`apps/mobile/components/ui`) in the new look: lavender pages, white cards, black pill buttons, Sofia Sans.
- Reference screens to copy from: Welcome, the 12-screen onboarding, Sign up, Log in, Challenges, a challenge's page, Result, Skill Passport, Progress.
- Expo SDK 58: the app opens in the **Expo Go** you get from the App Store or Play Store today.

**On `main` since 25 Oct** (PR #4): the reference screens, the new look and SDK 58. Pull `main` before you start a branch and you have them, so screens in `apps/mobile` can be built now, on demo data.

**Not built yet** (Azim, weeks 6–7): signing in, the `profiles` / `skills` / `student_skills` tables, and the **web portal** (its layout, menu and components). Until they exist:
- the mobile app runs on **demo data behind TEST MODE**, which is how every reference screen works;
- web pages (M1, and M4's mentor side) wait for the portal. Plan and prepare them, but don't build them yet. The one exception is your warm-up page.

---

## 1. Before you start

### What you need (accounts and apps)

| What | Who | When | Notes |
|---|---|---|---|
| GitHub account with the repo invite accepted | everyone | now | all four of us are in |
| Git · Node.js 24 LTS (`corepack enable` gives you pnpm) · VS Code | everyone | now | [CONTRIBUTING › One-time setup](../CONTRIBUTING.md#one-time-setup-about-20-minutes). On Windows, run `corepack enable` in a terminal opened **as administrator** |
| **Expo Go** on your phone, from the App Store / Play Store | anyone opening the app on a phone | now | It runs SDK 58, the same as our app. No phone? Press `w` and use the browser; that's enough for most work |
| **A free Expo account** ([expo.dev](https://expo.dev/signup)) | iPhone users | now | On an iPhone, Expo Go only opens the project when it and your laptop are signed in to the **same** account: run `npx expo login` on the laptop, then sign in inside Expo Go (top-right icon) |
| Phone and laptop on the **same Wi-Fi** | phone users | now | Campus Wi-Fi often blocks this. Then `cd apps/mobile` → `npx expo start --tunnel` (say yes if it offers to install `@expo/ngrok`), or use your phone's hotspot |
| Google Drive: `05 Team Shared` | everyone | now | Iskandar's job-ad sheet goes there |
| A **Gemini API key** of your own ([Google AI Studio](https://aistudio.google.com/apikey), free tier) | M2, M4 (the AI features) | weeks 7–11 | Server-side only: `apps/web/.env.local` → `GEMINI_API_KEY`. Never in the app, a commit or a prompt |
| An AI coding tool | optional | any time | [`prompts.md`](prompts.md) |

**Not needed:** a Supabase account (Azim applies every migration; anyone invited to the Supabase project can read its secret key, so access stays with him), the Supabase values to run on demo data (paste them when Azim says a screen reads real data), Android Studio, Xcode, Docker, anything paid.

### Checklist

- [ ] **Setup works** ([CONTRIBUTING › One-time setup](../CONTRIBUTING.md#one-time-setup-about-20-minutes)). `pnpm dev:mobile` runs and the app opens: scan the QR code with Expo Go, or press `w` to open it in the browser at `localhost:8081`. You should see the yellow **TEST MODE** strip.
- [ ] **Your warm-up PR is merged** ([CONTRIBUTING › Your first PR](../CONTRIBUTING.md#your-first-pr-the-warm-up-do-this-before-any-module-work)). Name your migration with the UTC date and time: `YYYYMMDDHHMMSS_warmup_<yourname>.sql`.
- [ ] **You've read** [`AGENTS.md`](../AGENTS.md) (13 rules), your module's row in [`docs/spec.md`](spec.md), and [`docs/ui.md`](ui.md) (how a screen is built).
- [ ] **You've tapped through** `/kit`: every component and every reference screen.
- [ ] **Your AI tool knows the project.** Repo tools (Codex, Claude Code, Gemini CLI, Copilot, Cursor) read `AGENTS.md` by themselves. Chat tools (ChatGPT, Gemini, DeepSeek) need [Prompt 0](prompts.md#prompt-0--project-context-chat-tools-only) pasted first.
- [ ] **You can say in one sentence each:** which tables are yours, which calculation or report is yours, what you read from other modules, and what you write.

---

## 2. How every feature is built here (the same five steps)

| # | Step | Where | Copy this |
|---|---|---|---|
| 1 | **The table**: owner column + Row Level Security in the **same** migration (rule 1) | `supabase/migrations/YYYYMMDDHHMMSS_<what>.sql` | `0001_warmup_notes.sql` |
| 2 | **The data**: types + a `get…()` that returns demo data in TEST MODE (Supabase later). A save that isn't built yet **throws a clear error**, never pretends (rule 11) | `apps/mobile/lib/<area>.ts` + `lib/demo/<area>.ts` | `lib/passport.ts`, `lib/demo/passport.ts` |
| 3 | **The calculation**: one function, integers (percent 0–100), in `lib/`. Screens only show its result (rule 2) | `apps/mobile/lib/` | `practiceTotal()` in `lib/progress.ts` |
| 4 | **The screen**: built only from kit components and tokens (no colours, fonts or sizes typed by hand; `pnpm lint` fails). Under ~300 lines; its parts go in `components/<area>/` | `apps/mobile/app/…` | the closest reference screen ([table in ui.md](ui.md#reference-screens--start-from-one-of-these)) |
| 5 | **The PR**: `pnpm check` green, run it in the browser or on your phone, screenshot, fill the template, explain the code **in your own words**, add a line to `docs/ai-use-log.md` | GitHub | [CONTRIBUTING › The loop](../CONTRIBUTING.md#the-loop-every-task) |

Fictional people only in demo data (our student is **Aina Sofea**). Never a real name, matric number or phone number (rule 12).

---

## 3. Your first task (after your warm-up)

Each one is small, runs on demo data, and doesn't wait for the shared core.

### Insyirah: Module 2 (Profile, Skill Gap & AI Matching)
1. **Fix PR #3** as the review asks, then it gets merged.
2. **The fit engine: one function, no screen.** Write `apps/mobile/lib/fitEngine.ts` with `readiness(skills, weights)` → integer 0–100: Σ weight × (Verified 1 · Practised 0.5 · Not yet 0) ÷ Σ weight ([spec](spec.md)). Add `isReady()` (≥ 70). Add five worked examples as comments, one of them Aina's demo skills (3 Verified, 2 Practised, Node.js not yet; equal weights give 67). This is your graded calculation; Home's and Progress's demo numbers get replaced by it.
3. **Your Profile tab on demo data**, once the new kit is on `main`: Aina's name, programme and year, target role, and her roadmap skills with their status. Copy the Progress screen (`app/progress.tsx`).
4. **Decide with Azim**: the onboarding asks "What are you aiming for?" (an internship, a first job, freelance projects). Should your `profiles` table store it?

### Fiona: Module 4 (Micro-Projects & Mentor Verification)
1. **Warm-up PR by Wed 28 Oct.**
2. **Your tables, as a draft PR**: `micro_projects` and `applications`, each with an owner and RLS. Students read open projects, a mentor manages their own, a student sees only their own applications. Azim checks it against the shared core before it's applied.
3. **The verification score: one function** in `lib/`: the mentor's rubric → Verified (≥ 3 of 5, [spec](spec.md)) or Revise. That's your graded calculation.
4. **The Projects tab on demo data**, once the new kit is on `main`: the list (Home's project cards: `components/home/ProjectCard.tsx`, data in `lib/demo/home.ts`) and a project's own page. Copy a challenge's page (`app/challenges/[id].tsx`): what it is, the skills it needs, Fit %, and Apply pinned at the bottom, locked until those skills are Practised.
5. **With Azim**: how many micro-projects at launch. The mentor pages on the web wait for the portal.

### Iskandar: Module 1 (Industry Standards & Curriculum Alignment)
1. **Warm-up PR by Wed 28 Oct.** Your screen goes in `apps/web` (a page).
2. **Data, no code yet.** For each of our four roles (Web Developer, Data Analyst, Mobile Developer, QA Engineer), collect 20+ real job ads (JobStreet, LinkedIn, Hiredly) and count how often each skill appears. Put it in a sheet in `05 Team Shared`. **These counts become the skill weights** that everyone's Readiness % uses, so the whole app depends on them.
3. **Course ↔ skill map**: map 3–4 FTMK courses to the skills they teach. Your curriculum gap report comes from this.
4. **Plan your web pages** (roles, skills, weights, the gap report) on paper. You build them once the portal is in.

---

## 4. Five rules you will be asked about

1. **Skill status only moves forward**: Not yet → Practised → Verified. Only Module 3 writes Practised, only Module 4 writes Verified. Modules 2 and 5 only read it.
2. **Every table has an owner column and RLS in the same migration.** Test it with two different accounts before merging.
3. **No keys in code, ever.** Only the Supabase URL and publishable key may sit in `EXPO_PUBLIC_*` / `NEXT_PUBLIC_*`. Gemini keys stay on the server.
4. **One calculation, one place.** Readiness and Fit % live in M2's fit engine, the verification score in M4, the gap report in M1. Screens never re-calculate.
5. **Explain every line you commit.** If your AI wrote it and you can't explain it, ask it ([Prompt 7](prompts.md#prompt-7--explain-it-to-me)) or rewrite it until you can.

---

## 5. When you're stuck

- **An error you can't fix in 30 minutes** → screenshot it into the group. Nobody minds.
- **The kit doesn't have what you need** → ask Azim. A new look is a kit change, never a one-off on your screen (rule 13).
- **Not sure a file is yours to change** → ask before editing it (rule 6).
- **Your AI suggests Java, Firebase, `npm`, `git push --force` or deleting a table** → stop. That's outside our stack or our rules.
