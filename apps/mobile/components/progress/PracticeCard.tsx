import { radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { ChallengeKind } from "../../lib/challenges";
import { practiceTotal, type ProgressData } from "../../lib/progress";
import { KINDS } from "../challenges/ChallengeRow";
import { Card, StackedBar, Text } from "../ui";

const SWATCH = 10;
const ORDER: ChallengeKind[] = ["fix_bug", "sql_live", "explain_it"]; // fixed, so a kind keeps its place and colour

/**
 * Progress's first card (Module 3's practice report): the week's challenges as a big number, one bar
 * split by kind in the kinds' chart colours, and a legend with every count (colour is never alone).
 */
export function PracticeCard({ practice }: { practice: ProgressData["practice"] }) {
  const total = practiceTotal(practice);
  const said = ORDER.map((k) => `${KINDS[k].label} ${practice[k]}`).join(", ");
  return (
    <Card>
      <Text variant="label" color="secondary">
        Challenges done
      </Text>
      <View style={styles.hero}>
        <Text variant="display">{total}</Text>
        <Text variant="heading" color="secondary">
          this week
        </Text>
      </View>
      <StackedBar
        segments={ORDER.map((k) => ({ value: practice[k], colour: KINDS[k].colours.mark, label: KINDS[k].label }))}
        accessibilityLabel={`${total} challenges this week: ${said}`}
      />
      <View style={styles.legend}>
        {ORDER.map((k) => (
          <View key={k} style={styles.row}>
            <View style={[styles.swatch, { backgroundColor: KINDS[k].colours.mark }]} />
            <Text variant="body" style={styles.flex}>
              {KINDS[k].label}
            </Text>
            <Text variant="bodyStrong">{practice[k]}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: "row", alignItems: "baseline", gap: space.sm, marginTop: space.xxs, marginBottom: space.md },
  legend: { gap: space.sm, marginTop: space.lg },
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  swatch: { width: SWATCH, height: SWATCH, borderRadius: radius.full },
  flex: { flex: 1 },
});
