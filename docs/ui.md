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
- **Hero first.** `size="tall"` (290) on a module's first screen, `"compact"` (180) on sub-screens, auth and lists. The first card starts on the sheet, `layout.sheetGap` (24) below the sky's edge, automatically.
- **One mascot per module home**: in the hero (`<Hero mascot>`) or standing on the sheet edge beside the first section (`<SectionHeader mascot>`, Home's choice); at most one more inside a card. No mascot on task screens (Fix the bug, SQL live, Explain it) or on the filled Skill Passport.
- **One strong button per screen** (`<Button>` primary). Every other button is `variant="secondary"`.
- **Cards are flat**: white (`tone="surface"`), butter for energy (today's challenge), blue for projects. No decoration on cards — no circles, borders or shadows (Azim, 18 Oct).
- **A whole card can be the button** (`<Card onPress>`): give it a clear cue — a label + a small navy arrow circle, like Today's challenge — and an `accessibilityLabel` that says what tapping does.

## Every component, live: `/kit`
Open `localhost:8081/kit` on the web, or tap **Open the UI kit** on any placeholder tab in a dev build. Every variant and state is there on the real tokens — plan your module's screens from it.

| Group | Components |
|---|---|
| Layout | `Screen` · `Hero` (+ `SkyBackdrop`) · `TopBar` · `SectionHeader` · `TabBar` · `Card` · `Divider` |
| Text & actions | `Text` · `Button` (primary · secondary · danger) · `IconButton` · `Chip` · `Icon` |
| Forms | `TextField` · `Select` (one choice from a list) · `Checkbox` · `Switch` · `SegmentedControl` (filters) |
| Lists | `ListRow` (+ `Divider` between rows) · `Carousel` |
| Status & progress | `StatusBadge` · `Stamp` · `ProgressRing` · `ProgressBar` · `ProgressDots` · `IconBadge` · `Avatar` · `SkillLogo` |
| Reports | `Stat` (number + icon + unit) · `BarChart` (one series) · `SkyPanel` (sky surface for a Result's celebration) |
| Feedback | `Toast` (`useToast()`) · `Dialog` · `BottomSheet` · `EmptyState` |
| Mascot | `Mascot` · `GroundedMascot` · `MascotShadow` · `SpeechBubble` |

## Feedback — which one when
- **Something saved or synced** → `toast({ message, tone: "success" })`. **It failed** → `tone: "error"`: the toast stays until tapped, so a failure is never swallowed (AGENTS.md rule 11).
- **A question that needs an answer before going on** → `<Dialog>`; if the answer can't be undone (remove, delete, withdraw) → `confirm={{ …, variant: "danger" }}`.
- **Options, filters, a short form** → `<BottomSheet>`. **One choice inside a form** → `<Select>`. Several choices → `Checkbox` rows in a `BottomSheet`.
- **Nothing to show yet** → `<EmptyState>` that says what will fill the space and how.

## Numbers and charts (report screens)
- A headline number is a `<Stat>`: label, icon, value with its unit, optional signed `delta`. Two in a row on the page. A trend goes in a `<BarChart>` beside it, not inside the tile.
- A series is a `<BarChart>`: **one hue** (blue), the highlighted column in brand blue, a faint track to the goal. Never two y-axes, never a pie.
- The figure wears text ink. Meaning lives in the icon circle (green = Verified, blue = Practised) — never colour the number, and never colour alone: always icon + label.
- Values arrive computed and formatted (rule 2); these only draw them.

## Motion
Durations are the `motion` tokens (quick · standard · toast · breath). Every animation in the kit drops to 0 ms when the phone's Reduce Motion is on (`useReducedMotion()` / `useDuration()` in `components/ui/motion.ts`). Screens don't animate on their own — use the components.

## Demo data
Only behind `EXPO_PUBLIC_TEST_MODE=1` (`lib/testMode.ts`). The butter **TEST MODE · demo data** strip appears under the status bar on every screen by itself (rule 4) — never fake data without it.

## Colour = meaning
| Colour | Means | Use for |
|---|---|---|
| green (`status.verified`) | Verified by a mentor (M4) | Verified badges, Fit % chips, achievements |
| blue (`status.practised`) | Practised / in progress (M3) | Practised badges, project cards and badges |
| butter (`accent.butter`) | energy | today's challenge only |
| navy (`action.primaryStrong`) | the main action | the one primary button per screen |
| navy cover + gold foil (`passport.*`) | your credential (M5) | the Skill Passport card (`<Card tone="passport">`) and page — gold never anywhere else |
| brand blue (`accent.brand`) on soft sky (`accent.skySoft`) | where you are | the active tab in the bottom nav |
| `feedback.success` / `error` / `info` | an outcome, just now | toasts, field errors, inline messages — never a skill status |
Never use a status colour as decoration.

## Text
Always `<Text variant="…">` (display · title · heading · subheading · bodyStrong · body · label · small · caption · captionStrong · sectionLabel · stamp · code). Never set `fontFamily` or `fontSize` yourself.

## When something needs to change
- **A value is wrong everywhere** (a colour, a gap) → change it in `packages/tokens/src/index.ts`, run `pnpm --filter @skillproof/tokens build` (CI fails if you forget). Tokens are shared core — Azim reviews the PR.
- **A component looks wrong** → fix the component in `components/ui`; every screen gets the fix.
- **A size only one component uses** → a named constant at the top of that file (`const TAIL = 12;`), with a comment saying where it comes from.
- **Never** fix a look on one screen only, and never type a hex colour, a font name or a raw size — lint will stop the build.
