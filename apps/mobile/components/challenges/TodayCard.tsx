import { gap, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { TodaysChallenge } from "../../lib/challenges";
import { Button, Card, Chip, CodeBlock, ProgressDots, Text } from "../ui";

type Props = {
  challenge: TodaysChallenge;
  /** Opens the challenge (to do) or the Challenges tab (done → practise more). */
  onPress: () => void;
};

/**
 * Today's challenge (Module 3), under a "Today's challenge" section header (Azim, 18 Oct):
 * the role tint (Azim, 25 Oct); the title, a time chip, progress toward Practised, a peek at the first lines of
 * today's code in the editor look, and the screen's one strong button. Done → "Nice work!", a Done chip, "Practise more".
 */
export function TodayCard({ challenge, onPress }: Props) {
  const { done, preview } = challenge;
  const action = done ? "Practise more" : "Start challenge";
  return (
    <Card tone="role">
      <View style={styles.top}>
        <Text variant="heading" style={styles.title}>
          {done ? "Nice work!" : challenge.title}
        </Text>
        {done ? <Chip label="Done" icon="check" tone="surface" /> : <Chip label={`${challenge.minutes} min`} icon="clock" tone="surface" />}
      </View>
      <View style={styles.meta}>
        <ProgressDots done={challenge.passed} of={challenge.of} tone="role" />
        <Text variant="caption" color="secondary">
          {challenge.skill} · {challenge.passed} of {challenge.of} to Practised
        </Text>
      </View>
      {!done && preview?.length ? (
        <CodeBlock
          lines={preview}
          language={challenge.skill === "SQL" ? "sql" : "javascript"}
          accessibilityLabel="Preview of today's code"
          style={styles.code}
        />
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
  meta: { flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: gap.tight },
  code: { marginTop: space.md },
  button: { marginTop: space.md },
});
