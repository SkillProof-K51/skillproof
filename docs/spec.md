# SkillProof — build spec (v1, 16 Oct 2026)

The approved proposal is the source of truth: `Workshop II/03 Deliverables/BITU3923_K51_SkillProof_Proposal.pdf` (Drive). This file turns it into build order.

## Users and apps
| User | App | Registers with |
|---|---|---|
| Student | mobile (Expo) | profile, skills, preferred role |
| Company | web | company details + verification documents; posts opportunities / job vacancies |
| Mentor | web | professional details, linked to a company; prepares micro-projects, rates students |
| University coordinator | web | maps courses to skills; reads reports |
| Admin | web | verifies companies; manages roles, skills, weights, challenges |

## Skill status (shared core — the one rule everything hangs on)
`not_yet → practised → verified`, per student per skill.
- **Module 3** writes `practised` (3 passed challenges at ≥ 70 %).
- **Module 4** writes `verified` (mentor rating ≥ 3/5 on a micro-project).
- Modules 2 and 5 only read. A micro-project **unlocks** only when every skill it needs is `practised`.

## Modules
| # | Module | Owner | Add / update / delete | Calculation or report | AI (Gemini, server-side) |
|---|---|---|---|---|---|
| 1 | Industry Standards & Curriculum Alignment | Iskandar | roles, skills, skill weights (from job-ad counts), course↔skill maps | curriculum gap report | — |
| 2 | Profile, Skill Gap & AI Matching | Insyirah | profiles, skills, target roles, saved matches | **one fit engine**: Readiness % (role) + Fit % (micro-project) | learning roadmap; explains gap and matches |
| 3 | AI Skill Challenges | Azim | challenges, attempts | auto-check Fix-the-bug + SQL-live in a sandbox; Practised after 3 passes; practice report | grades Explain-it against our rubric; makes variants we check |
| 4 | Micro-Projects & Mentor Verification | Fiona | micro-projects, applications, deliverables, ratings | verification score; completion report | first review of deliverables; mentor decides |
| 5 | Skill Passport & Talent Analytics | Azim | evidence items, share links, per-skill visibility | skill shortage report (M1 demand vs verified supply) | — |

Proposed numbers (owners may refine, then update here): Readiness = Σ weight × (verified 1 / practised 0.5 / not_yet 0), "Ready" ≥ 70 %. Weights come from Module 1.

## Build order
1. **Now → 23 Oct**: repo, warm-up PR each (1 screen + 1 table), module screens planned on the coded UI kit (`docs/ui.md`; Figma was the starting sketch, no longer updated).
2. **Weeks 6–7**: shared core — auth for all user types, `profiles`, `skills`, `student_skills` (status), seed data. Owner: Azim.
3. **Weeks 7–11**: each module on top of the core, in its own app and `lib/` folder.
4. **Weeks 10–12**: integration + testing → Progress III live demo. Poster weeks 11–12. Showcase week 14.

## Additions beyond the proposal
Features the approved proposal didn't list, agreed later. They are in scope now — build and keep them like everything above. Add a row when one is agreed.

| Date | Module | Addition | Asked by | Why |
|---|---|---|---|---|
| 19 Oct 2026 | 5 (Azim) | QR code for the public passport, in a sheet from the Sharing card — only while the passport is public | Azim | Employers scan it face to face, at career fairs and interviews |

## Out of scope
Contracts and payments, non-technical skills, hosted lessons, official certification, voice answers (future work).
