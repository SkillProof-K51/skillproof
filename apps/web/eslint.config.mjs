import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// ── UI kit guardrail (AGENTS.md rule 13, docs/ui.md › The web portal) ────────────────────────
// Colours come from the portal tokens through shadcn's names (bg-primary, text-muted-foreground,
// border-border…); sizes from Tailwind's scale. These rules make `pnpm lint` (and CI) fail
// otherwise, the same way the mobile app's do — so the look doesn't depend on anyone, or any AI,
// remembering. A new look = change the token or the component in src/components/ui.
const KIT = "use a token through shadcn's names (bg-primary, text-muted-foreground…) or a kit component (AGENTS.md rule 13, docs/ui.md)";
// Tailwind's own palette (bg-blue-600, text-white…): the kit's semantic names replace it.
const PALETTE =
  "(?<![a-z0-9-])(bg|text|border|ring|fill|stroke|from|to|via|outline|decoration|divide|shadow|accent|caret|placeholder)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?![a-z])";
// A typed-in colour or size inside brackets: bg-[#fff], p-[13px], text-[0.8rem].
const ARBITRARY = "(?<![a-z0-9-])[a-z][a-z0-9-]*-\\[(#|rgb|hsl|oklch|[0-9.]+(px|rem|em|vh|vw)(?![a-z]))";

const colourRules = [
  { selector: "Literal[value=/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]", message: `Hex colour: ${KIT}.` },
  { selector: "Literal[value=/^(rgb|rgba|hsl|hsla|oklch)\\(/]", message: `Colour literal: ${KIT}.` },
  { selector: `Literal[value=/${PALETTE}/]`, message: `Tailwind palette colour: ${KIT}.` },
  { selector: `TemplateElement[value.raw=/${PALETTE}/]`, message: `Tailwind palette colour: ${KIT}.` },
];
const sizeRules = [
  { selector: `Literal[value=/${ARBITRARY}/]`, message: `Typed-in colour or size: ${KIT}.` },
  { selector: `TemplateElement[value.raw=/${ARBITRARY}/]`, message: `Typed-in colour or size: ${KIT}.` },
  { selector: 'JSXAttribute[name.name="style"] Property > Literal[value>0]', message: `Raw size in a style: ${KIT}.` },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Pages and their parts: no typed-in colours or sizes at all.
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: { "no-restricted-syntax": ["error", ...colourRules, ...sizeRules] },
  },
  // The kit itself (shadcn's components) may use exact sizes — that's where a look lives — but
  // still only token colours.
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: { "no-restricted-syntax": ["error", ...colourRules] },
  },
]);

export default eslintConfig;
