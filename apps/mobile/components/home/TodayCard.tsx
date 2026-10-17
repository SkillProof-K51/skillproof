import { gap, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { TodaysChallenge } from "../../lib/home";
import { Button, Card, Chip, Mascot, Text } from "../ui";

const MASCOT_WIDTH = 104; // the one in-card mascot on Home

type Props = {
  challenge: TodaysChallenge;
  /** Opens the challenge (to do) or the Challenges tab (done → practise more). */
  onPress: () => void;
};

/**
 * Today's challenge (Module 3): one per day, butter = energy. To do → the screen's one strong CTA.
 * Done → "Done for today", happy mascot, a quiet "Practise more", so finishing feels like a win.
 */
export function TodayCard({ challenge, onPress }: Props) {
  const { done } = challenge;
  return (
    <Card tone="butter" style={styles.card}>
      <View style={styles.body}>
        <View style={styles.text}>
          {done ? (
            <Chip label="Done for today" tone="verified" icon="check" />
          ) : (
            <Chip label={`Today · ${challenge.minutes} min`} tone="butter" icon="clock" />
          )}
          <Text variant="heading">{done ? "Nice work!" : challenge.title}</Text>
          <Text variant="caption" color="secondary">
            {done ? "A new challenge arrives tomorrow." : `${challenge.skill} · ${challenge.passed} of ${challenge.of} passed`}
          </Text>
        </View>
        <Mascot pose={done ? "happy" : "idea"} width={MASCOT_WIDTH} />
      </View>
      {done ? (
        <Button label="Practise more" variant="secondary" block onPress={onPress} />
      ) : (
        <Button label="Start challenge" block onPress={onPress} />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.md },
  body: { flexDirection: "row", alignItems: "center", gap: space.md },
  text: { flex: 1, gap: gap.tight },
});
