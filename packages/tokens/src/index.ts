/**
 * SkillProof design tokens.
 *
 * One source of truth for colours, type, spacing and radius, mirrored from the
 * Figma file "SkillProof — Design System" (variables on the Foundations page).
 * The mobile app imports this file directly; the web portal uses the generated
 * `tokens.css` (`pnpm --filter @skillproof/tokens build`).
 *
 * Rules (docs/ui.md): screens never hard-code a colour or font — they go
 * through these tokens and the components in `apps/mobile/components/ui`.
 * If a value changes, change it here AND in the Figma variable.
 */

export const colors = {
  text: {
    primary: "#334155", // slate — headings, body
    secondary: "#5f6f84", // captions, labels, inactive tabs
    inverse: "#ffffff", // text on primary-strong buttons
  },
  bg: {
    app: "#f3f8fe", // page background and the sky's sheet lip (Figma bg/app)
    appTop: "#e9f1fd", // top of the page gradient (Figma: raw value on Home, now a token)
    surface: "#ffffff", // cards, sheets, speech bubbles
    subtle: "#eef3f9", // neutral chips, grey icon badges
  },
  border: {
    default: "#e8eff8", // secondary button outline, progress tracks
  },
  icon: {
    default: "#64748b", // Regular-weight glyphs, chevrons
    muted: "#8492a6",
  },
  action: {
    primaryStrong: "#2f6fdc", // the ONE strong CTA per screen (AA 4.74:1 with white)
    onPrimaryStrong: "#ffffff",
  },
  accent: {
    sky: "#bfdbfe", // brand / avatars / sky top
    butter: "#ffe9a8", // energy — today's challenge tag, butter icon badges
    butterSoft: "#fff6d6", // Figma butter/100 — today's challenge card
    progress: "#6fa8f5", // readiness ring fill
  },
  sky: {
    // Sky backdrop gradient, top → bottom
    top: "#bfdbfe",
    mid: "#d7e8fc",
    bottom: "#e3effd",
  },
  status: {
    // Skill status colours carry meaning — never reuse them for decoration.
    verified: { fg: "#1d7348", bg: "#d9f2e3" }, // green = achievement (Module 4)
    practised: { fg: "#2a5db0", bg: "#dcebff" }, // blue = in progress (Module 3)
    notYet: { fg: "#5f6f84", bg: "#eef3f9" }, // ⚠ assumed from text/secondary + bg/subtle — confirm against the Figma Status Badge
  },
  overlay: {
    scrim: "rgba(51, 65, 85, 0.45)", // Figma overlay/scrim = slate at 45 %
  },
  shadow: {
    ink: "#334259", // shadow colour for floating elements (used at 10 %)
  },
} as const;

/** Spacing scale (px). Figma: spacing/xs … xl. */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

/** Corner radius (px). Figma has lg and xl both at 16 — kept so names match the inspector. */
export const radius = {
  tile: 14, // icon badge tiles
  lg: 16, // buttons
  xl: 16, // cards
  sky: 28, // sheet lip on the sky backdrop
  full: 999,
} as const;

/** Fixed layout numbers from the Figma frames (390-wide artboards). */
export const layout = {
  designWidth: 390,
  gutter: 24, // screen side padding
  heroTall: 290, // Sky backdrop · Size=Tall
  heroCompact: 180, // Sky backdrop · Size=Compact
  skyLip: 32, // height of the sheet lip at the bottom of the sky
  heroOverlap: 24, // the first card sits 24 px above the lip
} as const;

/**
 * Type scale. `family` + `weight` map to a loaded font on each platform:
 * mobile → Lexend_400Regular / _500Medium / _600SemiBold, RobotoMono_400Regular
 * web    → the `--font-sans` / `--font-mono` stacks in tokens.css
 */
export type TypeStyle = {
  family: "sans" | "mono";
  weight: 400 | 500 | 600;
  size: number;
  lineHeight: number;
  letterSpacing: number;
  uppercase?: boolean;
};

export const type = {
  title: { family: "sans", weight: 600, size: 26, lineHeight: 28, letterSpacing: -0.4 }, // "Good evening, Aina"
  heading: { family: "sans", weight: 500, size: 17, lineHeight: 24, letterSpacing: -0.2 }, // Figma "Heading"
  subheading: { family: "sans", weight: 500, size: 16, lineHeight: 24, letterSpacing: -0.2 }, // list-row titles
  bodyStrong: { family: "sans", weight: 500, size: 15, lineHeight: 22, letterSpacing: -0.1 }, // Figma "Body Strong", button labels
  body: { family: "sans", weight: 400, size: 15, lineHeight: 22, letterSpacing: -0.1 },
  label: { family: "sans", weight: 500, size: 13, lineHeight: 18, letterSpacing: 0 }, // Figma "Label", badges, tags
  small: { family: "sans", weight: 400, size: 13, lineHeight: 18, letterSpacing: 0 }, // speech bubble, sub-lines
  caption: { family: "sans", weight: 400, size: 12, lineHeight: 16, letterSpacing: 0 }, // Figma "Caption"
  captionStrong: { family: "sans", weight: 500, size: 12, lineHeight: 16, letterSpacing: 0 }, // chips, active tab label
  sectionLabel: { family: "sans", weight: 500, size: 12, lineHeight: 18, letterSpacing: 0.72, uppercase: true }, // "MICRO-PROJECTS FOR YOU"
  code: { family: "mono", weight: 400, size: 13, lineHeight: 20, letterSpacing: 0 },
} as const satisfies Record<string, TypeStyle>;

export type TypeVariant = keyof typeof type;

/** CSS font stacks for the web portal. */
export const fontStack = {
  sans: "'Lexend', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
} as const;

/** Shadows. Only floating elements get one — cards are flat. */
export const shadow = {
  bubble: { color: colors.shadow.ink, opacity: 0.1, offsetY: 4, blur: 12 }, // speech bubble, toasts
} as const;
