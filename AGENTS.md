# SkillProof — rules for every coding agent (Claude Code, Codex, Gemini, ChatGPT, Copilot, Cursor)

BITU3923 Workshop II · Group K51 · Supervisor: Ts. Dr. Farah Nadia Azman.
Read `docs/spec.md` (what we build, by module) before writing code. `docs/progress.md` says what is done and what is next — update it when you finish a step.

## Stack (fixed — agreed by the team and approved by the supervisor; don't swap)
- **Mobile app (students)**: Expo SDK 58 (React Native 0.88) + TypeScript → `apps/mobile` — the SDK the App Store / Play Store Expo Go runs; when Expo Go moves to the next SDK, one upgrade PR follows (`npx expo install expo@^<n> --fix`)
- **Design system**: `packages/tokens` (`@skillproof/tokens` — colours, type, spacing) + the UI kit in `apps/mobile/components/ui` → how to use them: `docs/ui.md`. **The code is the design source of truth**; the Figma file was the starting sketch and is no longer updated — don't copy values from it.
- **Web portal (companies, mentors, university coordinators, admin)**: Next.js 16 App Router + TypeScript + Tailwind CSS 4 → `apps/web`
- **Backend**: one Supabase project — Postgres, Auth, Storage, Row Level Security → `supabase/`
- **AI**: Gemini API (free tier), called from server code only — never from the app with a key
- **Package manager**: pnpm workspaces (`node-linker=hoisted` so Expo works). No npm, no yarn, no Java/Spring Boot.

## Folder map
| Path | What |
|---|---|
| `apps/mobile/` | Expo app — `app/` screens, `components/ui/` (the kit), `components/<area>/` (screen parts), `lib/` (data access) |
| `packages/tokens/` | design tokens: edit `src/index.ts`, then `pnpm --filter @skillproof/tokens build` |
| `apps/web/src/` | Next.js — `app/` routes, `components/`, `lib/` (data access, server actions) |
| `supabase/migrations/` | database schema, one file per change, named `YYYYMMDDHHMMSS_<what>.sql` (UTC — branches never clash; `0001`/`0002` stay as they are); `supabase/seed.sql` demo data |
| `docs/` | `spec.md`, `progress.md`, `ui.md`, `ai-use-log.md`, `data-contracts.md` |

## Rules
1. **Auth + owner column + Row Level Security from the first table.** Every table has `owner_id` (or an equivalent) and RLS policies in the same migration. Test every table with two different accounts before merging. Never write with the service-role key from an app.
2. **Scores and money as integers** (percent as 0–100 integer, money in sen). Each calculation lives in one place — the fit engine (Readiness %, Fit %), the challenge scorer, the shortage report — and the screens only display the result.
3. **Shared form components; screens ≲ 300 lines; all data access in `lib/`.** No Supabase calls inside screen components.
4. **Mocks only behind an env flag with a visible "TEST MODE" label.** An AI-grading or AI-review mock must never look real.
5. **No keys or secrets in code — not even as a fallback.** Names go in `.env.example`, values in `.env.local` / `.env` (gitignored). `NEXT_PUBLIC_*` and `EXPO_PUBLIC_*` ship to the client, so only the Supabase URL and publishable key go there. Gemini and service-role keys stay server-side.
6. **Each member owns their module** (M1 Iskandar · M2 Insyirah · M3 Azim · M4 Fiona · M5 Azim). Changes to the shared core (users, skills, skill status) or to another module go through a PR the owner approves.
7. **Skill status moves one way**: `not_yet → practised → verified`. Only Module 3 writes `practised`, only Module 4 writes `verified`; Modules 2 and 5 read.
8. **Every PR explains its own code** (the template asks). You will be asked about it at every presentation — if you can't explain a change, don't merge it.
9. **Log material AI use** in `docs/ai-use-log.md` — one line per session: who, tool, what for, what you checked. Form F of our proposal promises this log.
10. **Before saying "done"**: `pnpm check` (lint + typecheck + build) passes and you ran the screen on a device or in the browser. Small commits; `main` always runs.
11. **Never "reset" the database by renaming files or dropping tables in prod.** Write a new migration. Show sync/save failures in the UI, never swallow them.
12. **Fictional people only** in seed data and screenshots (our persona is Aina Sofea). No real names, matric numbers or phone numbers.
13. **UI goes through the kit — never hard-code a look.** Screens compose components from `components/ui` and values from `@skillproof/tokens`. No hex/rgb colours, font names or raw sizes (margin, padding, gap, top/left…, width/height, radius, font size) in screens or components; a size that belongs to one component is a named constant at the top of that file. A new look = change the token or the component, never one screen. `pnpm lint` fails on violations. Read `docs/ui.md` before building a screen.
