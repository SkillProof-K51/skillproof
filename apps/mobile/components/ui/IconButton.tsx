import { colors, opacity, radius } from "@skillproof/tokens";
import { Pressable, StyleSheet } from "react-native";

import { Icon, type IconName } from "./Icon";

const SIZE = 40; // the circle
const ICON = 20;
const HIT = 4; // hitSlop: 40 + 2×4 = a 48 px touch target

type Props = {
  icon: IconName;
  /** Read by screen readers — say what it does ("Back", "Share passport"). Required: there's no text. */
  accessibilityLabel: string;
  onPress: () => void;
  /** surface = white circle (on the sky, the default) · subtle = grey circle (on white cards). */
  tone?: "surface" | "subtle";
  disabled?: boolean;
};

/** A round icon-only button: back, share, more. Always give it an accessibilityLabel. */
export function IconButton({ icon, accessibilityLabel, onPress, tone = "surface", disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.circle,
        tone === "subtle" ? styles.subtle : styles.surface,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Icon name={icon} size={ICON} color={colors.text.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: { width: SIZE, height: SIZE, borderRadius: radius.full, alignItems: "center", justifyContent: "center" },
  surface: { backgroundColor: colors.bg.surface },
  subtle: { backgroundColor: colors.bg.subtle },
  pressed: { opacity: opacity.pressed },
  disabled: { opacity: opacity.disabled },
});
