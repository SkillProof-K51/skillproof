import { colors, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { readinessNow, type ProgressData } from "../../lib/progress";
import { Card, LineChart, Text } from "../ui";

/**
 * Progress's second card: readiness now (from Module 2's fit engine), its change this week, and the
 * week as a dotted line (Azim's pick of 3 styles) zoomed to where it moves, with the Ready line.
 * Only the last point is labelled.
 */
export function ReadinessTrendCard({ readiness }: { readiness: ProgressData["readiness"] }) {
  const { days, readyAt, role } = readiness;
  const { now, change } = readinessNow(days);
  const signed = `${change > 0 ? "+" : change < 0 ? "−" : ""}${Math.abs(change)} this week`;
  return (
    <Card>
      <Text variant="label" color="secondary">
        Readiness · {role}
      </Text>
      <View style={styles.hero}>
        <Text variant="display">{now}</Text>
        <Text variant="heading" color="secondary" style={styles.unit}>
          %
        </Text>
        {/* direction × whether up is good, as on a Stat tile */}
        <Text variant="bodyStrong" color={change >= 0 ? colors.feedback.success.fg : colors.feedback.error.fg}>
          {signed}
        </Text>
      </View>
      <LineChart
        values={days.map((d) => d.percent)}
        labels={days.map((d) => d.label)}
        reference={{ value: readyAt, label: `Ready at ${readyAt}%` }}
        format={(v) => `${v}%`}
        accessibilityLabel={`Readiness this week, day by day: ${days.map((d) => `${d.percent}%`).join(", ")}. Ready is ${readyAt}%.`}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: "row", alignItems: "baseline", gap: space.xs, marginTop: space.xxs, marginBottom: space.lg },
  unit: { marginRight: space.sm },
});
