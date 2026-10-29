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
  <Hero>                                       {/* the title on the page, under the status bar */}
    <Text variant="title">Challenges</Text>
  </Hero>
  <View style={styles.content}>                {/* paddingHorizontal: layout.gutter, gap: gap.loose */}
    <Card>…</Card>
    <SectionHeader title="More challenges" />
    <Card>…</Card>
  </View>
</Screen>
```
- **Hero first.** The title on the page itself, the first card `space.xl` below (the BitePal look); Home's hero is Gem's greeting. The garden picture went on 29 Oct, and with it `Hero`'s `scene` option. Welcome is the one screen without a hero: it opens from the launch screen.
- **One mascot, Gem, and only on Home for now** (Azim, 29 Oct; the old blue one went on 25 Oct). Gem is a skill badge come alive: the rounded hexagon with a face, no hands or feet. On Home it says the hello in a `SpeechBubble` whose tail points back at it, so the screen greets once (`components/home/Greeting.tsx`). What it says is text in the bubble, picked in `lib/` (`mascotLine()` in `lib/home.ts`); the mascot itself is decoration that screen readers skip. Ask Azim before putting it on another screen — a screen's moment still comes from its content, like the badge popping open on a Result.
- **One strong button per screen** (`<Button>` primary). Every other button is `variant="secondary"`.
- **Buttons are chunky** (Azim, 29 Oct): a face on a darker edge, the label in capitals; pressing pushes the face down onto its edge, and the button keeps its height. Primary is the role purple, secondary white with a grey outline, danger red; `text` stays flat and in normal case. Write labels in normal case (`label="Start challenge"`): the `button` type draws them in capitals, and the button hands screen readers the words as written. The label is centred on its icon and face, including an optical fix for icons that lean (play) — add one to `OPTICAL_LEFT` in `Button.tsx` if a new icon looks off-centre.
- **Cards are flat**: white (`tone="surface"`) with big soft corners on the lavender page; the role tint (`tone="role"`) for today's challenge; blue for projects. No decoration on cards — no circles, borders or shadows.
- **A whole card can be the button** (`<Card onPress>`): give it a clear cue — a label that says what happens, or an arrow — and an `accessibilityLabel` that says what tapping does.

## Reference screens — start from one of these
Each one shows a pattern end to end on demo data (TEST MODE). Open it from the top of `/kit`, read its file, and build your screen the same way.

| Screen | File | Copy it for |
|---|---|---|
| Welcome | `app/(auth)/welcome.tsx` | screen 1 of 12: opens from the launch screen (the logo on the brand purple) — the purple fades into the page, the logo settles, Gem pops in, one sentence and two buttons rise. Once per app launch; at rest under Reduce Motion |
| Onboarding | `app/(auth)/onboarding.tsx` | a flow of steps (screens 2–11): a progress bar, a condensed headline per step that fades up (`<Reveal key={step}>`), a tint per step, `OptionList` questions, tilted pitch cards built from kit pieces, a tap-the-line warm-up (`CodeBlock onPressLine`), one centred Next pill (`<Screen footer>`); the answers ride on to Sign up |
| Sign up · Log in | `app/(auth)/sign-up.tsx` · `log-in.tsx` | any form — see **Forms** below |
| Challenges | `app/(tabs)/challenges.tsx` | a module home: plain title, today's card, a progress list, `SegmentedControl` filter + list, `EmptyState` |
| Challenge page | `app/challenges/[id].tsx` | a detail page: its kind's pastel fading down the page (`<Screen tint>`), a big icon on a white circle, cards, and the main action pinned at the bottom (`<Screen footer>`) |
| Result | `app/challenges/result.tsx` | an outcome in two beats: the celebration (the skill's badge pops open: `<SkillBadge status="practised" from="not_yet">`), then the details. Module 4's Verified result is the same with `status="verified" from="practised"` |
| Progress | `app/progress.tsx` | a report screen: a big number with a `StackedBar` by kind and its legend, a `LineChart` on its true scale with a reference line, then a list (from Home's "See all") |
| Skill Passport | `app/(tabs)/passport.tsx` | a badge per roadmap skill (`SkillBadge` grid, data from `passportBadges()` in `lib/`), then settings with consequences: a `Switch` behind a consent `Dialog`, a `BottomSheet` of `Checkbox`es, save → toast, the share sheet, `QrCode` |

## Every component, live: `/kit`
Open `localhost:8081/kit` on the web, or tap **Open the UI kit** on any placeholder tab in a dev build. Every variant and state is there on the real tokens — plan your module's screens from it.

| Group | Components |
|---|---|
| Layout | `Screen` (`tint` = a pastel fading down the page · `footer` = an action pinned at the bottom) · `Hero` · `TopBar` (title optional when the hero says it big) · `SectionHeader` · `TabBar` · `Card` · `Divider` |
| Text & actions | `Text` · `Button` (primary · secondary · danger · text) · `IconButton` · `Chip` · `Icon` |
| Forms | `TextField` (`ref` for the Next key) · `Select` (one choice from a list) · `OptionList` (a question on its own screen: big rows, one choice or `multiple`) · `Checkbox` (`error`) · `Switch` · `SegmentedControl` (filters) |
| Lists | `ListRow` (+ `Divider` between rows) · `Carousel` |
| Status & progress | `StatusBadge` · `SkillBadge` (a skill's hexagon: Verified / Practised / locked; `from` pops it open on a win) · `SegmentedProgress` · `ProgressRing` · `ProgressBar` · `ProgressDots` · `SkillCircle` (a skill's logo ringed by its status — Home's readiness sheet) · `IconBadge` · `Avatar` · `SkillLogo` |
| Reports | `Stat` (number + icon + unit) · `BarChart` (one series) · `StackedBar` (parts of a whole + a legend) · `LineChart` (one series over time) |
| Sharing | `QrCode` (a link to scan — navy on white, never inverted) |
| Feedback | `Toast` (`useToast()`) · `Dialog` · `BottomSheet` · `EmptyState` (an optional icon) · `Reveal` (a step fades up) |
| Mascot & logo | `Mascot` (Gem; `size`; floats at rest) · `SpeechBubble` (what it says; the tail points left, back at it) · `Logo` (`size` = height; `tone="onBrand"` on the purple) |

## Feedback — which one when
- **Something saved or synced** → `toast({ message, tone: "success" })`. **It failed** → `tone: "error"`: the toast stays until tapped, so a failure is never swallowed (AGENTS.md rule 11).
- **A question that needs an answer before going on** → `<Dialog>`; if the answer can't be undone (remove, delete, withdraw) → `confirm={{ …, variant: "danger" }}`.
- **Options, filters, a short form** → `<BottomSheet>`. **One choice inside a form** → `<Select>`; **a question with its own screen** → `<OptionList>`. Several choices → `Checkbox` rows in a `BottomSheet`.
- **Nothing to show yet** → `<EmptyState>` that says what will fill the space and how.

## Forms
- **Rules live in `lib/`**: one function returns `{ field: message }` (`validateSignUp` in `lib/auth.ts`). The screen calls it; it never checks values itself.
- **Errors after the first try**: nothing is red before the student presses the button; after that, errors update as they type. Each message says what to do ("Use at least 8 characters"), never just "Invalid".
- **The keyboard moves on**: `returnKeyType="next"` + `onSubmitEditing={() => nextRef.current?.focus()}` with a `ref` on the next `TextField`; the last field's Go key submits.
- **Saving**: success → `toast({ tone: "success" })`; failure → error toast that stays (rule 11). A save that isn't built yet throws in `lib/` — it never pretends. In TEST MODE a mocked submit says so ("Test mode: no account was created", rule 4).
- A consent the student must give → a `Checkbox` with `error`; anything that makes data public → a `Dialog` before it happens (PDPA).

## Numbers and charts (report screens)
- A headline number is a `<Stat>`: label, icon, value with its unit, optional signed `delta`. Two in a row on the page. A trend goes in a `<BarChart>` beside it, not inside the tile.
- A series is a `<BarChart>`: **one hue** — the highlighted column in the role purple, the rest a lighter step of it, a faint track to the goal. Never two y-axes, never a pie.
- The figure wears text ink. Meaning lives in the icon circle (green = Verified, blue = Practised) — never colour the number, and never colour alone: always icon + label.
- Parts of a whole → a `<StackedBar>` (2px gaps, a fixed order) with a legend that has every count. Over time → a `<LineChart>` (Azim's pick, 25 Oct): one series, the scale zoomed to where it moves (snapped to tens, three labelled ticks — fine for a line, never for bars, which start at zero), a hollow dot per point on a faint day line, solid hairline grid, a reference line when the scale has one (Ready at 70%), only the last point labelled. No donut for close values.
- A chart's colours are checked, not eyeballed: the kinds' `mark` colours passed the dataviz validator (colour-blind separation ΔE ≥ 15.9 on white). Text stays in text colours, never the series colour; each chart's `accessibilityLabel` lists every value (its table view).
- Values arrive computed and formatted (rule 2); these only draw them.

## Motion
Durations are the `motion` tokens (quick · standard · toast · pop · float · launch · open). Every animation in the kit drops to 0 ms when the phone's Reduce Motion is on (`useReducedMotion()` / `useDuration()` in `components/ui/motion.ts`). Screens don't animate on their own — use the components: a step or a page part that appears fades up with `<Reveal>` (new `key` = play again). The one motion moment of a Result is the skill's badge popping open (`<SkillBadge from="not_yet" />`); Welcome's is opening from the launch screen (`motion.launch`, then `motion.open`).

## Demo data
Only behind `EXPO_PUBLIC_TEST_MODE=1` (`lib/testMode.ts`). The butter **TEST MODE · demo data** strip appears under the status bar on every screen by itself (rule 4) — never fake data without it.

## Colour = meaning
| Colour | Means | Use for |
|---|---|---|
| green (`status.verified`) | Verified by a mentor (M4) | Verified badges, Fit % chips, achievements |
| blue (`status.practised`) | Practised / in progress (M3) | Practised badges, project cards and badges |
| role tint (`accent.skySoft`) + role colour (`accent.progress`) | your path | today's challenge card, a selected option, progress bars, segments and dots |
| apricot · teal · pink (`kind.*`) | a challenge's kind (Fix the bug · SQL live · Explain it) | its page tint and its icon — a category, never a status; read them through `KINDS` |
| butter (`accent.butter`) | test mode | TEST MODE labels (the strip, "Demo grade") |
| purple (`action.primary` on `action.primaryEdge`) | the main action | the one primary button per screen — the role colour, on a darker edge |
| navy cover + gold foil (`passport.*`) | your credential (M5) | the Skill Passport card (`<Card tone="passport">`) and page, and skill badges wherever they appear (`SkillBadge`) — gold never anywhere else |
| near-black, filled icon (`text.primary`) | where you are | the active tab in the floating tab pill |
| `feedback.success` / `error` / `info` | an outcome, just now | toasts, field errors, inline messages — never a skill status |
Never use a status colour as decoration.

## Text
Always `<Text variant="…">` (display · headline · title · heading · subheading · bodyStrong · body · button · label · small · caption · captionStrong · sectionLabel · overline · code). Never set `fontFamily` or `fontSize` yourself.

## When something needs to change
- **A value is wrong everywhere** (a colour, a gap) → change it in `packages/tokens/src/index.ts`, run `pnpm --filter @skillproof/tokens build` (CI fails if you forget). Tokens are shared core — Azim reviews the PR.
- **A component looks wrong** → fix the component in `components/ui`; every screen gets the fix.
- **A size only one component uses** → a named constant at the top of that file (`const TAIL = 12;`), with a comment saying where it comes from.
- **Never** fix a look on one screen only, and never type a hex colour, a font name or a raw size — lint will stop the build.

## Logo

Direction 4, the Proof chip (Azim, 29 Oct): **Skill** then a purple chip reading **✓ Proof**, like the app's own status chips. **Gem**, the mascot, is the app icon; the chip's **tick** stands in wherever Gem's face would be too small to read (favicons, Android's themed icon). The other directions and the icon options sit on the Figma file's Logo page.

| What | Where |
|---|---|
| In the app | `<Logo />` from the kit (Welcome; `size` = height; `tone="onBrand"` on the brand purple). Use it instead of typing "SkillProof" as a heading. |
| In the portal | `<Brand />` (the logo, `subtitle="Portal"` on signed-out pages) or `<Logo />`, in `@/components/portal`. "Skill" takes the text colour, so it reads on light and dark. |
| Masters | `docs/brand/`: `logo.svg` (on light), `logo-on-dark.svg`, `app-icon.svg` (Gem on purple, full bleed), `gem.svg` + `gem-on-purple.svg` (Gem alone), `favicon.svg` (the tick on a purple tile), `logo-on-brand.svg` (white "Skill", a white chip — the launch screen). The lockup's letters are outlined Sofia Sans Black, so no font is needed. |
| App icon, splash | `apps/mobile/assets/` — rendered from the masters. Android's adaptive icon keeps Gem inside the 66 dp safe circle on the brand purple; its themed (one-colour) icon is the tick. The launch screen is the logo on the brand purple (`app.config.ts`: `imageWidth` 236 = Welcome's first frame, so the hand-over is invisible) |
| Web favicon | `apps/web/src/app/favicon.ico` (16 / 32 / 48) and `icon.svg` (the tick), `apple-icon.png` (Gem) |

To change the logo, change the masters in `docs/brand/` and re-render every PNG from them (Azim has the render script) — never touch one PNG by hand. The two `Logo` components copy the lockup's paths from `logo.svg`.

## The web portal

The portal (`apps/web`) has its own look (**look A**, Azim 28 Oct: Kumo-style — neutral greys, hairline borders, Inter, compact, the app's purple as the one accent) and its own kit: **shadcn/ui** components in `apps/web/src/components/ui`, coloured by the `portal` tokens in `@skillproof/tokens`. Every component is live at **`localhost:3000/kit`**.

| What | Where |
|---|---|
| Colours | Through shadcn's names only: `bg-primary`, `text-muted-foreground`, `border-border`, `bg-muted`… (`globals.css` maps them to the portal tokens). Status colours from the tokens: `bg-feedback-warning-bg`, `text-status-verified-fg`… |
| Components | `@/components/ui/*` (button, card, table, tabs, dialog, field, input, select, badge, sidebar, sonner…). Badge has `warning` (pending) and `success` (approved). |
| A page's parts | `PageHeader` (title, one line, actions), `ModulePlaceholder`, in `@/components/portal`; your area's parts in `@/components/<area>/` |
| Data | `apps/web/src/lib/<area>.ts` (`import "server-only"`; TEST MODE first, then Supabase) and server actions in `lib/<area>-actions.ts` (`"use server"`). Never fetch in a page. |
| Who's signed in | `await requireAccount(["admin"])` at the top of every page and action (`lib/account.ts`): it sends anyone else where they belong. RLS checks again in the database. |
| Icons | Phosphor (like the app): `@phosphor-icons/react/ssr` in server components, `@phosphor-icons/react` in `"use client"` ones. |

A page, top to bottom (copy `app/(portal)/admin/approvals/page.tsx`):
```tsx
export default async function SkillsPage() {
  await requireAccount(["admin"]);            // who may open it
  const skills = await getSkills();           // lib/skills.ts — demo data in TEST MODE
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Skills" description="…" actions={<Button>Add a skill</Button>} />
      <SkillsTable skills={skills} />          {/* components/skills/, "use client" if it's interactive */}
    </div>
  );
}
```

**`pnpm lint` fails on** hex / rgb colours, Tailwind's own palette (`bg-blue-600`, `text-white`) and typed-in sizes (`p-[13px]`) anywhere outside the kit — use Tailwind's scale (`p-4`, `gap-6`) and the names above. A new look = change the token or the component in `components/ui`, never one page.

**TEST MODE** (`NEXT_PUBLIC_TEST_MODE=1`, the default in `.env.example`): demo data from `lib/demo/`, a yellow strip on every page, and a switch to view the portal as the admin, a coordinator, a company (approved or waiting), a mentor or a student. Build your pages there; nothing touches Supabase.

**Next.js 16** differs from what most AI tools learned (e.g. `proxy.ts`, not `middleware.ts`): read `apps/web/node_modules/next/dist/docs/` first. The portal uses plain dynamic rendering (no Cache Components).
