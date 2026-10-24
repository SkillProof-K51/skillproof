# SkillProof

> An AI-Assisted Skill Verification and Talent Matching Platform

BITU3923 Workshop II · Group K51 · Track 1: Future Workforce & AI Talent · Supervisor: Ts. Dr. Farah Nadia Azman

Students prove IT skills in two steps — **Practised** (checked challenges) and **Verified** (a mentor rates real micro-project work) — and show them on a shareable Skill Passport. Companies post opportunities and see verified students; universities see which skills their courses miss.

## Modules
| # | Module | Owner |
|---|---|---|
| 1 | Industry Standards & Curriculum Alignment | Iskandar |
| 2 | Profile, Skill Gap & AI Matching | Insyirah |
| 3 | AI Skill Challenges | Azim |
| 4 | Micro-Projects & Mentor Verification | Fiona |
| 5 | Skill Passport & Talent Analytics | Azim |

## Run it locally
Needs **Node.js 24 LTS or newer** and **pnpm** (`corepack enable` gives you pnpm).

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local       # fill in the Supabase values
cp apps/mobile/.env.example apps/mobile/.env
pnpm dev:web        # → http://localhost:3000
pnpm dev:mobile     # → scan the QR code with Expo Go
pnpm check          # lint + typecheck + build, same as CI
```

## Working here
- New here? **[`CONTRIBUTING.md`](CONTRIBUTING.md)** — setup, the branch → PR loop, and your first (warm-up) PR, step by step.
- Starting your module? **[`docs/start-here.md`](docs/start-here.md)** — the checklist, how every feature is built, your first task · prompts for your AI tool: [`docs/prompts.md`](docs/prompts.md).
- **[`AGENTS.md`](AGENTS.md)** — the rules, for people and AI tools alike.
- One branch per task, one PR per change, the module owner approves. The PR template asks you to explain your code.
- AI use goes in [`docs/ai-use-log.md`](docs/ai-use-log.md).

## Stack
Expo SDK 58 (mobile) · Next.js 16 (web) · Supabase (Postgres, Auth, Storage, RLS) · Gemini API (server-side) · TypeScript · pnpm
