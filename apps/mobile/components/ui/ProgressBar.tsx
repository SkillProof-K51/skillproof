import { colors, radius } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

const HEIGHT = 6; // thin bar, same as the passport's readiness track

type Props = {
  /** 0–100 integer (rule 2: computed elsewhere, only displayed here). */
  percent: number;
};

/** Thin progress bar: track in border/default, fill in accent/progress. */
export function ProgressBar({ percent }: Props) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: p }}>
      <View style={[styles.fill, { width: `${p}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: HEIGHT, borderRadius: radius.full, backgroundColor: colors.border.default, overflow: "hidden" },
  fill: { height: HEIGHT, borderRadius: radius.full, backgroundColor: colors.accent.progress },
});
