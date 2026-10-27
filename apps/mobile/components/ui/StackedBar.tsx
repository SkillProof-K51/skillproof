import { StyleSheet, View } from "react-native";

const HEIGHT = 12;
const GAP = 2; // the surface gap between segments — never a border (dataviz mark specs)
const END = 4; // rounded data-ends

export type Segment = { value: number; colour: string; label: string };

type Props = {
  /** In a fixed order, each with its own colour (e.g. `KINDS[kind].colours.mark`). */
  segments: Segment[];
  /** Every value in words: the bar's table view for screen readers. */
  accessibilityLabel: string;
};

/**
 * One bar split into parts of a whole (a week's challenges by kind). Put a legend with the counts
 * beside it: colour is never the only way to tell parts apart. Values arrive computed (rule 2).
 */
export function StackedBar({ segments, accessibilityLabel }: Props) {
  const shown = segments.filter((s) => s.value > 0);
  return (
    <View style={styles.bar} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      {shown.map((s, i) => (
        <View
          key={s.label}
          style={[styles.segment, { flex: s.value, backgroundColor: s.colour }, i === 0 && styles.first, i === shown.length - 1 && styles.last]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", gap: GAP, height: HEIGHT },
  segment: { height: HEIGHT },
  first: { borderTopLeftRadius: END, borderBottomLeftRadius: END },
  last: { borderTopRightRadius: END, borderBottomRightRadius: END },
});
