# Progress

Update this when you finish a step. Newest at the top of each list.

## Done
- 2026-10-18 — Home review round 3 (Azim + a ChatGPT critique he brought): gauge 230 + "Your career goal" heading + "2 skills left on your roadmap" (no "job-ready" claim — Module 2's threshold) · unlock card with named steps and "your readiness goes up and you can apply" · Today card: full-width navy Start challenge, code peek (`preview`), no mascot · Skill Passport card styled like a passport — new `passport` tone (navy cover, gold foil; gold = passport only) · `PassportCard` with recently verified skill + empty state.
- 2026-10-18 — Home review round 2 (Azim): readiness as a half-ring gauge (260, light → brand gradient, `display` type token) · first card starts on the sheet (`layout.sheetGap`) · no decorative circles on any card · "Today's challenge" section header, time chip, mascot peeking from the card edge · new `UnlockCard` (what today's challenge unlocks, `nextUnlock()` in `lib/home`).
- 2026-10-18 — Home review round 1 (Azim): flat page + deeper sky, white avatar on the sky, project slider (top 3 + next locked), "Done for today" state, shared `Hero`, named spacing/opacity tokens, `app.config.ts` from tokens, lint guardrail + AGENTS.md rule 13 + `docs/ui.md`. TEST MODE pill removed for the review — restore it or amend rule 4 before demo data reaches `main`.
- 2026-10-17 — UI kit foundation (branch `feat/ui-kit-foundation`): Expo SDK 57 (store Expo Go), Expo Router with the 5 module tabs, `packages/tokens` (`@skillproof/tokens`, mirrored from the Figma variables, `tokens.css` for the web), 17 components in `apps/mobile/components/ui`, mascot poses, Home as the proof screen behind `EXPO_PUBLIC_TEST_MODE`. Awaiting Azim's on-device review.
- 2026-10-16 — Proposal submitted on ulearn, recommended by Dr. Farah.
- 2026-10-16 — Repo scaffolded: pnpm workspace, `apps/web` (Next.js 16), `apps/mobile` (Expo SDK 58), AGENTS.md, CI, PR template, warm-up migration.

## Next
- [ ] Azim: review Home on a phone, tweak tokens/components until the look is right → then the full kit + `/kit` preview screen → reference screens (Welcome, auth, M3 Challenges, M3 Result, M5 Passport) → `docs/ui.md` + lint guard, tag `design-v1`.
- [ ] Azim: upgrade to Expo SDK 58 once the store Expo Go supports it (one PR; the new Expo Go drops SDK 57).
- [ ] Everyone: clone, `pnpm install`, `pnpm dev:web` and `pnpm dev:mobile` run on your machine.
- [ ] Everyone: warm-up PR — one screen in your module's app + one table copied from `supabase/migrations/0001_warmup_notes.sql`.
- [ ] Everyone: plan your module's screens from the coded kit (`docs/ui.md`; the `/kit` preview screen comes with Step 2). The Figma file is no longer updated (Azim, 18 Oct) — sketch anywhere, but build only with the kit.
- [ ] Azim: Supabase project values into `.env.local` / `.env`; `supabase/` linked to the project.
- [ ] Azim (weeks 6–7): shared core — auth, profiles, skills, student_skills, seed.

## Ideas for later
- M3 (Azim): a streak line on Today's challenge ("🔥 3-day streak"). Needs Module 3 to keep a daily pass log. Agreed 18 Oct; not in the first build.

## Blocked / decisions needed
- Micro-project count at launch (Azim + Fiona).
- Pass marks: Practised 3 × ≥ 70 % (M3), Verified ≥ 3/5 (M4), Ready ≥ 70 % (M2) — confirm.
