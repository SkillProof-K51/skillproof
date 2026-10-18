import { colors, radius, space } from "@skillproof/tokens";
import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "./Text";

const PAD = 3; // track padding around the selected pill

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Read by screen readers, e.g. "Filter skills". */
  accessibilityLabel: string;
};

/** Two to four filters side by side (All · Practised · Verified). The chosen one is a white pill. */
export function SegmentedControl<T extends string>({ options, value, onChange, accessibilityLabel }: Props<T>) {
  return (
    <View style={styles.track} accessibilityRole="tablist" accessibilityLabel={accessibilityLabel}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.segment, selected && styles.selected]}
          >
            <Text variant={selected ? "captionStrong" : "caption"} color={selected ? "primary" : "secondary"}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: "row", padding: PAD, borderRadius: radius.full, backgroundColor: colors.bg.subtle },
  segment: { flex: 1, alignItems: "center", paddingVertical: space.sm, borderRadius: radius.full },
  selected: { backgroundColor: colors.bg.surface },
});
