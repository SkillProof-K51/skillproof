import { colors, opacity, radius, space, type } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Icon } from "./Icon";
import { Text } from "./Text";

const BORDER = 1;
// same height as a Button, so a field and a button line up side by side
export const FIELD_HEIGHT = type.body.lineHeight + 2 * space.md + 2 * BORDER;

type Props = {
  label: string;
  helper?: string;
  error?: string;
  focused?: boolean;
  disabled?: boolean;
  /** Makes the whole box tappable (Select). */
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  children: ReactNode;
};

/**
 * The frame every field shares (TextField, Select): label above, the box, helper or error below.
 * Brand-blue border while focused / open, red with an error, grey when disabled.
 */
export function FieldFrame({ label, helper, error, focused, disabled, onPress, accessibilityLabel, accessibilityHint, children }: Props) {
  const borderColor = error ? colors.feedback.error.fg : focused ? colors.accent.brand : colors.border.default;
  const boxStyle = [styles.box, { borderColor }, disabled && styles.disabled];
  return (
    <View style={styles.wrap}>
      <Text variant="label">{label}</Text>
      {onPress ? (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ disabled: !!disabled, expanded: !!focused }}
          style={({ pressed }) => [...boxStyle, pressed && styles.pressed]}
        >
          {children}
        </Pressable>
      ) : (
        <View style={boxStyle}>{children}</View>
      )}
      {error ? (
        <View style={styles.message} accessibilityLiveRegion="polite">
          <Icon name="alert" size={type.caption.lineHeight} color={colors.feedback.error.fg} />
          <Text variant="caption" color={colors.feedback.error.fg} style={styles.flex}>
            {error}
          </Text>
        </View>
      ) : helper ? (
        <Text variant="caption" color="secondary">
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    height: FIELD_HEIGHT,
    paddingHorizontal: space.lg,
    borderWidth: BORDER,
    borderRadius: radius.lg,
    backgroundColor: colors.bg.surface,
  },
  disabled: { backgroundColor: colors.bg.subtle },
  pressed: { opacity: opacity.pressed },
  message: { flexDirection: "row", alignItems: "flex-start", gap: space.xs }, // a 2-line message keeps the icon on line 1
  flex: { flex: 1 },
});
