// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

// ── UI kit guardrail (AGENTS.md rule 13, docs/ui.md) ──────────────────────────────────────────
// Colours, fonts and spacing come from @skillproof/tokens; a size that belongs to one component is
// a named constant at the top of that file. These rules make `pnpm lint` (and CI) fail otherwise,
// so consistency doesn't depend on anyone — or any AI — remembering.
const KIT = "use a token from @skillproof/tokens or a named constant (AGENTS.md rule 13, docs/ui.md)";
const SIZE_KEYS =
  "^(margin|padding|gap|rowGap|columnGap|top|right|bottom|left|inset|width|height|minWidth|minHeight|maxWidth|maxHeight|borderRadius|borderTopLeftRadius|borderTopRightRadius|borderBottomLeftRadius|borderBottomRightRadius|fontSize|lineHeight|letterSpacing)";
// style objects: StyleSheet.create({...}) and inline style={{...}}
const STYLE_SCOPES = [
  'CallExpression[callee.object.name="StyleSheet"][callee.property.name="create"]',
  'JSXAttribute[name.name=/^(style|contentContainerStyle)$/]',
];
const rawNumber = (scope) => [
  { selector: `${scope} Property[key.name=/${SIZE_KEYS}/] > Literal[value>0]`, message: `Raw size in a style: ${KIT}.` },
  {
    selector: `${scope} Property[key.name=/${SIZE_KEYS}/] > UnaryExpression[operator="-"] > Literal[value>0]`,
    message: `Raw size in a style: ${KIT}.`,
  },
];

const uiKitRules = [
  { selector: "Literal[value=/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]", message: `Hex colour: ${KIT}.` },
  { selector: "Literal[value=/^(rgb|rgba|hsl|hsla)\\(/]", message: `Colour literal: ${KIT}.` },
  { selector: 'Property[key.name="fontFamily"] > Literal', message: "Font name: use <Text variant=…> or fontFamilyFor() from components/ui/fonts." },
  ...STYLE_SCOPES.flatMap(rawNumber),
];

module.exports = defineConfig([
  expoConfig,
  { ignores: ["dist/*", ".expo/*"] },
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    rules: { "no-restricted-syntax": ["error", ...uiKitRules] },
  },
  {
    // The one exception: generated third-party logo data (Simple Icons). Its hex values are the
    // brands' own colours, not design choices, so they don't belong in our tokens. No styles here.
    files: ["components/ui/skillLogos.ts"],
    rules: { "no-restricted-syntax": "off" },
  },
]);
