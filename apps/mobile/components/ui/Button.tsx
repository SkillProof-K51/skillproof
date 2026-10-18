import { colors, opacity, radius, space } from "@skillproof/tokens";
import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from "react-native";

import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

type Props = Omit<PressableProps, "style" | "children"> & {
  label: string;
  /**
   * primary = the ONE main action on a screen · secondary = everything else ·
   * danger = the confirm button of a delete / remove dialog (red = can't be undone) ·
   * text = a quiet text-only action beside a form (Forgot password?) — never the main one.
   */
  variant?: "primary" | "secondary" | "danger" | "text";
  icon?: IconName;
  /** Stretch to the container width (cards, sheets). */
  block?: boolean;
  style?: ViewStyle;
};

export function Button({ label, variant = "primary", icon, block, style, disabled, ...rest }: Props) {
  const filled = variant === "primary" || variant === "danger";
  const fg = filled ? colors.action.onPrimaryStrong : colors.text.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        block && styles.block,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={18} color={fg} /> : null}
      <Text variant="bodyStrong" color={fg}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    alignSelf: "flex-start",
  },
  primary: { backgroundColor: colors.action.primaryStrong },
  danger: { backgroundColor: colors.feedback.error.fg },
  secondary: {
    backgroundColor: colors.bg.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  text: { paddingHorizontal: 0 },
  block: { alignSelf: "stretch" },
  pressed: { opacity: opacity.pressed },
  disabled: { opacity: opacity.disabled },
});
