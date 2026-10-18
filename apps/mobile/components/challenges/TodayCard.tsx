import { colors, gap, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { TodaysChallenge } from "../../lib/challenges";
import { Button, Card, Chip, ProgressDots, Text } from "../ui";

const LINE_NUMBER = 18; // width of the line-number column in the code peek

type Props = {
  challenge: TodaysChallenge;
  /** Opens the challenge (to do) or the Challenges tab (done → practise more). */
  onPress: () => void;
};

/**
 * Today's challenge (Module 3), under a "Today's challenge" section header (Azim, 18 Oct):
 * butter = energy; the title, a time chip, progress toward Practised, a peek at the first lines of
 * today's code, and the screen's one strong button. Done → "Nice work!", a Done chip, "Practise more".
 */
export function TodayCard({ challenge, onPress }: Props) {
  const { done, preview } = challenge;
  const action = done ? "Practise more" : "Start challenge";
  return (
    <Card tone="butter">
      <View style={styles.top}>
        <Text variant="heading" style={styles.title}>
          {done ? "Nice work!" : challenge.title}
        </Text>
        {done ? <Chip label="Done" icon="check" tone="surface" /> : <Chip label={`${challenge.minutes} min`} icon="clock" tone="surface" />}
      </View>
      <View style={styles.meta}>
        <ProgressDots done={challenge.passed} of={challenge.of} tone="butter" />
        <Text variant="caption" color="secondary">
          {challenge.skill} · {challenge.passed} of {challenge.of} to Practised
        </Text>
      </View>
      {!done && preview?.length ? (
        <View style={styles.code} accessibilityLabel="Preview of today's code">
          {preview.map((line, i) => (
            <View key={i} style={styles.line}>
              <Text variant="code" color={colors.icon.muted} style={styles.lineNumber}>
                {i + 1}
              </Text>
              {/* leading spaces → no-break spaces, or the web collapses the indent */}
              <Text variant="code" numberOfLines={1} style={styles.flex}>
                {line.replace(/^ +/, (m) => " ".repeat(m.length))}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      <Button
        label={action}
        icon="play"
        block
        onPress={onPress}
        accessibilityLabel={done ? `${action} ${challenge.skill}` : `${action}: ${challenge.title}, ${challenge.minutes} minutes`}
        style={styles.button}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "flex-start", gap: space.md },
  title: { flex: 1 },
  flex: { flex: 1 },
  meta: { flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: gap.tight },
  code: { backgroundColor: colors.bg.surface, borderRadius: radius.tile, padding: space.md, marginTop: space.md },
  line: { flexDirection: "row", gap: space.sm },
  lineNumber: { width: LINE_NUMBER, textAlign: "right" },
  button: { marginTop: space.md },
});
