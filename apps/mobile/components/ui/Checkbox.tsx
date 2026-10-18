import { colors, opacity, radius, space } from "@skillproof/tokens";
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
  disabled?: boolean;
};

/** A tick box with its label — the whole row toggles it. Checked = navy with a white tick. */
export function Checkbox({ checked, onChange, label, description, disabled }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: !!disabled }}
      accessibilityLabel={description ? `${label}. ${description}` : label}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <View style={[styles.box, checked && styles.checked]}>
        {checked ? <Icon name="check" size={TICK} weight="bold" color={colors.action.onPrimaryStrong} /> : null}
      </View>
      <View style={styles.text}>
        <Text variant="body">{label}</Text>
        {description ? (
          <Text variant="caption" color="secondary">
            {description}
          </Text>
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
  text: { flex: 1, gap: space.xxs },
  pressed: { opacity: opacity.pressed },
  disabled: { opacity: opacity.disabled },
});
