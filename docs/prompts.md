# Prompts for your AI tool

Copy, fill in the `<…>` parts, paste. Read [`start-here.md`](start-here.md) first.

- **Tools that read the repo** (Codex, Claude Code, Gemini CLI, Copilot agent, Cursor) read `AGENTS.md` by themselves. Start at Prompt 1.
- **Chat tools** (ChatGPT, Gemini, DeepSeek) can't see our files. Paste **Prompt 0** first in every new chat, then paste the files a prompt names. They never guess them right.
- Whatever it writes, **read the Changes list before you commit** and undo anything outside your task.

---

## Prompt 0 — project context (chat tools only)

```
You're helping me build my module of SkillProof, a university team project
(UTeM BITU3923 Workshop II): students prove tech skills with short challenges and
mentor-reviewed micro-projects, and share them in a Skill Passport.

Stack (fixed, never suggest anything else): Expo SDK 58 + React Native +
TypeScript for the student app (apps/mobile) · Next.js 16 App Router + TypeScript
+ Tailwind CSS 4 for the web portal (apps/web) · Supabase (Postgres, Auth,
Storage, Row Level Security) · Gemini API called from server code only · pnpm.
No Java, Spring Boot, Firebase, npm or yarn.

Rules you must follow:
1. Every table has an owner column and Row Level Security policies in the SAME
   migration. Migrations live in supabase/migrations, named
   YYYYMMDDHHMMSS_<what>.sql (UTC). Never rename or drop tables: write a new migration.
2. Scores are integers (percent 0-100, money in sen). Each calculation is ONE
   function in lib/; screens only display its result.
3. All data access goes through lib/ (apps/mobile/lib/<area>.ts). No Supabase
   calls in screens. Screens stay under ~300 lines; parts go in components/<area>/.
4. Demo data only behind EXPO_PUBLIC_TEST_MODE (lib/demo/<area>.ts), with the
   visible TEST MODE label. A save that isn't built yet throws a clear error.
5. No keys or secrets in code, not even as a fallback.
6. I only change my own module's files.
7. Skill status only moves not_yet -> practised -> verified. Only Module 3
   writes practised, only Module 4 writes verified.
8. Fictional people only (our demo student is Aina Sofea).
9. UI only through our kit: components from apps/mobile/components/ui and values
   from @skillproof/tokens. Never type a hex colour, font name or raw size
   (margin, padding, width, font size...) in a screen; lint fails if I do.

When you need a file (AGENTS.md, docs/ui.md, a component, a reference screen),
ASK me to paste it. Never invent a component or its props. Explain what you
write in plain English so I can explain it myself at our presentation.
```

---

## Prompt 1 — plan before any code

```
Read AGENTS.md, docs/start-here.md, docs/spec.md (Module <N>), docs/ui.md and
docs/progress.md. I'm <name>, owner of Module <N>. My task: <the task from
start-here.md, in your words>.

Before writing any code, give me:
- the files you'll create or change (only my module, its lib/ files, migrations),
- the tables, columns and RLS policies (who can read and write what),
- the demo data you'll add for TEST MODE,
- which reference screen you'll copy, and why,
- anything unclear: ask me instead of guessing.
Don't write code until I say "go".
```

## Prompt 2 — a table

```
Write a Supabase migration for <tables and their columns>. Follow
supabase/migrations/0001_warmup_notes.sql exactly: an owner column referencing
auth.users, RLS enabled, and the policies in the same file. Who can do what:
<e.g. "students read open projects; a mentor creates and edits only their own;
a student sees only their own applications">. Name it
YYYYMMDDHHMMSS_<what>.sql with the current UTC time. Under each policy, add
one comment line in plain English saying what it allows.
```

## Prompt 3 — the data, with demo data

```
Create apps/mobile/lib/<area>.ts the way lib/passport.ts is written: the
TypeScript types, a get<Thing>() that returns demo data from
lib/demo/<area>.ts when isTestMode and null otherwise (with a TODO for
Supabase), and any save function that throws a clear "arrives with Module <N>"
error until the backend exists. Demo data: fictional only, the student is Aina
Sofea, and it must agree with the numbers other screens already show.
```

## Prompt 4 — a calculation

```
Write <the calculation, e.g. readiness(skills, weights)> as ONE pure function
in apps/mobile/lib/<file>.ts. Inputs: <…>. Output: an integer 0-100. Rule:
<the formula from docs/spec.md>. No screen code in it. Under it, write five
worked examples (input -> output) as comments, including an empty list and a
case at the exact threshold.
```

## Prompt 5 — a screen from the kit

```
Build <the screen> in apps/mobile/app/<path>.tsx by copying the pattern of
<reference screen, e.g. app/progress.tsx>. Use only components exported from
components/ui and values from @skillproof/tokens: no hex colours, font names or
raw sizes. Data only through lib/<area>.ts. Put screen parts in
components/<area>/. Keep the screen under 300 lines. It must show the demo data
in TEST MODE and an EmptyState when there's no data.
```

## Prompt 6 — check before the PR

```
Review the changes on my branch against AGENTS.md. List every rule I broke
(secrets, RLS, kit, files outside my module, skill status writes, real
people's data), anything risky, and anything a lecturer might ask me about
that I may not understand. Then run `pnpm check` and fix only errors in MY
files. Don't touch other modules.
```

## Prompt 7 — explain it to me

```
Explain <file> to me line by line, as if I had to defend it to a lecturer:
what each part does, why it's written this way, and what breaks if I remove
it. Then ask me three questions about it and tell me if my answers are right.
```

## Prompt 8 — the PR description

```
Draft my pull request from .github/PULL_REQUEST_TEMPLATE.md, based on the diff
of this branch, in simple first-person English. In "Explain the code", give
bullet points only; I'll rewrite them in my own words. Leave the device and
screenshot boxes for me to fill in.
```
