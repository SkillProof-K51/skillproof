import { colors, type, type TypeVariant } from "@skillproof/tokens";
import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from "react-native";

import { fontFamilyFor } from "./fonts";

const NAMED_COLORS = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  inverse: colors.text.inverse,
  verified: colors.status.verified.fg,
  practised: colors.status.practised.fg,
} as const;

export type TextColor = keyof typeof NAMED_COLORS;

type Props = RNTextProps & {
  variant?: TypeVariant;
  /** A named token colour. Pass a raw colour only from inside another ui component. */
  color?: TextColor | (string & {});
  align?: "left" | "center" | "right";
};

/** The only way to put text on screen — every variant is a token from `type`. */
export function Text({ variant = "body", color = "primary", align, style, ...rest }: Props) {
  const t = type[variant];
  const resolved = color in NAMED_COLORS ? NAMED_COLORS[color as TextColor] : color;
  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily: fontFamilyFor(t.family, t.weight),
          fontSize: t.size,
          lineHeight: t.lineHeight,
          letterSpacing: t.letterSpacing,
          color: resolved,
          textAlign: align,
        },
        "uppercase" in t && t.uppercase ? styles.uppercase : null,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  uppercase: { textTransform: "uppercase" },
});
