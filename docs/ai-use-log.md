# AI Use Log

Form F of our proposal promises this log. One line per session: who, tool, what it was used for, what you checked or changed. Keep it honest — it is read with the final report.

| Date | Who | Tool | Used for | Checked / changed |
|---|---|---|---|---|
| 2026-10-16 | Azim | Claude Code | Repo setup: pnpm workspace, Expo + Next.js scaffolds, AGENTS.md rules, CI, PR template, warm-up migration | Read every file; versions checked against npm; CI run on the first push |
| 2026-10-18 | Azim | Claude Code | Home review round 2: half-ring gauge + gradient, sheet gap, no card circles, Today card header/time chip/peeking mascot, UnlockCard + `nextUnlock()` | Every option rendered side by side at 390 px before Azim picked; card position compared before/after in screenshots; unlock data kept in `lib/`; `pnpm check` green |
| 2026-10-18 | Azim | Claude Code | Home review round with Azim: sky/sheet contrast (4 options rendered, C picked), white avatar, featured + locked project cards in a slider, "Done for today" state, shared Hero, spacing/opacity tokens, app.config.ts, lint guardrail (rule 13) + `docs/ui.md` | Every look change measured in the browser at 390 px; refactor pixel-diffed against the previous build (only intended changes); lint rule proven with a probe file (6 violations → 6 errors); `pnpm check` green |
| 2026-10-17 | Azim | Claude Code | UI kit foundation: SDK 57 downgrade, Expo Router tabs, `@skillproof/tokens` from the Figma variables, 17 UI components, mascot crops, Home proof screen with demo data | Token values and crop geometry read from the Figma file (MCP), not guessed; `pnpm check` green; iOS + web bundles compiled through Metro; web render measured at 390 px against the Figma frame; phone review pending |
