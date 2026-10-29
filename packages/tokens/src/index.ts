/**
 * SkillProof design tokens.
 *
 * THE source of truth for colours, type, spacing and radius (Azim, 18 Oct: the code leads the
 * design; the Figma file "SkillProof — Design System" was the starting sketch and is no longer
 * followed — "Figma …" comments below only record where a value first came from).
 * The mobile app imports this file directly; the web portal uses the generated
 * `tokens.css` (`pnpm --filter @skillproof/tokens build`).
 *
 * Rules (docs/ui.md): screens never hard-code a colour or font — they go
 * through these tokens and the components in `apps/mobile/components/ui`.
 */

export const colors = {
  // BitePal-style theme (Azim, 24 Oct): lavender-grey pages, white cards, near-black ink and
  // pill buttons, the role colour (Web Developer purple) for progress and selection.
  text: {
    primary: "#1c1d21", // near-black — headings, body, big numbers
    secondary: "#73747f", // labels, units, sub-lines (4.6:1 on white)
    inverse: "#ffffff", // text on the black pill
  },
  bg: {
    app: "#edecf2", // the lavender-grey page behind every screen
    surface: "#ffffff", // cards, sheets
    subtle: "#f4f3f7", // neutral chips, code blocks, tracks inside cards
  },
  border: {
    default: "#e4e3ea", // secondary pill outline, dividers between list rows
  },
  icon: {
    default: "#5f616c", // glyphs, chevrons
    muted: "#9b9ba6", // idle tabs
  },
  action: {
    primaryStrong: "#1d1e21", // the ONE strong action per screen — a black pill (16:1 with white)
    onPrimaryStrong: "#ffffff",
  },
  accent: {
    sky: "#c9b8ff", // avatars; the light step of a segmented bar (Practised)
    skySoft: "#efeaff", // the role tint: a selected option, today's challenge card (Azim, 25 Oct)
    brand: "#7c5cf0", // the role colour (Web Developer): selected options, links, active marks
    butter: "#ffe9a8", // the TEST MODE strip and labels, butter icon badges
    butterSoft: "#fff6d6", // a butter card (kit demo)
    progress: "#7c5cf0", // readiness ring and bars, in the role colour
  },
  status: {
    // Skill status colours carry meaning — never reuse them for decoration.
    verified: { fg: "#1d7348", bg: "#d9f2e3" }, // green = achievement (Module 4)
    practised: { fg: "#2a5db0", bg: "#dcebff" }, // blue = in progress (Module 3)
    notYet: { fg: "#5f6f84", bg: "#eef3f9" }, // grey = no evidence yet (text/secondary on bg/subtle)
  },
  feedback: {
    // Outcome colours for toasts, field errors and inline messages. Success shares Verified's
    // values today but has its own name, so skill status and "it worked" can part ways later.
    success: { fg: "#1d7348", bg: "#d9f2e3" },
    error: { fg: "#b42318", bg: "#fde8e6" },
    info: { fg: "#2a5db0", bg: "#dcebff" },
  },
  kind: {
    // A challenge's own page is a pastel of its kind (BitePal's detail pages, Azim 25 Oct): a
    // category, never a status — so no green, blue, purple or butter. ink = its icon on white ·
    // mark = its colour in a chart (passes the dataviz validator on white: CVD ΔE ≥ 15.9; teal
    // is under 3:1, so charts label every kind).
    fixBug: { page: "#ffe9d1", ink: "#b8540b", mark: "#d9620f" }, // apricot
    sqlLive: { page: "#d6f2ee", ink: "#12766c", mark: "#2ab7a8" }, // teal
    explainIt: { page: "#fbe4f1", ink: "#b4237a", mark: "#a01c69" }, // pink
  },
  passport: {
    // The Skill Passport looks like a real one: navy cover, gold foil (Azim, 18 Oct).
    // Gold = the passport and credentials only — never decoration.
    cover: "#0b1a35", // same navy as action.primaryStrong; as a surface it means "your passport"
    gold: "#dcb253", // foil: labels, the ID tile, the chevron — 8.5:1 on the cover
    goldLine: "rgba(220, 178, 83, 0.45)", // hairline border + divider on the cover
    wash: "#f7edd3", // a soft gold page tint where the passport is the subject (onboarding)
  },
  mascot: {
    // Gem (Azim, 29 Oct): a skill badge come alive. Its body is accent.brand, its eyes bg.surface
    // and text.primary, its sparkles accent.butter; these two are its own.
    facet: "#8d70f3", // the lighter hexagon inside the body
    blush: "#ffb3cf", // cheeks
  },
  glass: {
    // frosted fallback for the bottom dock where Liquid Glass isn't available (Android, iOS < 26, web)
    veil: "rgba(226, 225, 232, 0.92)", // the soft grey of the floating tab pill
  },
  code: {
    // Code shown in the app wears VS Code's Dark+ theme (Azim, 25 Oct), so it reads like an editor.
    bg: "#1e1e1e",
    text: "#d4d4d4", // punctuation, operators, SQL names
    lineNumber: "#858585",
    keyword: "#569cd6", // const, function, SELECT …
    control: "#c586c0", // return, if, await …
    fn: "#dcdcaa", // a name being called
    variable: "#9cdcfe",
    string: "#ce9178",
    number: "#b5cea8",
    comment: "#6a9955",
    lineRight: "rgba(78, 201, 140, 0.24)", // a tapped line that was the answer (onboarding warm-up)
    lineWrong: "rgba(244, 112, 103, 0.26)", // a tapped line that wasn't
  },
  overlay: {
    scrim: "rgba(51, 65, 85, 0.45)", // Figma overlay/scrim = slate at 45 %
  },
  shadow: {
    ink: "#334259", // shadow colour for floating elements (used at 10 %)
  },
} as const;

