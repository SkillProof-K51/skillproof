import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

const HEIGHT = 8; // segment thickness, from Azim's reference (24 Oct)

/** strong = done (e.g. Verified) · soft = on the way (e.g. Practised) · empty = not started. */
export type SegmentFill = "strong" | "soft" | "empty";

// In the role colour on white cards (Azim picked purple over his reference's yellow, 24 Oct).
const COLOURS = { empty: colors.border.default, strong: colors.accent.progress, soft: colors.accent.sky } as const;

type Props = {
  /** One entry per step, in order — e.g. one per roadmap skill. */
  segments: SegmentFill[];
  /** Says what the segments mean, e.g. "3 of 6 skills Verified, 2 Practised". */
  accessibilityLabel: string;
};

/** A row of equal, whole segments in three strengths. Values arrive computed (rule 2). */
export function SegmentedProgress({ segments, accessibilityLabel }: Props) {
  return (
    <View style={styles.row} accessibilityRole="progressbar" accessibilityLabel={accessibilityLabel}>
      {segments.map((fill, i) => (
        <View key={i} style={[styles.segment, { backgroundColor: COLOURS[fill] }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: space.sm },
  segment: { flex: 1, height: HEIGHT, borderRadius: radius.full },
});
