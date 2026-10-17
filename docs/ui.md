# Building a screen — the UI kit

Read this before you (or your AI tool) build any mobile screen. **The code is the design source of
truth** — the tokens and components in this repo, not the Figma file (it was the starting sketch and
is no longer updated). `pnpm lint` enforces the kit (AGENTS.md rule 13).

## Where things live
| What | Where |
|---|---|
| Colours, type, spacing, radius, opacity | `packages/tokens/src/index.ts` → `import { colors, space, gap, … } from "@skillproof/tokens"` |
| Components (Text, Button, Card, Chip, Hero, Carousel, Icon, Mascot…) | `apps/mobile/components/ui` → `import { Card, Hero } from "../../components/ui"` |
| Parts used by one area only (e.g. Home's project card) | `apps/mobile/components/<area>/` |
| Data for a screen | `apps/mobile/lib/` (never fetch inside a screen — rule 3) |

## A screen, top to bottom
```tsx
<Screen>
  <Hero mascot="laptop">                       {/* sky + mascot + header slot; omit mascot on task screens */}
    <Text variant="title">Challenges</Text>
  </Hero>
  <View style={styles.content}>                {/* paddingHorizontal: layout.gutter, gap: gap.loose */}
    <Card>…</Card>
    <SectionHeader title="More challenges" />
    <Card>…</Card>
  </View>
</Screen>
```
- **Hero first.** `size="tall"` (290) on a module's first screen, `"compact"` (180) on sub-screens, auth and lists. The first card overlaps the sky's lip automatically.
- **One hero mascot per module home**, at most one more inside a card. No mascot on task screens (Fix the bug, SQL live, Explain it) or on the filled Skill Passport.
- **One strong button per screen** (`<Button>` primary). Every other button is `variant="secondary"`.
- **Cards are flat**: white (`tone="surface"`), butter for energy (today's challenge), blue for projects.

## Colour = meaning
| Colour | Means | Use for |
|---|---|---|
| green (`status.verified`) | Verified by a mentor (M4) | Verified badges, Fit % chips, achievements |
| blue (`status.practised`) | Practised / in progress (M3) | Practised badges, project cards and badges |
| butter (`accent.butter`) | energy | today's challenge only |
| strong blue (`action.primaryStrong`) | the main action | the one primary button |
Never use a status colour as decoration.

## Text
Always `<Text variant="…">` (title · heading · subheading · bodyStrong · body · label · small · caption · captionStrong · sectionLabel · code). Never set `fontFamily` or `fontSize` yourself.

## When something needs to change
- **A value is wrong everywhere** (a colour, a gap) → change it in `packages/tokens/src/index.ts`, run `pnpm --filter @skillproof/tokens build` (CI fails if you forget). Tokens are shared core — Azim reviews the PR.
- **A component looks wrong** → fix the component in `components/ui`; every screen gets the fix.
- **A size only one component uses** → a named constant at the top of that file (`const TAIL = 12;`), with a comment saying where it comes from.
- **Never** fix a look on one screen only, and never type a hex colour, a font name or a raw size — lint will stop the build.