/** Spacing scale (px). Figma: spacing/xs … xl, plus xxs for the 2 px title/subtitle gaps. */
export const space = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

/**
 * Off-scale gaps the Figma frames use as raw values (not Figma variables). Named here so screens
 * never repeat the numbers.
 */
export const gap = {
  tight: 6, // between lines of text in a card, between chips
  loose: 14, // between cards stacked on a screen; ring ↔ text in the readiness card
} as const;

/** Blur strength (expo-blur intensity, 0–100) of the frosted dock fallback. */
export const blur = {
  dock: 40,
} as const;

/**
 * Motion (ms). Every animation in the kit uses these, and turns off when the phone's Reduce Motion
 * setting is on (components/ui/motion.ts).
 */
export const motion = {
  quick: 150, // closing, small state changes
  standard: 250, // sheets and dialogs opening
  toast: 3000, // how long a success / info toast stays (error toasts stay until closed)
  pop: 700, // a badge opening on a win: squeeze, spring, sparks (Result)
  float: 1600, // the mascot rising (then sinking) at rest
} as const;

/** Press feedback for anything tappable. */
export const opacity = {
  pressed: 0.85,
  disabled: 0.5,
} as const;

/** Corner radius (px). */
export const radius = {
  control: 6, // checkboxes, small boxes
  tile: 14, // icon badge tiles
  lg: 16, // option rows, inputs
  xl: 26, // cards — big and soft, BitePal-style (Azim, 24 Oct)
  sheet: 28, // top corners of a sheet: the sky's lip, the bottom-nav dock
  full: 999,
} as const;

/** Fixed layout numbers from the Figma frames (390-wide artboards). */
export const layout = {
  designWidth: 390,
  gutter: 16, // screen side padding — cards run wide, BitePal-style
  sceneHeight: 330, // Home's illustrated scene (BitePal-style header)
  sceneOverlap: 56, // the first card slides this far up over the scene's bottom edge
} as const;

/**
 * Type scale (Sofia Sans, Azim 24 Oct). `family` + `weight` map to a loaded font on each platform:
 * mobile → SofiaSans_<weight>, SofiaSansCondensed_800ExtraBold (display), RobotoMono_400Regular
 * web    → the `--font-sans` / `--font-display` / `--font-mono` stacks in tokens.css
 */
export type TypeStyle = {
  family: "sans" | "display" | "mono";
  weight: 400 | 500 | 600 | 700 | 800 | 900;
  size: number;
  lineHeight: number;
  letterSpacing: number;
  uppercase?: boolean;
};

export const type = {
  display: { family: "sans", weight: 900, size: 40, lineHeight: 44, letterSpacing: -0.8 }, // the big number on a card ("72%")
  headline: { family: "display", weight: 800, size: 34, lineHeight: 36, letterSpacing: -0.2 }, // condensed: onboarding questions, a win ("Node.js, proven!")
  title: { family: "sans", weight: 900, size: 30, lineHeight: 34, letterSpacing: -0.4 }, // a screen's title ("Progress"), Home's name
  heading: { family: "sans", weight: 800, size: 17, lineHeight: 22, letterSpacing: -0.1 }, // card titles
  subheading: { family: "sans", weight: 700, size: 16, lineHeight: 22, letterSpacing: -0.1 }, // list-row titles
  bodyStrong: { family: "sans", weight: 700, size: 15, lineHeight: 21, letterSpacing: 0 }, // button labels
  body: { family: "sans", weight: 500, size: 15, lineHeight: 21, letterSpacing: 0 },
  label: { family: "sans", weight: 600, size: 13, lineHeight: 18, letterSpacing: 0 }, // a card's grey label, badges, tags
  small: { family: "sans", weight: 500, size: 13, lineHeight: 18, letterSpacing: 0 }, // sub-lines
  caption: { family: "sans", weight: 500, size: 12, lineHeight: 16, letterSpacing: 0 },
  captionStrong: { family: "sans", weight: 700, size: 12, lineHeight: 16, letterSpacing: 0 }, // chips
  sectionLabel: { family: "sans", weight: 600, size: 13, lineHeight: 18, letterSpacing: 0 }, // grey, sentence case ("Micro-projects for you")
  overline: { family: "sans", weight: 700, size: 12, lineHeight: 16, letterSpacing: 0.8, uppercase: true }, // small caps label over a value ("UP NEXT")
  code: { family: "mono", weight: 400, size: 13, lineHeight: 20, letterSpacing: 0 },
} as const satisfies Record<string, TypeStyle>;

export type TypeVariant = keyof typeof type;

/** CSS font stacks for the web portal. */
export const fontStack = {
  sans: "'Sofia Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  display: "'Sofia Sans Condensed', 'Sofia Sans', system-ui, sans-serif",
  mono: "'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
} as const;

/** Shadows. Only floating elements get one — cards are flat. */
export const shadow = {
  bubble: { color: colors.shadow.ink, opacity: 0.1, offsetY: 4, blur: 12 }, // speech bubble, toasts
  // the bottom-nav dock: a faint shadow cast UP onto the content (CSS box-shadow, works on iOS,
  // Android and web with the New Architecture)
  dock: "0px -4px 16px rgba(51, 66, 89, 0.06)",
  // the tilted cards on onboarding's pitch screens, floating over the page like BitePal's
  art: "0px 12px 28px rgba(51, 66, 89, 0.12)",
} as const;
