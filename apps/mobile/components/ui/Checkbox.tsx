import { colors, opacity, radius, space, type } from "@skillproof/tokens";
import { Pressable, StyleSheet, View } from "react-native";

import { Icon } from "./Icon";
import { Text } from "./Text";

const BOX = 22;
const BORDER = 1.5;
const TICK = 14;

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** A second, quieter line under the label. */
  description?: string;
  /** Red box and a message under the label — e.g. a consent that must be ticked. Say what to do. */
  error?: string;
  disabled?: boolean;
};

/** A tick box with its label — the whole row toggles it. Checked = navy with a white tick. */
export function Checkbox({ checked, onChange, label, description, error, disabled }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: !!disabled }}
      accessibilityLabel={[label, description, error].filter(Boolean).join(". ")}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <View style={[styles.box, checked && styles.checked, error && !checked && styles.boxError]}>
        {checked ? <Icon name="check" size={TICK} weight="bold" color={colors.action.onPrimaryStrong} /> : null}
      </View>
      <View style={styles.text}>
        <Text variant="body">{label}</Text>
        {description ? (
          <Text variant="caption" color="secondary">
            {description}
          </Text>
        ) : null}
        {error ? (
          <View style={styles.message} accessibilityLiveRegion="polite">
            <Icon name="alert" size={type.caption.lineHeight} color={colors.feedback.error.fg} />
            <Text variant="caption" color={colors.feedback.error.fg} style={styles.flex}>
              {error}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: space.md },
  box: {
    width: BOX,
    height: BOX,
    borderRadius: radius.control,
    borderWidth: BORDER,
    borderColor: colors.icon.muted,
    backgroundColor: colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: { backgroundColor: colors.action.primaryStrong, borderColor: colors.action.primaryStrong },
  boxError: { borderColor: colors.feedback.error.fg },
  message: { flexDirection: "row", alignItems: "flex-start", gap: space.xs }, // a 2-line message keeps the icon on line 1
  flex: { flex: 1 },
  text: { flex: 1, gap: space.xxs },
  pressed: { opacity: opacity.pressed },
  disabled: { opacity: opacity.disabled },
});
