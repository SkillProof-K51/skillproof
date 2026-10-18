import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Text } from "./Text";

const HEIGHT = 120; // the bar area
const BAR = 14;
const VALUE_MIN = 4; // a zero still shows as a stub

type Props = {
  /** One per column, in order. */
  values: number[];
  /** One per column: "Mon", "W1", a skill name. */
  labels: string[];
  /** Full height. Leave out to scale to the biggest value; pass a goal to show each bar against it. */
  max?: number;
  /** The column to call out — today, this week, the chosen skill. */
  highlight?: number;
  /** Text above each bar, e.g. a percentage of the goal. Leave out for no labels. */
  format?: (value: number, index: number) => string;
  accessibilityLabel: string;
};

/**
 * A small single-series bar chart for the report screens: practice minutes per day, challenges
 * per week, demand per skill. One hue (blue), the highlighted bar in brand blue, a faint track to
 * the goal behind each bar. Values arrive computed (rule 2).
 */
export function BarChart({ values, labels, max, highlight, format, accessibilityLabel }: Props) {
  const top = max ?? Math.max(...values, 1);
  return (
    <View style={styles.chart} accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      {values.map((v, i) => {
        const hot = i === highlight;
        const fill = Math.max(VALUE_MIN, Math.round((HEIGHT * Math.min(v, top)) / top));
        return (
          <View key={i} style={styles.column}>
            {format ? (
              <Text variant={hot ? "captionStrong" : "caption"} color={hot ? "primary" : "secondary"} numberOfLines={1}>
                {format(v, i)}
              </Text>
            ) : null}
            <View style={styles.track}>
              <View style={[styles.fill, { height: fill }, hot ? styles.fillHot : styles.fillCool]} />
            </View>
            <Text variant={hot ? "captionStrong" : "caption"} color={hot ? "primary" : "secondary"} numberOfLines={1}>
              {labels[i]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: "row", alignItems: "flex-end" },
  column: { flex: 1, alignItems: "center", gap: space.xs },
  // the goal: a faint full-height track the bar fills from the bottom
  track: { width: BAR, height: HEIGHT, borderRadius: radius.full, backgroundColor: colors.bg.subtle, justifyContent: "flex-end", overflow: "hidden" },
  fill: { width: BAR, borderRadius: radius.full },
  fillCool: { backgroundColor: colors.accent.progress },
  fillHot: { backgroundColor: colors.accent.brand },
});
