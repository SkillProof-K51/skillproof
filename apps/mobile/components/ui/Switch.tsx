import { colors, opacity, space } from "@skillproof/tokens";
import { Platform, Switch as RNSwitch, StyleSheet, View } from "react-native";

import { Text } from "./Text";

// react-native-web colours the "on" thumb from its own prop (default teal) and ignores thumbColor
// there; native has no such prop. Same white thumb everywhere.
const WEB_ON_THUMB = Platform.OS === "web" ? ({ activeThumbColor: colors.bg.surface } as object) : {};

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  /** A second, quieter line under the label. */
  description?: string;
  disabled?: boolean;
};

/**
 * An on/off setting with its label (e.g. "Show this skill on my public passport"). The platform's
 * own switch, in our colours — it already handles touch, motion and screen readers.
 */
export function Switch({ value, onValueChange, label, description, disabled }: Props) {
  return (
    <View style={[styles.row, disabled && styles.disabled]}>
      <View style={styles.text}>
        <Text variant="body">{label}</Text>
        {description ? (
          <Text variant="caption" color="secondary">
            {description}
          </Text>
        ) : null}
      </View>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={label}
        trackColor={{ false: colors.border.default, true: colors.accent.brand }}
        thumbColor={colors.bg.surface}
        ios_backgroundColor={colors.border.default}
        {...WEB_ON_THUMB}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  text: { flex: 1, gap: space.xxs },
  disabled: { opacity: opacity.disabled },
});
