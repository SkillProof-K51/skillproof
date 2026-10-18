import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

const DOT = 8;

type Props = {
  done: number;
  of: number;
  /** butter = on the butter (today's challenge) card; default elsewhere. */
  tone?: "default" | "butter";
};

/** "2 of 3" as dots — e.g. challenges passed toward Practised. Filled dots are navy. */
export function ProgressDots({ done, of, tone = "default" }: Props) {
  const off = tone === "butter" ? colors.accent.butter : colors.border.default;
  return (
    <View style={styles.row} accessibilityLabel={`${done} of ${of}`} accessibilityRole="progressbar">
      {Array.from({ length: of }, (_, i) => (
        <View key={i} style={[styles.dot, { backgroundColor: i < done ? colors.action.primaryStrong : off }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: space.xs },
  dot: { width: DOT, height: DOT, borderRadius: radius.full },
});
