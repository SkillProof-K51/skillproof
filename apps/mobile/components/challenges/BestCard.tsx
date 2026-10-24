import { space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { toPractisedLabel, type Challenge, type SkillProgress } from "../../lib/challenges";
import { Card, Chip, SegmentedProgress, Text, type SegmentFill } from "../ui";

type Props = {
  best: Challenge["best"];
  progress: SkillProgress;
};

/**
 * A challenge page's first card: the best score so far, big with a grey unit (or "Not tried
 * yet"), then the skill's passes toward Practised. Scores come from the challenge scorer (rule 2).
 */
export function BestCard({ best, progress }: Props) {
  const passes: SegmentFill[] = Array.from({ length: progress.of }, (_, i) => (i < progress.passed ? "strong" : "empty"));
  const practised = progress.passed >= progress.of;
  return (
    <Card>
      <Text variant="label" color="secondary">
        Your best
      </Text>
      {best ? (
        <View style={styles.score}>
          <Text variant="display">{best.score}</Text>
          <Text variant="heading" color="secondary" style={styles.unit}>
            %
          </Text>
          {/* a pass counts toward Practised: blue, as in the list */}
          {best.passed ? <Chip label="Passed" icon="check" tone="practised" /> : <Chip label="Not passed yet" />}
        </View>
      ) : (
        <Text variant="title" style={styles.untried}>
          Not tried yet
        </Text>
      )}
      <SegmentedProgress segments={passes} accessibilityLabel={`${progress.passed} of ${progress.of} ${progress.skill} challenges passed`} />
      <Text variant="small" color="secondary" style={styles.caption}>
        {progress.passed} of {progress.of} {progress.skill} passes · {practised ? "Practised" : toPractisedLabel(progress)}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  score: { flexDirection: "row", alignItems: "baseline", gap: space.xs, marginTop: space.xxs, marginBottom: space.md },
  unit: { marginRight: space.sm },
  untried: { marginTop: space.xs, marginBottom: space.md },
  caption: { marginTop: space.sm },
});
