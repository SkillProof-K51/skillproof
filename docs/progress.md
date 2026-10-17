# Progress

Update this when you finish a step. Newest at the top of each list.

## Done
- 2026-10-17 — UI kit foundation (branch `feat/ui-kit-foundation`): Expo SDK 57 (store Expo Go), Expo Router with the 5 module tabs, `packages/tokens` (`@skillproof/tokens`, mirrored from the Figma variables, `tokens.css` for the web), 17 components in `apps/mobile/components/ui`, mascot poses, Home as the proof screen behind `EXPO_PUBLIC_TEST_MODE`. Awaiting Azim's on-device review.
- 2026-10-16 — Proposal submitted on ulearn, recommended by Dr. Farah.
- 2026-10-16 — Repo scaffolded: pnpm workspace, `apps/web` (Next.js 16), `apps/mobile` (Expo SDK 58), AGENTS.md, CI, PR template, warm-up migration.

## Next
- [ ] Azim: review Home on a phone, tweak tokens/components until the look is right → then the full kit + `/kit` preview screen → reference screens (Welcome, auth, M3 Challenges, M3 Result, M5 Passport) → `docs/ui.md` + lint guard, tag `design-v1`.
- [ ] Azim: upgrade to Expo SDK 58 once the store Expo Go supports it (one PR; the new Expo Go drops SDK 57).
- [ ] Everyone: clone, `pnpm install`, `pnpm dev:web` and `pnpm dev:mobile` run on your machine.
- [ ] Everyone: warm-up PR — one screen in your module's app + one table copied from `supabase/migrations/0001_warmup_notes.sql`.
- [ ] Everyone: design your module's screens in Figma on the shared design system.
- [ ] Azim: Supabase project values into `.env.local` / `.env`; `supabase/` linked to the project.
- [ ] Azim (weeks 6–7): shared core — auth, profiles, skills, student_skills, seed.

## Ideas for later
- M3 (Azim): a streak line on Today's challenge ("🔥 3-day streak"). Needs Module 3 to keep a daily pass log. Agreed 18 Oct; not in the first build.

## Blocked / decisions needed
- Micro-project count at launch (Azim + Fiona).
- Pass marks: Practised 3 × ≥ 70 % (M3), Verified ≥ 3/5 (M4), Ready ≥ 70 % (M2) — confirm.
